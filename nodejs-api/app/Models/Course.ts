import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import { CourseStatus } from 'App/Helpers/CourseStatus'

import User from './User'
import CourseRate from './CourseRate'
import CourseClass from './CourseClass'

export default class Course extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public thumbnailUrl?: string

  @column()
  public shortDescription: string

  @column()
  public description: string

  @column()
  public status: CourseStatus

  @column()
  public userId: number

  // Nullable
  // If null = not enough reviews (10)
  @column()
  public lastCalculatedAvg: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @hasMany(() => CourseClass)
  public classes: HasMany<typeof CourseClass>

  @belongsTo(() => User)
  public instructor: BelongsTo<typeof User>

  @hasMany(() => CourseRate)
  public rates: HasMany<typeof CourseRate>

  @manyToMany(() => User, {
    pivotTable: 'course_students',
  })
  public students: ManyToMany<typeof User>
}
