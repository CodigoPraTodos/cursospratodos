import faker from 'faker'

import Course from 'App/Models/Course'
import CourseClass from 'App/Models/CourseClass'
import CourseClassExercise from 'App/Models/CourseClassExercise'
import Lambda from 'App/Models/Lambda'
import CourseClassExerciseResponse from 'App/Models/CourseClassExerciseResponse'

import { createFakeUser } from './user-utils'

export const createRandomCourses = async (
  userId: number,
  amount = 5,
  amountClasses = 5,
  exercisePerClass = 2,
  responsesPerExercise = 0
): Promise<Course[]> => {
  const courses: Partial<Course>[] = []

  for (let i = 0; i < amount; i++) {
    courses.push({
      title: faker.lorem.words(2),
      shortDescription: faker.lorem.words(3),
      description: faker.lorem.words(10),
      userId: userId,
    })
  }

  const courseList = await Course.createMany(courses)

  await Promise.all(
    courseList.map(async (course) => {
      await createRandomClasses(
        course.id,
        amountClasses,
        exercisePerClass,
        responsesPerExercise
      )
      await course.preload('classes', (classes) =>
        classes.preload('exercises', (exercises) =>
          exercises.preload('responses')
        )
      )
    })
  )

  return courseList
}

export const createRandomClasses = async (
  courseId: number,
  amountClasses = 5,
  exercisePerClass = 2,
  responsesPerExercise = 0
): Promise<CourseClass[]> => {
  const classes: Partial<CourseClass>[] = []

  for (let i = 0; i < amountClasses; i++) {
    classes.push({
      title: faker.lorem.words(2),
      youtubeId: faker.random.alphaNumeric(8),
      description: faker.random.boolean() ? faker.lorem.words(10) : undefined,
      order: i + 1,
      isPublic: faker.random.boolean(),
      courseId,
    })
  }

  const classList = await CourseClass.createMany(classes)

  await Promise.all(
    classList.map((courseClass) =>
      createRandomExercises(
        courseClass.id,
        exercisePerClass,
        responsesPerExercise
      )
    )
  )

  return classList
}

export const createRandomExercises = async (
  courseClassId: number,
  amountExercises = 2,
  responsesPerExercise = 0
): Promise<CourseClassExercise[]> => {
  const exercises: Partial<CourseClassExercise>[] = []

  for (let i = 0; i < amountExercises; i++) {
    exercises.push({
      courseClassId,
      exerciseUrl: faker.internet.url(),
      baseCodeUrl: faker.random.boolean() ? faker.internet.url() : undefined,
    })
  }

  const exerciseList = await CourseClassExercise.createMany(exercises)

  await Promise.all(
    exerciseList.map((exercise) =>
      createRandomResponses(exercise.id, responsesPerExercise)
    )
  )

  return exerciseList
}

export const createRandomResponses = async (
  courseClassExerciseId: number,
  amountResponses = 0
) => {
  const responses: Partial<CourseClassExerciseResponse>[] = []

  for (let i = 0; i < amountResponses; i++) {
    const user = await createFakeUser(false)

    responses.push({
      courseClassExerciseId,
      exerciseResponseUrl: faker.internet.url(),
      userId: user.id,
    })
  }

  return await CourseClassExerciseResponse.createMany(responses)
}

export const createLambda = async () => {
  return await Lambda.create({
    lambdaName: faker.random.word(),
    lambdaUrl: faker.internet.url(),
  })
}
