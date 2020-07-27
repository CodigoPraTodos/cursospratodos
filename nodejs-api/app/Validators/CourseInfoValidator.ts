import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CourseInfoValidator {
  constructor (private ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string({ trim: true }, [
      rules.maxLength(70),
    ]),
    shortDescription: schema.string({ }, [
      rules.maxLength(100),
    ]),
    description: schema.string({ }, [
      rules.maxLength(1000),
    ]),
  })

  public cacheKey = this.ctx.routeKey

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
  */
  public messages = {}
}
