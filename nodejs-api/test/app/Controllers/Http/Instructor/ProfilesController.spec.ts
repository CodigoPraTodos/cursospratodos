import test from 'japa'
import supertest from 'supertest'
import faker from 'faker'

import User from 'App/Models/User'

import { BASE_URL } from 'Test/constants'
import { getLoggedUser } from 'Test/utils/user-utils'

test.group('ProfilesController', () => {
  test.group('/instructor', (group) => {
    group.beforeEach(async () => {
      await User.query().delete()
    })

    test.group('POST /instructor/request', () => {
      test('with valid data', async (assert) => {
        const { auth } = await getLoggedUser(false)

        const description = faker.lorem.words(20)
        const shortDescription = faker.lorem.words(3)

        const response = await supertest(BASE_URL)
          .post('/instructor/request')
          .send({ description, shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(201)

        assert.isObject(response)
        assert.equal(description, response.body.description)
        assert.equal(shortDescription, response.body.short_description)
      })

      test('lacking data', async (assert) => {
        const { auth } = await getLoggedUser(false)

        const description = faker.lorem.words(20)

        const response = await supertest(BASE_URL)
          .post('/instructor/request')
          .send({ description })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('when user is already an instructor', async (assert) => {
        const { auth } = await getLoggedUser()

        const description = faker.lorem.words(20)
        const shortDescription = faker.lorem.words(3)

        const response = await supertest(BASE_URL)
          .post('/instructor/request')
          .send({ description, shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(400)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(
          response.body.errors[0].message,
          'You are already an Instructor'
        )
      })

      test('when user has already a request', async (assert) => {
        const { auth } = await getLoggedUser(false)

        const description = faker.lorem.words(20)
        const shortDescription = faker.lorem.words(3)

        await supertest(BASE_URL)
          .post('/instructor/request')
          .send({ description, shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(201)

        const response = await supertest(BASE_URL)
          .post('/instructor/request')
          .send({ description, shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(400)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(
          response.body.errors[0].message,
          'You have already a request'
        )
      })
    })

    test.group('GET /instructor/request', () => {
      test('when the user have a request', async (assert) => {
        const { auth } = await getLoggedUser(false)

        const description = faker.lorem.words(20)
        const shortDescription = faker.lorem.words(3)

        await supertest(BASE_URL)
          .post('/instructor/request')
          .send({ description, shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(201)

        const response = await supertest(BASE_URL)
          .get('/instructor/request')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.equal(description, response.body.description)
        assert.equal(shortDescription, response.body.short_description)
      })

      test('when the user do not have a request', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .get('/instructor/request')
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })
    })

    test.group('PUT /instructor/request', () => {
      test('when the user have a request and send a valid body', async (assert) => {
        const { auth } = await getLoggedUser(false)

        const description = faker.lorem.words(20)
        const shortDescription = faker.lorem.words(3)

        await supertest(BASE_URL)
          .post('/instructor/request')
          .send({ description, shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(201)

        const response = await supertest(BASE_URL)
          .put('/instructor/request')
          .send({ description: 'new', shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.notEqual(description, response.body.description)
        assert.equal(shortDescription, response.body.short_description)
      })

      test('when the user have a request and is lacking data', async (assert) => {
        const { auth } = await getLoggedUser(false)

        const description = faker.lorem.words(20)
        const shortDescription = faker.lorem.words(3)

        await supertest(BASE_URL)
          .post('/instructor/request')
          .send({ description, shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(201)

        const response = await supertest(BASE_URL)
          .put('/instructor/request')
          .send({ shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('when the user do not have a request', async () => {
        const { auth } = await getLoggedUser(false)

        const description = faker.lorem.words(20)
        const shortDescription = faker.lorem.words(3)

        await supertest(BASE_URL)
          .put('/instructor/request')
          .send({ description, shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(404)
      })
    })

    test.group('PUT /instructor/profile', () => {
      test('when the user have a profile', async (assert) => {
        const { auth, user } = await getLoggedUser()

        const shortDescription = faker.lorem.words(3)

        const response = await supertest(BASE_URL)
          .put('/instructor/profile')
          .send({ description: 'new', shortDescription })
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(200)

        assert.isObject(response)
        assert.notEqual(user.instructor.description, response.body.description)
        assert.equal(shortDescription, response.body.short_description)
      })

      test('when the user is not an instructor', async () => {
        const { auth } = await getLoggedUser(false)

        await supertest(BASE_URL)
          .put('/instructor/profile')
          .send({})
          .set({
            Authorization: `${auth.type} ${auth.token}`,
          })
          .expect(401)
      })
    })
  })
})
