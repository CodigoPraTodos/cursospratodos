import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import CourseClass from './CourseClass'
import Lambda from './Lambda'

export default class CourseClassExercise extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  /**
   * As the exercises will be large texts, the ideal would be to save as a file
   * on Amazon S3 and save the fileUrl in the database.
   *
   * My proposal is save the exercises in format Markdown (like Github).
   *
   * Exercises can be like this:
   * @url https://cs50.harvard.edu/x/2020/psets/6/hello/
   *
   * We can use libraries like this: (we need to have one for web, and one for mobile)
   * @url https://github.com/rexxars/react-markdown
   */
  @column()
  public exerciseUrl: string

  /**
   * @desc This is optional.
   * The exercise could have a "base code", as a file that we'll give to the student.
   * It will be good when we need to have a pattern for the lambda to test.
   */
  @column()
  public baseCodeUrl?: string

  /**
   * @desc This is optional.
   * It will be used for automatically testing the code sent by the student.
   * This may change when we start working on the serverless automation.
   */
  @column()
  public lambdaId?: number

  @column()
  public courseClassId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationships

  @belongsTo(() => CourseClass)
  public courseClass: BelongsTo<typeof CourseClass>

  @belongsTo(() => Lambda)
  public lambda: BelongsTo<typeof Lambda>
}
