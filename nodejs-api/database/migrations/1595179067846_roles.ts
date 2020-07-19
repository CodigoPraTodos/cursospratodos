import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Roles extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('description', 50).unique().notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
