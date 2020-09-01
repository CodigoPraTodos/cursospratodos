import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

import { ApproveStatus } from 'App/Helpers/ApproveStatus'

export default class CourseClassExerciseResponse extends BaseModel {
  // URL pointing for AWS S3 link of exercise response
  @column()
  public exerciseResponseUrl: string

  @column({ isPrimary: true })
  public userId: number

  @column({ isPrimary: true })
  public courseClassExerciseId: number

  /**
   * For Lambda based exercises, it's APPROVED if the test passed successfully
   * For Manual based exercises, it's APPROVED if an admin (maybe manager?) approved it
   */
  @column()
  public approved: ApproveStatus

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
