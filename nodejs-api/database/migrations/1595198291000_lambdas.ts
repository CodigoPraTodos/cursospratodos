import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Lambdas extends BaseSchema {
  protected tableName = 'lambdas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('lambda_name', 100).unique().notNullable()
      table.string('lambda_url', 255).notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
