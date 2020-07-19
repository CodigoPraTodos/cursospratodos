import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import CourseClassExercise from './CourseClassExercise'

export default class Lambda extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public lambdaName: string // my-serverless-action

  @column()
  public lambdaUrl: string // GET request that throw the lambda

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @hasMany(() => CourseClassExercise)
  public exercises: HasMany<typeof CourseClassExercise>
}
