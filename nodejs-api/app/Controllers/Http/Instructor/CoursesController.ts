import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Course from 'App/Models/Course'
import FileService from 'App/Services/FileService'
import UtilsService from 'App/Services/UtilsService'
import { CourseStatus } from 'App/Helpers/CourseStatus'
import CourseInfoValidator from 'App/Validators/CourseInfoValidator'

export default class CoursesController {
  public async create({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(CourseInfoValidator)

    const course = await Course.create({
      ...data,
      userId: auth.user!.id,
    })

    return response.created(course)
  }

  public async update({ auth, request, params: { id } }: HttpContextContract) {
    const data = await request.validate(CourseInfoValidator)

    const course = await Course.query()
      .where('id', id)
      .andWhere('user_id', auth.user!.id)
      .firstOrFail()

    course.title = data.title
    course.shortDescription = data.shortDescription
    course.description = data.description
    await course.save()

    return course
  }

  public async updateThumbnail({
    auth,
    request,
    response,
    params: { id },
  }: HttpContextContract) {
    const thumbnail = request.file('thumbnail', {
      size: '10mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!thumbnail || thumbnail.hasErrors) {
      return response.badRequest(
        thumbnail?.hasErrors
          ? thumbnail?.errors
          : UtilsService.formatMessages('Invalid thumbnail')
      )
    }

    const course = await Course.query()
      .where('id', id)
      .andWhere('user_id', auth.user!.id)
      .firstOrFail()

    course.thumbnailUrl = await FileService.uploadFile(thumbnail)
    await course.save()

    return course
  }

  public async updateStatus({
    auth,
    response,
    params: { id, status },
  }: HttpContextContract) {
    status = parseInt(status, 10)

    if (!Object.values(CourseStatus).includes(status)) {
      return response.badRequest(UtilsService.formatMessages('Invalid Status'))
    }

    const course = await Course.query()
      .where('id', id)
      .andWhere('user_id', auth.user!.id)
      .firstOrFail()

    course.status = status
    await course.save()

    return course
  }
}
