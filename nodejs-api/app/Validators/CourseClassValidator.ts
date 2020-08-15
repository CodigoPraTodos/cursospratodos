import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CourseClassValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.maxLength(70),
    ]),
    youtubeId: schema.string({ }, [
      rules.maxLength(30),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}
