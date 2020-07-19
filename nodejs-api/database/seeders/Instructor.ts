import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import Instructor from 'App/Models/Instructor'

export default class InstructorSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    await Instructor.createMany([
      {
        description: 'Test',
        shortDescription: 'Test',
        userId: 6,
      },
    ])
  }
}
