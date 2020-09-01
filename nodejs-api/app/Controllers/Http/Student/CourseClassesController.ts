import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CourseClass from 'App/Models/CourseClass'

import UtilsService from 'App/Services/UtilsService'
import CourseClassWatch from 'App/Models/CourseClassWatch'

export default class CourseClassesController {
  public async paginate({ auth, request }: HttpContextContract) {
    const { page, limit } = UtilsService.getPageAndLimit(
      request.only(['page', 'limit'])
    )

    let query = CourseClass.query()
      .select('id', 'title', 'youtube_id')
      .where('is_public', true)
      .orderBy('order', 'asc')

    if (auth.user) {
      query = query.preload('watches', (query) =>
        query.select('created_at').where('user_id', auth.user!.id)
      )
    }

    const data = (await query.paginate(page, limit)).toJSON()

    return {
      ...data,
      data: data.data.map((item) => {
        const json = item.toJSON()

        delete json.watches

        return {
          ...json,
          watchedAt:
            item.watches?.length > 0 ? item.watches[0].createdAt : null,
        }
      }),
    }
  }

  public async get({ auth, params: { id } }: HttpContextContract) {
    let query = CourseClass.query()
      .preload('exercises', (query) =>
        query.select('id', 'exercise_url', 'base_code_url')
      )
      .where('is_public', true)
      .andWhere('id', id)

    if (auth.user) {
      query = query.preload('watches', (query) =>
        query.select('created_at').where('user_id', auth.user!.id)
      )
    }

    const data = await query.firstOrFail()
    const courseClass = data.toJSON()

    delete courseClass.watches

    return {
      ...courseClass,
      watchedAt: data.watches?.length > 0 ? data.watches[0].createdAt : null,
    }
  }

  public async watch({ auth, response, params: { id } }: HttpContextContract) {
    const alreadyExists = await CourseClassWatch.query()
      .where('user_id', auth.user!.id)
      .andWhere('course_class_id', id)
      .first()

    if (alreadyExists) {
      return alreadyExists
    }

    const data = await CourseClassWatch.create({
      userId: auth.user!.id,
      courseClassId: id,
    })

    return response.created(data)
  }

  public async exerciseResponse({}: HttpContextContract) {
    // TODO (we still need to define how it will work)
    return { message: 'WORK IN PROGRESS' }
  }
}
