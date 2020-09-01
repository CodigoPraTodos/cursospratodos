import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

import Course from 'App/Models/Course'

import UtilsService from 'App/Services/UtilsService'
import { CourseStatus } from 'App/Helpers/CourseStatus'
import CourseStudent from 'App/Models/CourseStudent'
import CourseRate from 'App/Models/CourseRate'

export default class CoursesController {
  public async paginate({ auth, request }: HttpContextContract) {
    const { page, limit, title } = UtilsService.getPageAndLimit(
      request.only(['page', 'limit', 'title'])
    )
    const onlySubscribed = request.url().startsWith('/courses/subscribed')

    let query = Course.query()
      .select(
        'id',
        'title',
        'thumbnail_url',
        'last_calculated_avg',
        'created_at',
        'user_id'
      )
      .preload('instructor', (query) =>
        query.select('id', 'name', 'profile_picture')
      )

    if (auth.user) {
      query = query.preload('students', (query) =>
        query.select('id').where('user_id', auth.user!.id)
      )
    }

    query = query
      .withCount('classes', (query) =>
        query.where('is_public', true).as('totalClasses')
      )
      .withCount('rates', (query) => query.as('totalRates'))
      .withCount('students', (query) => query.as('totalStudents'))
      .where('status', CourseStatus.PUBLIC)

    if (title) {
      query = query.andWhere('title', 'ILIKE', `%${title}%`)
    }

    if (onlySubscribed) {
      query = query.has('students')
    }

    const data = (await query.paginate(page, limit)).toJSON()

    return {
      ...data,
      data: data.data.map((item) => {
        // Get Item Information
        const json = item.toJSON()

        // Remove unnecessary fields
        delete json.students
        delete json.user_id

        return {
          ...json,
          subscribed: item.students?.length > 0,
          totalClasses: parseInt(item.$extras.totalClasses, 10),
          totalRates: parseInt(item.$extras.totalRates, 10),
          totalStudents: parseInt(item.$extras.totalStudents, 10),
        }
      }),
    }
  }

  public async get({ auth, params: { id } }: HttpContextContract) {
    let query = Course.query().preload('instructor', (query) =>
      query
        .select('id', 'name', 'profile_picture')
        .preload('instructor', (query) => query.select('short_description'))
    )

    if (auth.user) {
      query = query.preload('students', (query) =>
        query.select('id').where('user_id', auth.user!.id)
      )
    }

    query = query.where('id', id)

    const data = await query.firstOrFail()
    const course = data.toJSON()

    // remove unnecessary fields
    delete course.students
    delete course.user_id
    delete course.status

    return {
      ...course,
      subscribed: data.students?.length > 0,
    }
  }

  public async subscribe({
    auth,
    response,
    params: { id },
  }: HttpContextContract) {
    const alreadyExists = await CourseStudent.query()
      .where('user_id', auth.user!.id)
      .andWhere('course_id', id)
      .first()

    if (alreadyExists) {
      return alreadyExists
    }

    const data = await CourseStudent.create({
      userId: auth.user!.id,
      courseId: id,
    })

    return response.created(data)
  }

  public async rate({
    auth,
    request,
    response,
    params: { id },
  }: HttpContextContract) {
    // Check if course exists and user is a student
    await Course.query()
      .where('id', id)
      .andWhereHas('students', (query) => query.where('user_id', auth.user!.id))
      .firstOrFail()

    const { rate } = await request.validate({
      schema: schema.create({
        rate: schema.number([rules.range(0, 5)]),
      }),
    })

    const { description } = request.only(['description'])

    if (description && description.length > 255) {
      return response.unprocessableEntity(
        UtilsService.formatMessages('Invalid Description')
      )
    }

    let oldRate = await CourseRate.query()
      .where('user_id', auth.user!.id)
      .andWhere('course_id', id)
      .first()

    if (oldRate) {
      oldRate.rate = rate
      oldRate.description = description
      await oldRate.save()

      this.updateRateAVG(id)
      return oldRate
    }

    const newRate = await CourseRate.create({
      rate,
      description,
      courseId: id,
      userId: auth.user!.id,
    })

    this.updateRateAVG(id)
    return response.created(newRate)
  }

  /**
   * @TODO
   * This function update the rate average inside a course
   * In the future it should be a "cron task", with a rule for
   * minimum rating before showing the avg, for now we leave the same
   */
  private async updateRateAVG(courseId: number, retries = 0) {
    try {
      const course = await Course.findOrFail(courseId)

      const { avg } = await CourseRate.query()
        .avg('rate')
        .where('course_id', courseId)
        .firstOrFail()

      course.lastCalculatedAvg = Number(parseFloat(avg).toFixed(2))
      await course.save()
    } catch (error) {
      if (retries < 10) {
        this.updateRateAVG(courseId, retries + 1)
      }
    }
  }
}
