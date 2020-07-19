import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Course from './Course'
import CourseClassExercise from './CourseClassExercise'

export default class CourseClass extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public youtubeId: string

  @column()
  public description?: string

  @column()
  public order: number

  @column()
  public isPublic: boolean = false

  @column()
  public courseId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => Course)
  public course: BelongsTo<typeof Course>

  @hasMany(() => CourseClassExercise)
  public exercises: HasMany<typeof CourseClassExercise>
}
