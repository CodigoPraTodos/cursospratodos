import test from 'japa'
import supertest from 'supertest'
import faker from 'faker'

import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/auth`

test.group('AuthController', () => {
  test.group('/auth', () => {
    test('POST /register', async (assert) => {
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

    test('POST /login', async (assert) => {
      const user = await User.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: 'secret',
      })

      const response = await supertest(BASE_URL)
        .post('/login')
        .send({
          email: user.$attributes.email,
          password: 'secret',
        })
        .expect(200)
      assert.isDefined(response.body.auth.token)
      assert.equal(response.body.user.is_active, true)
    })
  })
})
