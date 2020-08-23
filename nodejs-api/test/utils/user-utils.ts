import faker from 'faker'
import supertest from 'supertest'

import User from 'App/Models/User'
import { BASE_URL } from 'Test/constants'

export const getLoggedUser = async (instructor = true) => {
  const user = await createFakeUser(instructor)
  const loginResponse = await supertest(BASE_URL)
    .post('/auth/login')
    .send({ email: user.email, password: 'secret' })

  return loginResponse.body
}

export const createFakeUser = async (instructor = true) => {
  const fakeUser = await User.create({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: 'secret',
  })

  if (instructor) {
    await fakeUser.related('instructor').create({
      description: faker.lorem.words(20),
      shortDescription: faker.lorem.words(3),
    })
  }

  return fakeUser
}
