import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseClassExercises extends BaseSchema {
  protected tableName = 'course_class_exercises'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      // Logic well-documented on App/Models/CourseClassExercises
      // The exercise table is modified at 1595198468293_exercises_definitions.ts
      table
        .integer('course_class_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('course_classes')
        .onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
