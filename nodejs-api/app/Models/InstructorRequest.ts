import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import { ApproveStatus } from 'App/Helpers/ApproveStatus'

export default class InstructorRequest extends BaseModel {
  @column({ isPrimary: true })
  public userId: number

  @column()
  public shortDescription: string

  @column()
  public description: string

  @column()
  public approved: ApproveStatus = ApproveStatus.WAITING_FOR_REVIEW

  @column()
  public reprovedReason: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
