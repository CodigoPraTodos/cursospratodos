import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Role from './Role'
import Course from './Course'
import Instructor from './Instructor'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public profilePicture?: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public isActive: boolean = true

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @hasOne(() => Instructor)
  public instructor: HasOne<typeof Instructor>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  public roles: ManyToMany<typeof Role> // ADMIN | MANAGER | INSTRUCTOR | ??...

  @manyToMany(() => Course, {
    pivotTable: 'course_students',
  })
  public subscribedCourses: ManyToMany<typeof Course>

  // Helper functions

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
