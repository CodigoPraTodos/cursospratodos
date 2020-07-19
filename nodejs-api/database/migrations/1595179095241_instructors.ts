import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Instructors extends BaseSchema {
  protected tableName = 'instructors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('short_description', 100).notNullable()
      table.string('description', 1000).notNullable()
      table.integer('user_id').primary().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
