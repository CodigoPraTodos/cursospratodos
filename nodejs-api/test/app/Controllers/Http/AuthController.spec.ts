import test from 'japa'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/auth`

test.group('AuthController', () => {
  test.group('/auth', () => {
    test('POST /register', async (assert) => {
      const response = await supertest(BASE_URL)
        .post('/register')
        .send({
          name: 'Test',
          email: 'test@test.com',
          password: '123456',
        })
        .expect(201)
      assert.isDefined(response.body.auth.token)
      assert.equal(response.body.user.id, 1)
      assert.notExists(response.body.user.password)
    })

    test('POST /login', async (assert) => {
      const user = await User.create({
        name: 'testename',
        email: 'teste@email.com',
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
