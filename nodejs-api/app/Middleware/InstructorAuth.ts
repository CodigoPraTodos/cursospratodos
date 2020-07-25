import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class InstructorAuth {
  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>
  ) {
    if (!auth.user) {
      if (!(await auth.use(auth.name).check())) {
        throw new AuthenticationException(
          'Unauthorized access',
          'E_UNAUTHORIZED_ACCESS'
        )
      }
      auth.defaultGuard = auth.name
    }

    if (!auth.user?.isActive) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    await auth.user.preload('instructor')
    if (!auth.user.instructor) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS'
      )
    }

    await next()
  }
}
