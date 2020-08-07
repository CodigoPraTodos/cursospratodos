import User from 'App/Models/User'
import faker from 'faker'

export const createFakeUser = async () => {
  const fakeUser = await User.create({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: 'secret',
  })
  return fakeUser
}
