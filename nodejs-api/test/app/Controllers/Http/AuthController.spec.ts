import test from 'japa'
import supertest from 'supertest'
import faker from 'faker'

import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/auth`

test.group('AuthController', () => {
  test.group('/auth', (group) => {
    group.beforeEach(async () => {
      const users = await User.all()
      users.forEach(async (user) => await user.delete())
    })

    test.group('POST /register', () => {
      test('with valid data', async (assert) => {
        const response = await supertest(BASE_URL)
          .post('/register')
          .send({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
          })
          .expect(201)
        assert.isDefined(response.body.auth.token)
        assert.equal(response.body.user.id, 1)
        assert.notExists(response.body.user.password)
      })

      test('lacking data', async (assert) => {
        const response = await supertest(BASE_URL)
          .post('/register')
          .send({
            password: 'Secret',
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })

      test('with invalid email', async (assert) => {
        const response = await supertest(BASE_URL)
          .post('/register')
          .send({
            name: faker.name.findName(),
            email: 'invalid_email',
            password: faker.internet.password(),
          })
          .expect(422)

        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
        assert.equal(response.body.errors[0].message, 'email validation failed')
      })
    })

    test.group('POST /login', async () => {
      test('with valid credentials', async (assert) => {
        const user = await User.create({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: 'secret',
        })

        const response = await supertest(BASE_URL)
          .post('/login')
          .send({
            email: user.email,
            password: 'secret',
          })
          .expect(200)
        assert.isDefined(response.body.auth.token)
        assert.equal(response.body.user.is_active, true)
      })

      test('with invalid credentials', async (assert) => {
        const response = await supertest(BASE_URL)
          .post('/login')
          .send({
            email: 'invalid@email.com',
            password: 'invalid_password',
          })
          .expect(400)
        assert.equal(response.body.errors[0].message, 'Invalid user credentials')
      })

      test('lacking data', async (assert) => {
        const response = await supertest(BASE_URL)
          .post('/login')
          .send({
            email: 'invalid@email.com',
          })
          .expect(422)
        assert.equal(response.body.errors[0].message, 'required validation failed')
        assert.isArray(response.body.errors)
        assert.isNotEmpty(response.body.errors)
      })
    })

    test.group('GET /logout', async () => {
      test('with valid token', async () => {
        const user = await User.create({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: 'secret',
        })

        const loginResponse = await supertest(BASE_URL).post('/login').send({ email: user.email, password: 'secret' })

        await supertest(BASE_URL)
          .get('/logout')
          .set({ Authorization: `${loginResponse.body.auth.type} ${loginResponse.body.auth.token}` })
          .expect(204)
      })
      test('with invalid token', async () => {
        await supertest(BASE_URL).get('/logout').set({ Authorization: 'token' }).expect(401)
      })
    })

    test.group('GET /renew-token', () => {
      test('with invalid token', async () => {
        await supertest(BASE_URL).get('/renew-token').set({ Authorization: 'token' }).expect(401)
      })
      test('with valid token', async (assert) => {
        const user = await User.create({
          name: faker.name.findName(),
          email: faker.internet.email(),
          password: 'secret',
        })

        const loginResponse = await supertest(BASE_URL).post('/login').send({ email: user.email, password: 'secret' })

        const response = await supertest(BASE_URL)
          .get('/renew-token')
          .set({ Authorization: `${loginResponse.body.auth.type} ${loginResponse.body.auth.token}` })
          .expect(200)

        assert.isObject(response)
        assert.notEqual(loginResponse.body.auth.token, response.body.auth.token)
      })
    })
  })
})
