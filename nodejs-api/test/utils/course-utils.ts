import faker from 'faker'

import Course from 'App/Models/Course'

export const createRandomCourses = async (userId: number, amount = 5) => {
  const courses: Partial<Course>[] = []

  for (let i = 0; i < amount; i++) {
    courses.push({
      title: faker.lorem.words(2),
      shortDescription: faker.lorem.words(3),
      description: faker.lorem.words(10),
      userId: userId,
    })
  }

  return await Course.createMany(courses)
}
