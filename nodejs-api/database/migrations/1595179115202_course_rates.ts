import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseRates extends BaseSchema {
  protected tableName = 'course_rates'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('description', 255).nullable()
      table.integer('rate').unsigned().notNullable() // 0-5
      table.integer('course_id').notNullable().unsigned().references('id').inTable('courses').onDelete('CASCADE')
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true) // an user can update his rate and it update the updated_at

      table.primary(['course_id', 'user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
