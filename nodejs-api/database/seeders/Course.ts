import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Course from 'App/Models/Course'
import { CourseStatus } from 'App/Helpers/CourseStatus'

export default class CourseSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    const courseExample = 'Course example for testing'

    await Course.createMany([
      {
        userId: 6,
        title: courseExample,
        shortDescription: courseExample,
        description: courseExample,
        status: CourseStatus.PUBLIC,
      },
    ])
  }
}
