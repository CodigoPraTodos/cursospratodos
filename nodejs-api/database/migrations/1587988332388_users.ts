import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name', 150).notNullable()
      table.string('profile_picture', 255).nullable()
      table.string('email', 255).unique().notNullable()
      table.string('password', 180).notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()
      table.timestamps(true)

      table.index(['email', 'is_active'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
