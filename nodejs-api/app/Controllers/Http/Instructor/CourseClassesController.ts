import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

import User from 'App/Models/User'
import Course from 'App/Models/Course'
import CourseClass from 'App/Models/CourseClass'
import CourseClassValidator from 'App/Validators/CourseClassValidator'
import UtilsService from 'App/Services/UtilsService'

export default class CourseClassesController {
  // Get teacher course classes
  public async paginate({ auth, request, params: { courseId } }: HttpContextContract) {
    await this.courseExistAndIsFromUser(courseId, auth.user!)

    const { page, limit } = UtilsService.getPageAndLimit(
      request.only(['page', 'limit'])
    )

    return await CourseClass.query()
      .select('id', 'title', 'order', 'is_public', 'created_at')
      .where('course_id', courseId)
      .orderBy('order', 'asc')
      .paginate(page, limit)
  }

  // Get teacher course class details
  public async get({ auth, params: { courseId, id } }: HttpContextContract) {
    await this.courseExistAndIsFromUser(courseId, auth.user!)

    return await CourseClass.query()
      .where('id', id)
      .andWhere('course_id', courseId)
      .firstOrFail()
  }

  public async create({
    auth,
    request,
    response,
    params: { courseId },
  }: HttpContextContract) {
    courseId = parseInt(courseId, 10)
    await this.courseExistAndIsFromUser(courseId, auth.user!)

    const data = await request.validate(CourseClassValidator)
    const { description, isPublic } = request.only(['description', 'isPublic'])

    if (description && description.length > 255) {
      return response.unprocessableEntity(
        UtilsService.formatMessages('Invalid Description')
      )
    }

    const courseClass = await CourseClass.create({
      ...data,
      description: description || null,
      isPublic: isPublic ? isPublic : false,
      order: await this.getNextCourseOrder(courseId),
      courseId,
    })

    return response.created(courseClass)
  }

  public async update({
    auth,
    request,
    response,
    params: { courseId, id },
  }: HttpContextContract) {
    await this.courseExistAndIsFromUser(courseId, auth.user!)

    const data = await request.validate(CourseClassValidator)
    const { description, isPublic } = request.only(['description', 'isPublic'])

    if (description && description.length > 255) {
      return response.unprocessableEntity(
        UtilsService.formatMessages('Invalid Description')
      )
    }

    const courseClass = await CourseClass.findOrFail(id)

    if (
      courseClass.title === data.title &&
      courseClass.youtubeId === data.youtubeId &&
      courseClass.description === description &&
      courseClass.isPublic === isPublic
    ) {
      // nothing changed
      return courseClass
    }

    courseClass.title = data.title
    courseClass.youtubeId = data.youtubeId
    courseClass.description = description || null

    if ([true, false].includes(isPublic)) {
      courseClass.isPublic = isPublic
    }

    await courseClass.save()

    return courseClass
  }

  public async toggleActive({
    auth,
    params: { courseId, id },
  }: HttpContextContract) {
    await this.courseExistAndIsFromUser(courseId, auth.user!)

    const courseClass = await CourseClass.findOrFail(id)
    courseClass.isPublic = !courseClass.isPublic
    await courseClass.save()

    return courseClass
  }

  public async reorder({
    auth,
    request,
    response,
    params: { courseId, id },
  }: HttpContextContract) {
    await this.courseExistAndIsFromUser(courseId, auth.user!)

    const courseClass = await CourseClass.findOrFail(id)

    let { position } = request.only(['position'])
    position = parseInt(position, 10)

    if (isNaN(position) || position < 1 || position === courseClass.order) {
      // nothing changed
      return courseClass
    }

    const isGrowing = position > courseClass.order

    const firstComparison = isGrowing ? '<=' : '>='
    const secondComparison = isGrowing ? '>' : '<'

    const classes = await CourseClass.query()
      .where('course_id', courseId)
      .andWhere('order', firstComparison, position)
      .andWhere('order', secondComparison, courseClass.order)
      .exec()

    if (!classes.length) {
      return response.unprocessableEntity(
        UtilsService.formatMessages('Invalid position')
      )
    }

    await Database.transaction(async (trx) => {
      courseClass.useTransaction(trx)
      courseClass.order = position
      await courseClass.save()

      for (const each of classes) {
        each.useTransaction(trx)
        each.order = isGrowing ? each.order - 1 : each.order + 1
        await each.save()
      }
    })

    return courseClass
  }

  private async courseExistAndIsFromUser(
    courseId: number,
    user: User
  ): Promise<any> {
    // It throws an error if user does not exist
    await Course.query()
      .where('id', courseId)
      .andWhere('user_id', user.id)
      .firstOrFail()
  }

  private async getNextCourseOrder(courseId: number): Promise<number> {
    const lastClass = await CourseClass.query()
      .select('order')
      .where('course_id', courseId)
      .orderBy('order', 'desc')
      .first()

    return lastClass ? lastClass.order + 1 : 1
  }
}
