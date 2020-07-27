import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'
import UtilsService from 'App/Services/UtilsService'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const data = await request.validate({ schema: schemaAuth(true) })

    const user = await User.create(data)
    if (!user.$isPersisted) {
      return response.internalServerError(undefined)
    }

    const token = await auth.use('api').login(user, { expiresIn: EXPIRES_IN })
    return response.created(this.responseAuthentication(user, token.toJSON()))
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = await request.validate({ schema: schemaAuth() })
    const user = await User.query()
      .where('email', email)
      .andWhere('is_active', true)
      .preload('instructor')
      .first()

    if (!user) {
      return response.badRequest(
        UtilsService.formatMessages('Invalid user credentials')
      )
    }

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: EXPIRES_IN,
    })
    return this.responseAuthentication(user, token.toJSON())
  }

  public async renewToken({ auth, response }: HttpContextContract) {
    if (!auth.user) {
      return response.unauthorized(undefined)
    }

    const { user } = auth // extract user to re-login
    await user.preload('instructor')
    await auth.use('api').logout() // remove last access token

    const token = await auth.use('api').login(user, {
      expiresIn: EXPIRES_IN,
    })
    return this.responseAuthentication(user, token.toJSON())
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').logout()
    return response.noContent(undefined)
  }

  private responseAuthentication(user: User, tokenJSON: any) {
    return {
      user,
      auth: tokenJSON,
    }
  }
}

const schemaAuth = (isSignUp: boolean = false) => {
  const emailRules = [rules.email()]

  const authSchema: any = {
    email: schema.string({ trim: true }, emailRules),
    password: schema.string({}, [rules.minLength(6)]),
  }

  if (isSignUp) {
    emailRules.push(rules.unique({ table: 'users', column: 'email' }))
    authSchema.name = schema.string({ trim: true }, [
      rules.maxLength(150),
    ])
  }

  return schema.create(authSchema)
}

const EXPIRES_IN = '14 days'
