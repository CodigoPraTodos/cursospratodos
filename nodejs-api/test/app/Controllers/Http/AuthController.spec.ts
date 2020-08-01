import test from 'japa'
import supertest from 'supertest'

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
  })
})
