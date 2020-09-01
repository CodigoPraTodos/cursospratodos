import faker from 'faker'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import { CourseStatus } from 'App/Helpers/CourseStatus'

import User from 'App/Models/User'
import Course from 'App/Models/Course'
import Instructor from 'App/Models/Instructor'
import CourseClass from 'App/Models/CourseClass'
import CourseClassExercise from 'App/Models/CourseClassExercise'
import CourseClassExerciseResponse from 'App/Models/CourseClassExerciseResponse'

import youtubeIds from './data/youtubeIds'

export default class CourseSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    let courses: Partial<Course>[] = []

    const instructor = await Instructor.firstOrFail()
    const users = await User.all()

    for (let i = 0; i < 10; i++) {
      courses.push({
        title: faker.lorem.words(2),
        shortDescription: faker.lorem.words(3),
        description: faker.lorem.words(10),
        userId: instructor.userId,
        status: CourseStatus.PUBLIC,
      })
    }

    courses = await Course.createMany(courses)

    let classes: Partial<CourseClass>[] = []

    for (const course of courses) {
      for (let i = 0; i < 10; i++) {
        classes.push({
          title: faker.lorem.words(2),
          youtubeId: faker.random.arrayElement(youtubeIds),
          description: faker.random.boolean()
            ? faker.lorem.words(10)
            : undefined,
          order: i + 1,
          courseId: course.id,
        })
      }
    }

    classes = await CourseClass.createMany(classes)

    let exercises: Partial<CourseClassExercise>[] = []

    for (const eachClass of classes) {
      for (let i = 0; i < 2; i++) {
        exercises.push({
          courseClassId: eachClass.id,
          exerciseUrl: faker.internet.url(),
          baseCodeUrl: faker.random.boolean()
            ? faker.internet.url()
            : undefined,
        })
      }
    }youtubeIds

    exercises = await CourseClassExercise.createMany(exercises)

    let responses: Partial<CourseClassExerciseResponse>[] = []

    for (const exercise of exercises) {
      for (let i = 0; i < 1; i++) {
        responses.push({
          courseClassExerciseId: exercise.id,
          exerciseResponseUrl: faker.internet.url(),
          userId: faker.random.arrayElement(users).id,
        })
      }
    }

    responses = await CourseClassExerciseResponse.createMany(responses)
  }
}
