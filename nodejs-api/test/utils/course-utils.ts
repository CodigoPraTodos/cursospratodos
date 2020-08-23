import faker from 'faker'

import Course from 'App/Models/Course'
import CourseClass from 'App/Models/CourseClass'

export const createRandomCourses = async (
  userId: number,
  amount = 5,
  amountClasses = 5
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
      await createRandomClasses(course.id, amountClasses)
      await course.preload('classes')
    })
  )

  return courseList
}

export const createRandomClasses = async (
  courseId: number,
  amountClasses = 5
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

  return await CourseClass.createMany(classes)
}
