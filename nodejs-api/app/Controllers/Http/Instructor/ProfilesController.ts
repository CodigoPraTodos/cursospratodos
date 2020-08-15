import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'
import Instructor from 'App/Models/Instructor'
import UtilsService from 'App/Services/UtilsService'
import InstructorRequest from 'App/Models/InstructorRequest'
import { ApproveStatus } from 'App/Helpers/ApproveStatus'

export default class ProfilesController {
  public async request({ auth, request, response }: HttpContextContract) {
    const data = await request.validate({ schema: instructorSchema })

    const user = auth.user as User

    // Check if the User is already an instructor
    if (await this.getInstructor(user)) {
      return response.badRequest(
        UtilsService.formatMessages('You are already an Instructor')
      )
    }

    let instructor = await InstructorRequest.findBy('user_id', user.id)
    if (instructor) {
      return response.badRequest(
        UtilsService.formatMessages('You have already a request')
      )
    }

    instructor = await InstructorRequest.create({ ...data, userId: user.id })
    return response.created(instructor)
  }

  public async getRequest({ auth }: HttpContextContract) {
    return await InstructorRequest.findByOrFail('user_id', auth.user?.id)
  }

  public async updateRequest({ auth, request, response }: HttpContextContract) {
    const { description, shortDescription } = await request.validate({
      schema: instructorSchema,
    })

    const user = auth.user as User

    // Check if the User is already an instructor
    if (await this.getInstructor(user)) {
      return response.badRequest(
        UtilsService.formatMessages('You are already an Instructor')
      )
    }

    const instructorRequest = await InstructorRequest.findByOrFail(
      'user_id',
      user.id
    )
    instructorRequest.description = description
    instructorRequest.shortDescription = shortDescription
    instructorRequest.approved = ApproveStatus.WAITING_FOR_REVIEW
    await instructorRequest.save()

    return instructorRequest
  }

  public async updateProfile({ auth, request }: HttpContextContract) {
    const { description, shortDescription } = await request.validate({
      schema: instructorSchema,
    })

    const user = auth.user as User
    const instructor = user.instructor

    instructor.description = description
    instructor.shortDescription = shortDescription
    await instructor.save()

    return instructor
  }

  private async getInstructor(user: User) {
    return await Instructor.findBy('user_id', user.id)
  }
}

const instructorSchema = schema.create({
  description: schema.string({}, [rules.maxLength(1000)]),
  shortDescription: schema.string({}, [rules.maxLength(100)]),
})
