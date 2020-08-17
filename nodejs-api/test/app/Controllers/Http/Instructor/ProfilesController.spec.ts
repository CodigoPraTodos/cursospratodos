import test from 'japa'
import supertest from 'supertest'
import faker from 'faker'

import User from 'App/Models/User'
import { getLoggedUser } from 'Test/utils/user-utils'
import { BASE_URL } from 'Test/constants'

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
        assert.equal(shortDescription, response.body.shortDescription)
      })
    })
  })
})
