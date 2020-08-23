import test from 'japa'
import faker from 'faker'
import supertest from 'supertest'

import User from 'App/Models/User'
import Course from 'App/Models/Course'

import { BASE_URL } from 'Test/constants'
import { getLoggedUser } from 'Test/utils/user-utils'
import { createRandomCourses } from 'Test/utils/course-utils'

test.group('CourseClassExerciseResponsesController', () => {
  test.group('/instructor/course-class-exercise-approval', (group) => {
    group.beforeEach(async () => {
      await User.query().delete()
      await Course.query().delete()
    })

    test.group(
      'GET /instructor/course-class-exercise-approval/:exerciseId',
      () => {
        test('when user is a instructor and have 5 exercises', async (assert) => {
          const { auth, user } = await getLoggedUser(true)

          const total = 5
          const [course] = await createRandomCourses(user.id, 1, 1, 1, total)
          const exercise = course.classes[0].exercises[0]

          const page = 1
          const limit = 10

          const response = await supertest(BASE_URL)
            .get(
              `/instructor/course-class-exercise-approval/${exercise.id}?page=${page}&limit=${limit}`
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
          const [course] = await createRandomCourses(user.id, 1, 1, 1, total)
          const exercise = course.classes[0].exercises[0]

          const page = 1
          const limit = 10

          const response = await supertest(BASE_URL)
            .get(
              `/instructor/course-class-exercise-approval/${exercise.id}?page=${page}&limit=${limit}`
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
              `/instructor/course-class-exercise-approval/${exercise.id}${response.body.meta.next_page_url}&limit=${limit}`
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

        test('when user is a instructor and have no exercise responses', async (assert) => {
          const { auth, user } = await getLoggedUser(true)

          const [course] = await createRandomCourses(user.id, 1, 1, 1, 0)
          const exercise = course.classes[0].exercises[0]

          const page = 1
          const limit = 10

          const response = await supertest(BASE_URL)
            .get(
              `/instructor/course-class-exercise-approval/${exercise.id}?page=${page}&limit=${limit}`
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

        test('when user try to get responses of an exercise from another user', async () => {
          const { auth } = await getLoggedUser(true)
          const { user: user2 } = await getLoggedUser(true)

          const [course] = await createRandomCourses(user2.id, 1, 1, 1, 0)
          const exercise = course.classes[0].exercises[0]

          await supertest(BASE_URL)
            .get(
              `/instructor/course-class-exercise-approval/${exercise.id}?page=1&limit=10`
            )
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(404)
        })

        test('when user is not a instructor', async () => {
          const { auth } = await getLoggedUser(false)

          await supertest(BASE_URL)
            .get('/instructor/course-class-exercise-approval/1')
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(401)
        })
      }
    )

    test.group(
      'GET /instructor/course-class-exercise-approval/:exerciseId/:userId',
      () => {
        test('when used a valid exercise/user ids', async (assert) => {
          const { auth, user } = await getLoggedUser(true)
          const [course] = await createRandomCourses(user.id, 1, 1, 1, 1)
          const exercise = course.classes[0].exercises[0]
          const exResponse = exercise.responses[0]

          const response = await supertest(BASE_URL)
            .get(
              `/instructor/course-class-exercise-approval/${exercise.id}/${exResponse.userId}`
            )
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(200)

          assert.isObject(response)
          assert.equal(response.body.user_id, exResponse.userId)
        })

        test('when used an invalid exercise/user ids', async () => {
          const { auth, user } = await getLoggedUser(true)
          const [course] = await createRandomCourses(user.id, 1, 1, 1, 0)
          const exercise = course.classes[0].exercises[0]

          await supertest(BASE_URL)
            .get(`/instructor/course-class-exercise-approval/${exercise.id}/0`)
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(404)
        })

        test('when user a exercise id from another user', async () => {
          const { auth } = await getLoggedUser(true)
          const { user: user2 } = await getLoggedUser(true)
          const [course] = await createRandomCourses(user2.id, 1, 1, 1, 1)
          const exercise = course.classes[0].exercises[0]

          await supertest(BASE_URL)
            .get(
              `/instructor/course-class-exercise-approval/${exercise.id}/${exercise.responses[0].userId}`
            )
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(404)
        })

        test('when user is not an instructor', async () => {
          const { auth } = await getLoggedUser(false)

          await supertest(BASE_URL)
            .get('/instructor/course-class-exercise-approval/1/1')
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(401)
        })
      }
    )

    test.group(
      'PATCH /instructor/course-class-exercise-approval/:exerciseId/:userId/update-status',
      () => {
        test('when valid request', async (assert) => {
          const { auth, user } = await getLoggedUser(true)

          const [course] = await createRandomCourses(user.id, 1, 1, 1, 1)
          const exercise = course.classes[0].exercises[0]

          let response = await supertest(BASE_URL)
            .patch(
              `/instructor/course-class-exercise-approval/${exercise.id}/${exercise.responses[0].userId}/update-status`
            )
            .send({ approved: true })
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(200)

          assert.isObject(response)
          assert.equal(response.body.approved, 1)

          response = await supertest(BASE_URL)
            .patch(
              `/instructor/course-class-exercise-approval/${exercise.id}/${exercise.responses[0].userId}/update-status`
            )
            .send({ approved: false })
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(200)

          assert.isObject(response)
          assert.equal(response.body.approved, 2)
        })

        test('when invalid request', async (assert) => {
          const { auth, user } = await getLoggedUser(true)

          const [course] = await createRandomCourses(user.id, 1, 1, 1, 1)
          const exercise = course.classes[0].exercises[0]

          const response = await supertest(BASE_URL)
            .patch(
              `/instructor/course-class-exercise-approval/${exercise.id}/${exercise.responses[0].userId}/update-status`
            )
            .send({ approved: 'test' })
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

          const [course] = await createRandomCourses(user2.id, 1, 1, 1, 1)
          const exercise = course.classes[0].exercises[0]

          await supertest(BASE_URL)
            .patch(
              `/instructor/course-class-exercise-approval/${exercise.id}/${exercise.responses[0].userId}/update-status`
            )
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(404)
        })

        test('when id is invalid', async () => {
          const { auth } = await getLoggedUser(true)

          await supertest(BASE_URL)
            .patch(
              '/instructor/course-class-exercise-approval/1/1/update-status'
            )
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(404)
        })

        test('when user is not an instructor', async () => {
          const { auth } = await getLoggedUser(false)

          await supertest(BASE_URL)
            .patch(
              '/instructor/course-class-exercise-approval/1/1/update-status'
            )
            .set({
              Authorization: `${auth.type} ${auth.token}`,
            })
            .expect(401)
        })
      }
    )
  })
})
