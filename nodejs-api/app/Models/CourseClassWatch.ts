import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CourseClassWatch extends BaseModel {
  @column({ isPrimary: true })
  public userId: number

  @column({ isPrimary: true })
  public courseClassId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
