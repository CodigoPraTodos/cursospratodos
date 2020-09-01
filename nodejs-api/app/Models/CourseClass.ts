import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import Course from './Course'
import CourseClassExercise from './CourseClassExercise'
import User from './User'

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
  public isPublic: boolean

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

  @manyToMany(() => User, {
    pivotTable: 'course_class_watches',
    pivotColumns: ['created_at'],
  })
  public watches: ManyToMany<typeof User>
}
