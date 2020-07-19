import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Courses extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 70).notNullable()
      table.string('thumbnail_url', 255).nullable()
      // Quick description of the course
      table.string('short_description', 100).notNullable()
      // Complete description including requirements, learning, etc
      table.string('description', 1000).notNullable()
      table.integer('status').unsigned().defaultTo(0).notNullable().comment('0 - PLANNED | 1 - PUBLIC | 2 - REMOVED')
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true)

      table.index('title')
      table.index('status')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
