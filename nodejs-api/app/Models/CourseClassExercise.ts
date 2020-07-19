import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import CourseClass from './CourseClass'

export default class CourseClassExercise extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  /**
   * @TODO
   * define exercises logic
   */

  @column()
  public courseClassId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => CourseClass)
  public courseClass: BelongsTo<typeof CourseClass>
}
