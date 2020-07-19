import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseClassWatches extends BaseSchema {
  protected tableName = 'course_class_watches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('course_class_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('course_classes')
        .onDelete('CASCADE')
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()

      table.primary(['course_class_id', 'user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
