import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseStudents extends BaseSchema {
  protected tableName = 'course_students'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('course_id').notNullable().unsigned().references('id').inTable('courses').onDelete('CASCADE')
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()

      table.primary(['course_id', 'user_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
