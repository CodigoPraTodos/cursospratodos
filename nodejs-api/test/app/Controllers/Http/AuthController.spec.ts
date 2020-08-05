import test from 'japa'
import supertest from 'supertest'
import faker from 'faker'

import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/auth`

test.group('AuthController', () => {
  test.group('/auth', (group) => {
    group.beforeEach(async () => {
      const users = await User.all()
      users.map((user) => user.delete())
    })

    test('POST /register with valid data', async (assert) => {
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

    test('POST /login with valid data', async (assert) => {
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

    test('GET /logout with valid token', async (assert) => {
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
    test('GET /logout with invalid token', async (assert) => {
      await supertest(BASE_URL).get('/logout').set({ Authorization: 'token' }).expect(401)
    })

    test('GET /renew-token with invalid token', async (assert) => {
      await supertest(BASE_URL).get('/renew-token').set({ Authorization: 'token' }).expect(401)
    })
    test('GET /renew-token with valid token', async (assert) => {
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
