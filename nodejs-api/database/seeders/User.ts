import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    await User.createMany([
      { name: 'Test', email: 'test@test.com', password: '123456' },
      { name: 'Test2', email: 'test2@test.com', password: '1234567' },
      { name: 'Test3', email: 'test3@test.com', password: '12345678' },
      { name: 'Test4', email: 'test4@test.com', password: '123456789' },
      { name: 'Test5', email: 'test5@test.com', password: '1234567890' },
      { name: 'Instructor', email: 'instructor@test.com', password: '123456' },
    ])
  }
}
