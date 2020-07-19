import BaseSchema from '@ioc:Adonis/Lucid/Schema'

import { ApproveStatus } from 'App/Helpers/ApproveStatus'

export default class CourseClassExerciseResponses extends BaseSchema {
  protected tableName = 'course_class_exercise_responses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('exercise_response_url', 255).notNullable().comment('AWS Url for the code response')
      table
        .integer('approved')
        .unsigned()
        .notNullable()
        .defaultTo(ApproveStatus.WAITING_FOR_REVIEW)
        .comment('If the response was correct (lambda or manual review)')
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('course_class_exercise_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('course_class_exercises')
        .onDelete('CASCADE')
      table.timestamps(true) // it's updatable

      // One response per user per exercise
      table.primary(['user_id', 'course_class_exercise_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
