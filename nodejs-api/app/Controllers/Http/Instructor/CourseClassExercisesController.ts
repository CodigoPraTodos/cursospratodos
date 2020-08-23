import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'
import Lambda from 'App/Models/Lambda'
import CourseClass from 'App/Models/CourseClass'
import CourseClassExercise from 'App/Models/CourseClassExercise'
import UtilsService from 'App/Services/UtilsService'

export default class CourseClassExercisesController {
  public async paginate({
    auth,
    params: { classId },
    request,
  }: HttpContextContract) {
    await this.classExistAndIsFromUser(classId, auth.user!)

    const { page, limit } = UtilsService.getPageAndLimit(
      request.only(['page', 'limit'])
    )

    return await CourseClassExercise.query()
      .where('course_class_id', classId)
      .paginate(page, limit)
  }

  public async get({ auth, params: { classId, id } }: HttpContextContract) {
    await this.classExistAndIsFromUser(classId, auth.user!)

    return await CourseClassExercise.query()
      .where('id', id)
      .andWhere('course_class_id', classId)
      .firstOrFail()
  }

  public async create({
    auth,
    params: { classId },
    request,
    response,
  }: HttpContextContract) {
    await this.classExistAndIsFromUser(classId, auth.user!)

    const { exerciseUrl } = await request.validate({
      schema: schema.create({
        exerciseUrl: schema.string({ trim: true }, [rules.maxLength(255)]),
      }),
    })
    const { baseCodeUrl, lambdaId } = request.only(['baseCodeUrl', 'lambdaId'])

    if (baseCodeUrl && baseCodeUrl.length > 255) {
      return response.unprocessableEntity(
        UtilsService.formatMessages('Invalid BaseCode URL')
      )
    }

    if (lambdaId) {
      await Lambda.findOrFail(lambdaId) // test if exists
    }

    const exercise = await CourseClassExercise.create({
      exerciseUrl,
      baseCodeUrl,
      lambdaId,
      courseClassId: classId,
    })

    return response.created(exercise)
  }

  public async update({
    auth,
    params: { classId, id },
    request,
    response,
  }: HttpContextContract) {
    await this.classExistAndIsFromUser(classId, auth.user!)

    const exercise = await CourseClassExercise.query()
      .where('id', id)
      .andWhere('course_class_id', classId)
      .firstOrFail()

    const { exerciseUrl } = await request.validate({
      schema: schema.create({
        exerciseUrl: schema.string({ trim: true }, [rules.maxLength(255)]),
      }),
    })
    const { baseCodeUrl, lambdaId } = request.only(['baseCodeUrl', 'lambdaId'])

    if (baseCodeUrl && baseCodeUrl.length > 255) {
      return response.unprocessableEntity(
        UtilsService.formatMessages('Invalid BaseCode URL')
      )
    }

    if (lambdaId) {
      await Lambda.findOrFail(lambdaId) // test if exists
    }

    exercise.exerciseUrl = exerciseUrl
    exercise.baseCodeUrl = baseCodeUrl
    exercise.lambdaId = lambdaId
    await exercise.save()

    return exercise
  }

  public async delete({
    auth,
    params: { classId, id },
    response,
  }: HttpContextContract) {
    await this.classExistAndIsFromUser(classId, auth.user!)

    const exercise = await CourseClassExercise.query()
      .where('id', id)
      .andWhere('course_class_id', classId)
      .firstOrFail()

    await exercise.delete()
    return response.noContent()
  }

  private async classExistAndIsFromUser(classId: number, user: User) {
    return await CourseClass.query()
      .where('id', classId)
      .andWhereHas('course', (query) => query.where('user_id', user.id))
      .firstOrFail()
  }
}
