import path from 'path'
import test from 'japa'
import faker from 'faker'
import supertest from 'supertest'

import User from 'App/Models/User'
import Course from 'App/Models/Course'
import { CourseStatus } from 'App/Helpers/CourseStatus'

import { BASE_URL } from 'Test/constants'
import { getLoggedUser } from 'Test/utils/user-utils'
import { createRandomCourses } from 'Test/utils/course-utils'

// file for tests
const filepath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'files',
  'thumbnail.png'
)

test.group('CoursesController', () => {
  test.group('/instructor', (group) => {
    group.beforeEach(async () => {
      await User.query().delete()
      await Course.query().delete()
    })

    test.group('GET /instructor/course', () => {
      test('when user is a instructor and have 5 courses', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const total = 5
        await createRandomCourses(user.id, total)

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(`/instructor/course?page=${page}&limit=${limit}`)
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

      test('when user is a instructor and have 50 courses (pagination)', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const total = 50
        await createRandomCourses(user.id, total)

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(`/instructor/course?page=${page}&limit=${limit}`)
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
            `/instructor/course${response.body.meta.next_page_url}&limit=${limit}`
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

      test('when user is a instructor and do not have courses', async (assert) => {
        const { auth } = await getLoggedUser(true)

        const page = 1
        const limit = 10

        const response = await supertest(BASE_URL)
          .get(`/instructor/course?page=${page}&limit=${limit}`)
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

    test.group('GET /instructor/course/:id', () => {
      test('when used a valid course id', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id)

        const response = await supertest(BASE_URL)
          .get(`/instructor/course/${course.id}`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.id, course.id)
      })

      test('when used an invalid course id', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .get('/instructor/course/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when used a course id from another user', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user2.id)

        await supertest(BASE_URL)
          .get(`/instructor/course/${course.id}`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .get('/instructor/course/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('POST /instructor/course', () => {
      test('when valid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)

        const title = faker.lorem.words(2)
        const shortDescription = faker.lorem.words(3)
        const description = faker.lorem.words(10)

        const response = await supertest(BASE_URL)
          .post('/instructor/course')
          .send({
            title,
            shortDescription,
            description,
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(201)

        assert.isObject(response)
        assert.equal(response.body.user_id, user.id)
        assert.equal(response.body.title, title)
        assert.equal(response.body.description, description)
        assert.equal(response.body.short_description, shortDescription)
      })

      test('when lacking data', async (assert) => {
        const { auth } = await getLoggedUser(true)

        const title = faker.lorem.words(2)
        const description = faker.lorem.words(10)

        const response = await supertest(BASE_URL)
          .post('/instructor/course')
          .send({ title, description })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('when title, shortDescription or description are invalid', async (assert) => {
        const { auth } = await getLoggedUser(true)

        const title = faker.lorem.words(71)
        const shortDescription = faker.lorem.words(101)
        const description = faker.lorem.words(1001)

        const response = await supertest(BASE_URL)
          .post('/instructor/course')
          .send({ title, shortDescription, description })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 3)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .post('/instructor/course')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('PUT /instructor/course/:id', () => {
      test('when valid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1)

        // different amount of words
        const title = faker.lorem.words(1)
        const shortDescription = faker.lorem.words(2)
        const description = faker.lorem.words(9)

        const response = await supertest(BASE_URL)
          .put(`/instructor/course/${course.id}`)
          .send({
            title,
            shortDescription,
            description,
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.user_id, user.id)
        assert.equal(response.body.title, title)
        assert.equal(response.body.description, description)
        assert.equal(response.body.short_description, shortDescription)
        assert.notEqual(response.body.title, course.title)
        assert.notEqual(response.body.description, course.description)
        assert.notEqual(
          response.body.short_description,
          course.shortDescription
        )
      })

      test('when lacking data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1)

        const title = faker.lorem.words(2)
        const description = faker.lorem.words(10)

        const response = await supertest(BASE_URL)
          .put(`/instructor/course/${course.id}`)
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
        const [course] = await createRandomCourses(user.id, 1)

        const title = faker.lorem.words(71)
        const shortDescription = faker.lorem.words(101)
        const description = faker.lorem.words(1001)

        const response = await supertest(BASE_URL)
          .put(`/instructor/course/${course.id}`)
          .send({ title, shortDescription, description })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors.length, 3)
      })

      test('when user is not the course owner', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1)

        await supertest(BASE_URL)
          .put(`/instructor/course/${course.id}`)
          .send({
            title: faker.lorem.words(2),
            shortDescription: faker.lorem.words(5),
            description: faker.lorem.words(10),
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when id is invalid', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .put('/instructor/course/1')
          .send({
            title: faker.lorem.words(2),
            shortDescription: faker.lorem.words(5),
            description: faker.lorem.words(10),
          })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .put('/instructor/course/1')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('PATCH /instructor/course/status/:id/:status', () => {
      test('when valid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1)

        const response = await supertest(BASE_URL)
          .patch(
            `/instructor/course/status/${course.id}/${CourseStatus.PUBLIC}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(response.body.status, CourseStatus.PUBLIC)
      })

      test('when status is invalid', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1)

        const response = await supertest(BASE_URL)
          .patch(`/instructor/course/status/${course.id}/random-status`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(400)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors[0].message, 'Invalid Status')
      })

      test('when user is not the course owner', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1)

        await supertest(BASE_URL)
          .patch(
            `/instructor/course/status/${course.id}/${CourseStatus.PUBLIC}`
          )
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when id is invalid', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .patch(`/instructor/course/status/1/${CourseStatus.PUBLIC}`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .patch(`/instructor/course/status/1/${CourseStatus.PUBLIC}`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })

    test.group('PATCH /instructor/course/thumbnail/:id', () => {
      test('when valid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1)

        const response = await supertest(BASE_URL)
          .patch(`/instructor/course/thumbnail/${course.id}`)
          .attach('thumbnail', filepath)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.notEqual(response.body.thumbnail_url, null)
      })

      test('when invalid data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1)

        const buffer = Buffer.from('some data')
        const response = await supertest(BASE_URL)
          .patch(`/instructor/course/thumbnail/${course.id}`)
          .attach('thumbnail', buffer, 'invalid.txt')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(400)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.isNotEmpty(
          response.body.errors[0].message,
          'Invalid file extension txt. Only jpg, png, jpeg are allowed'
        )
      })

      test('when lacking data', async (assert) => {
        const { auth, user } = await getLoggedUser(true)
        const [course] = await createRandomCourses(user.id, 1)

        const response = await supertest(BASE_URL)
          .patch(`/instructor/course/thumbnail/${course.id}`)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(400)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('when user is not the course owner', async () => {
        const { auth } = await getLoggedUser(true)
        const { user: user2 } = await getLoggedUser(true)

        const [course] = await createRandomCourses(user2.id, 1)

        await supertest(BASE_URL)
          .patch(`/instructor/course/thumbnail/${course.id}`)
          .attach('thumbnail', filepath)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when id is invalid', async () => {
        const { auth } = await getLoggedUser(true)

        await supertest(BASE_URL)
          .patch('/instructor/course/thumbnail/1')
          .attach('thumbnail', filepath)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })

      test('when user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .patch('/instructor/course/thumbnail/1')
          .attach('thumbnail', filepath)
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })
  })
})
