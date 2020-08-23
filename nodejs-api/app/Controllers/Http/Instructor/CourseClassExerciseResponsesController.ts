import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'
import CourseClassExercise from 'App/Models/CourseClassExercise'
import CourseClassExerciseResponse from 'App/Models/CourseClassExerciseResponse'

import UtilsService from 'App/Services/UtilsService'
import { ApproveStatus } from 'App/Helpers/ApproveStatus'

export default class CourseClassExerciseResponsesController {
  public async paginate({
    auth,
    params: { exerciseId },
    request,
  }: HttpContextContract) {
    await this.exerciseExistAndIsFromUser(exerciseId, auth.user!)

    let { page, limit, returnAll } = UtilsService.getPageAndLimit(
      request.only(['page', 'limit', 'returnAll'])
    )

    let query = CourseClassExerciseResponse.query().where(
      'course_class_exercise_id',
      exerciseId
    )

    if (returnAll !== 'true') {
      query = query.andWhere('approved', ApproveStatus.WAITING_FOR_REVIEW)
    }

    return await query.paginate(page, limit)
  }

  public async get({ auth, params: { exerciseId, userId } }: HttpContextContract) {
    await this.exerciseExistAndIsFromUser(exerciseId, auth.user!)

    return await CourseClassExerciseResponse.query()
      .where('user_id', userId)
      .andWhere('course_class_exercise_id', exerciseId)
      .firstOrFail()
  }

  public async updateStatus({
    auth,
    params: { exerciseId, userId },
    request,
  }: HttpContextContract) {
    await this.exerciseExistAndIsFromUser(exerciseId, auth.user!)

    const response = await CourseClassExerciseResponse.query()
      .where('user_id', userId)
      .andWhere('course_class_exercise_id', exerciseId)
      .firstOrFail()

    const { approved } = await request.validate({
      schema: schema.create({
        approved: schema.boolean(),
      }),
    })

    response.approved = approved
      ? ApproveStatus.APPROVED
      : ApproveStatus.REPROVED
    await response.save()

    return response
  }

  private async exerciseExistAndIsFromUser(exerciseId: number, user: User) {
    return await CourseClassExercise.query()
      .where('id', exerciseId)
      .andWhereHas('courseClass', (query) =>
        query.whereHas('course', (query) => query.where('user_id', user.id))
      )
      .firstOrFail()
  }
}
