import test from 'japa'
import faker from 'faker'
import supertest from 'supertest'

import User from 'App/Models/User'
import Course from 'App/Models/Course'
import Lambda from 'App/Models/Lambda'

import { BASE_URL } from 'Test/constants'
import { getLoggedUser } from 'Test/utils/user-utils'
import { createRandomCourses, createLambda } from 'Test/utils/course-utils'

test.group('CourseClassExercisesController', () => {
  test.group('/instructor/course-class-exercise', (group) => {
    group.beforeEach(async () => {
      await User.query().delete()
      await Course.query().delete()
      await Lambda.query().delete()
    })

    test.group('GET /instructor/course-class-exercise/:classId', () => {
      test('when user is a instructor and have 5 exercises', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const total = 5
        const [course] = await createRandomCourses(user.id, 1, 1, total)
        const courseClass = course.classes[0]

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(
            `/instructor/course-class-exercise/${courseClass.id}?page=${page}&limit=${limit}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.meta.next_page_url, null)
        assert.equal(response.body.meta.current_page, page)
        assert.equal(response.body.meta.per_page, limit)
        assert.equal(response.body.meta.total, total)
        assert.equal(response.body.data.length, total)
      })

      test('when user is a instructor and have 50 exercises (pagination)', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const total = 50
        const [course] = await createRandomCourses(user.id, 1, 1, total)
        const courseClass = course.classes[0]

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(
            `/instructor/course-class-exercise/${courseClass.id}?page=${page}&limit=${limit}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.notEqual(response.body.meta.next_page_url, null)
        assert.equal(response.body.meta.current_page, page)
        assert.equal(response.body.meta.per_page, limit)
        assert.equal(response.body.meta.total, total)
        assert.equal(response.body.data.length, limit)

        const response2 = await supertest(BASE_URL)
          .get(
            `/instructor/course-class-exercise/${courseClass.id}${response.body.meta.next_page_url}&limit=${limit}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response2)
        assert.equal(response2.body.meta.current_page, page + 1)
        assert.equal(response2.body.meta.per_page, limit)
        assert.equal(response2.body.meta.total, total)
        assert.equal(response2.body.data.length, limit)
      })

      test('when user is a instructor and have no exercises', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1, 0)
        const courseClass = course.classes[0]

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(
            `/instructor/course-class-exercise/${courseClass.id}?page=${page}&limit=${limit}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.meta.next_page_url, null)
        assert.equal(response.body.meta.current_page, page)
        assert.equal(response.body.meta.per_page, limit)
        assert.equal(response.body.meta.total, 0)
        assert.equal(response.body.data.length, 0)
      })

      test('when user try to get exercises of a courseClass from another user', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1, 1, 0)
        const courseClass = course.classes[0]

        await supertest(BASE_URL)
          .get(
            `/instructor/course-class-exercise/${courseClass.id}?page=1&limit=10`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not a instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .get('/instructor/course-class-exercise/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('GET /instructor/course-class-exercise/:classId/:id', () => {
      test('when used a valid exercise id', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        const response = await supertest(BASE_URL)
          .get(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.id, exercise.id)
      })

      test('when used an invalid exercise id', async () => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1, 0)
        const courseClass = course.classes[0]

        await supertest(BASE_URL)
          .get(`/instructor/course-class-exercise/${courseClass.id}/0`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user a exercise id from another user', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user2.id, 1, 1, 1)
        const courseClass = course.classes[0]

        await supertest(BASE_URL)
          .get(
            `/instructor/course-class-exercise/${courseClass.id}/${courseClass.exercises[0].id}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .get('/instructor/course-class-exercise/1/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('POST /instructor/course-class-exercise/:classId', () => {
      test('when valid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1, 0)
        const courseClass = course.classes[0]

        const exerciseUrl = faker.internet.url()
        const lambda = await createLambda()

        const response = await supertest(BASE_URL)
          .post(`/instructor/course-class-exercise/${courseClass.id}`)
          .send({
            exerciseUrl,
            lambdaId: lambda.id,
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(201)

        assert.isObject(response)
        assert.equal(response.body.course_class_id, courseClass.id)
        assert.equal(response.body.exercise_url, exerciseUrl)
        assert.equal(response.body.lambda_id, lambda.id)
      })

      test('when lacking data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1, 0)

        const response = await supertest(BASE_URL)
          .post(`/instructor/course-class-exercise/${course.classes[0].id}`)
          .send({})
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('when exerciseUrl is invalid', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1, 0)

        const exerciseUrl = faker.lorem.words(255)

        const response = await supertest(BASE_URL)
          .post(`/instructor/course-class-exercise/${course.classes[0].id}`)
          .send({ exerciseUrl })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 1)
      })

      test('when baseCodeUrl is invalid', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1, 0)

        const exerciseUrl = faker.internet.url()
        const baseCodeUrl = faker.random.words(255)

        const response = await supertest(BASE_URL)
          .post(`/instructor/course-class-exercise/${course.classes[0].id}`)
          .send({ exerciseUrl, baseCodeUrl })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 1)
      })

      test('when lambdaId is invalid', async () => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1, 0)

        const exerciseUrl = faker.internet.url()

        await supertest(BASE_URL)
          .post(`/instructor/course-class-exercise/${course.classes[0].id}`)
          .send({ exerciseUrl, lambdaId: 1000 })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .post('/instructor/course-class-exercise/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('PUT /instructor/course-class-exercise/:classId/:id', () => {
      test('when valid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        let exerciseUrl: string
        do {
          exerciseUrl = faker.internet.url()
        } while (exerciseUrl === exercise.exerciseUrl)

        const response = await supertest(BASE_URL)
          .put(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .send({ exerciseUrl })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.course_class_id, courseClass.id)
        assert.equal(response.body.exercise_url, exerciseUrl)
        assert.notEqual(response.body.exercise_url, exercise.exerciseUrl)
      })

      test('when lacking data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        const response = await supertest(BASE_URL)
          .put(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .send({})
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('when exerciseUrl is invalid', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        const exerciseUrl = faker.lorem.words(255)

        const response = await supertest(BASE_URL)
          .put(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .send({ exerciseUrl })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 1)
      })

      test('when baseCodeUrl is invalid', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        const exerciseUrl = faker.internet.url()
        const baseCodeUrl = faker.random.words(255)

        const response = await supertest(BASE_URL)
          .put(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .send({ exerciseUrl, baseCodeUrl })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 1)
      })

      test('when lambdaId is invalid', async () => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        const exerciseUrl = faker.internet.url()

        await supertest(BASE_URL)
          .put(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .send({ exerciseUrl, lambdaId: 1000 })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not the course owner', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        await supertest(BASE_URL)
          .put(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .send({
            exerciseUrl: faker.internet.url(),
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when id is invalid', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .put('/instructor/course-class-exercise/1/1')
          .send({
            exerciseUrl: faker.internet.url(),
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .put('/instructor/course-class-exercise/1/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('DELETE /instructor/course-class-exercise/:classId/:id', () => {
      test('when valid data', async () => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        await supertest(BASE_URL)
          .delete(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(204)

        await supertest(BASE_URL)
          .get(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not the course owner', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1, 1, 1)
        const courseClass = course.classes[0]
        const exercise = courseClass.exercises[0]

        await supertest(BASE_URL)
          .delete(
            `/instructor/course-class-exercise/${courseClass.id}/${exercise.id}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when id is invalid', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .delete('/instructor/course-class-exercise/1/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .delete('/instructor/course-class-exercise/1/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })
  })
})
