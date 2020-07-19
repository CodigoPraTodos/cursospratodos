import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Course from './Course'
import User from './User'

export default class CourseRate extends BaseModel {
  @column()
  public userId: number

  @column()
  public courseId: number

  @column()
  public rate: number

  @column()
  public description?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
