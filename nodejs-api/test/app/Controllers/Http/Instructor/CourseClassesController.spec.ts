import test from 'japa'
import faker from 'faker'
import supertest from 'supertest'

import User from 'App/Models/User'
import Course from 'App/Models/Course'

import { BASE_URL } from 'Test/constants'
import { getLoggedUser } from 'Test/utils/user-utils'
import { createRandomCourses } from 'Test/utils/course-utils'

test.group('CourseClassesController', () => {
  test.group('/instructor/course-class', (group) => {
    group.beforeEach(async () => {
      await User.query().delete()
      await Course.query().delete()
    })

    test.group('GET /instructor/course-class/:courseId', () => {
      test('when user is a instructor and have 1 course with 5 classes', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const total = 5
        const [course] = await createRandomCourses(user.id, 1, total)

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(
            `/instructor/course-class/${course.id}?page=${page}&limit=${limit}`
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

      test('when user is a instructor and have 1 course with 50 classes (pagination)', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const total = 50
        const [course] = await createRandomCourses(user.id, 1, total)

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(
            `/instructor/course-class/${course.id}?page=${page}&limit=${limit}`
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
            `/instructor/course-class/${course.id}${response.body.meta.next_page_url}&limit=${limit}`
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

      test('when user is a instructor and have a course without classes', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 0)

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(
            `/instructor/course-class/${course.id}?page=${page}&limit=${limit}`
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

      test('when user try to get classes of a course from another user', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1, 0)

        await supertest(BASE_URL)
          .get(`/instructor/course-class/${course.id}?page=1&limit=10`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not a instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .get('/instructor/course')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('GET /instructor/course-class/:courseId/:id', () => {
      test('when used a valid class id', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1)
        const courseClass = course.classes[0]

        const response = await supertest(BASE_URL)
          .get(`/instructor/course-class/${course.id}/${courseClass.id}`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.id, courseClass.id)
      })

      test('when used an invalid class id', async () => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 0)

        await supertest(BASE_URL)
          .get(`/instructor/course-class/${course.id}/0`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user a class id from another user', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user2.id, 1, 1)

        await supertest(BASE_URL)
          .get(`/instructor/course-class/${course.id}/${course.classes[0].id}`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .get('/instructor/course-class/1/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('POST /instructor/course-class/:courseId', () => {
      test('when valid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 0)

        const title = faker.lorem.words(2)
        const youtubeId = faker.random.alphaNumeric(8)
        const description = faker.random.boolean()
          ? faker.lorem.words(10)
          : undefined

        const response = await supertest(BASE_URL)
          .post(`/instructor/course-class/${course.id}`)
          .send({
            title,
            youtubeId,
            description,
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(201)

        assert.isObject(response)
        assert.equal(response.body.course_id, course.id)
        assert.equal(response.body.title, title)
        assert.equal(response.body.youtube_id, youtubeId)
        assert.equal(response.body.description, description)
      })

      test('when lacking data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 0)

        const title = faker.lorem.words(2)
        const description = faker.random.boolean()
          ? faker.lorem.words(10)
          : undefined

        const response = await supertest(BASE_URL)
          .post(`/instructor/course-class/${course.id}`)
          .send({ title, description })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('when title, shortDescription or description are invalid', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 0)

        const title = faker.lorem.words(71)
        const youtubeId = faker.random.alphaNumeric(31)

        const response = await supertest(BASE_URL)
          .post(`/instructor/course-class/${course.id}`)
          .send({ title, youtubeId })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 2)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .post('/instructor/course-class/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('PUT /instructor/course-class/:courseId/:id', () => {
      test('when valid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1)
        const courseClass = course.classes[0]

        // different amount of words
        const title = faker.lorem.words(1)
        const youtubeId = faker.random.alphaNumeric(7)
        const description = faker.lorem.words(9)

        const response = await supertest(BASE_URL)
          .put(`/instructor/course-class/${course.id}/${courseClass.id}`)
          .send({
            title,
            youtubeId,
            description,
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.course_id, course.id)
        assert.equal(response.body.title, title)
        assert.equal(response.body.description, description)
        assert.equal(response.body.youtube_id, youtubeId)
        assert.notEqual(response.body.title, courseClass.title)
        assert.notEqual(response.body.description, courseClass.description)
        assert.notEqual(response.body.youtube_id, courseClass.youtubeId)
      })

      test('when lacking data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1)
        const courseClass = course.classes[0]

        const title = faker.lorem.words(2)

        const response = await supertest(BASE_URL)
          .put(`/instructor/course-class/${course.id}/${courseClass.id}`)
          .send({ title })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('when title or youtubeId are invalid', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1, 1)
        const courseClass = course.classes[0]

        const title = faker.lorem.words(71)
        const youtubeId = faker.random.alphaNumeric(31)

        const response = await supertest(BASE_URL)
          .put(`/instructor/course-class/${course.id}/${courseClass.id}`)
          .send({ title, youtubeId })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 2)
      })

      test('when user is not the course owner', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1, 1)

        await supertest(BASE_URL)
          .put(`/instructor/course-class/${course.id}/${course.classes[0].id}`)
          .send({
            title: faker.lorem.words(2),
            youtubeId: faker.random.alphaNumeric(8),
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when id is invalid', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .put('/instructor/course-class/1/1')
          .send({
            title: faker.lorem.words(2),
            youtubeId: faker.random.alphaNumeric(8),
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .put('/instructor/course-class/1/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('PATCH /instructor/course-class/:courseId/:id/active', () => {
      test('when valid request', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1)
        const courseClass = course.classes[0]

        const response = await supertest(BASE_URL)
          .patch(
            `/instructor/course-class/${course.id}/${courseClass.id}/active`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.notEqual(response.body.is_public, courseClass.isPublic)
      })

      test('when user is not the course owner', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1, 1)

        await supertest(BASE_URL)
          .patch(
            `/instructor/course-class/${course.id}/${course.classes[0].id}/active`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when id is invalid', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .patch('/instructor/course-class/1/1/active')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .patch('/instructor/course-class/1/1/active')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('PATCH /instructor/course-class/:courseId/:id/reorder', () => {
      test('when increasing position', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 4)
        const courseClassId = course.classes[0].id

        const position = 3

        const response = await supertest(BASE_URL)
          .patch(
            `/instructor/course-class/${course.id}/${courseClassId}/reorder`
          )
          .send({ position })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.order, position)

        await course.preload('classes', query => query.orderBy('order', 'asc'))

        // check new positions
        assert.notEqual(course.classes[0].id, courseClassId)
        assert.equal(course.classes[2].id, courseClassId)
      })

      test('when decreasing position', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 4)
        const courseClassId = course.classes[2].id

        const position = 1

        const response = await supertest(BASE_URL)
          .patch(
            `/instructor/course-class/${course.id}/${courseClassId}/reorder`
          )
          .send({ position })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.order, position)

        await course.preload('classes', query => query.orderBy('order', 'asc'))

        // check new positions
        assert.notEqual(course.classes[2].id, courseClassId)
        assert.equal(course.classes[0].id, courseClassId)
      })

      test('when invalid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 1)
        const courseClass = course.classes[0]

        const response = await supertest(BASE_URL)
          .patch(
            `/instructor/course-class/${course.id}/${courseClass.id}/reorder`
          )
          .send({ position: -1 })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        // nothing changed
        assert.equal(response.body.order, courseClass.order)
      })

      test('when invalid position', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user.id, 1, 3)
        const courseClass = course.classes[2]

        const response = await supertest(BASE_URL)
          .patch(
            `/instructor/course-class/${course.id}/${courseClass.id}/reorder`
          )
          .send({ position: 5 })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 1)
      })

      test('when user is not the course owner', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1, 1)

        await supertest(BASE_URL)
          .patch(
            `/instructor/course-class/${course.id}/${course.classes[0].id}/reorder`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when id is invalid', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .patch('/instructor/course-class/1/1/reorder')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .patch('/instructor/course-class/1/1/reorder')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })
  })
})
