import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserRoles extends BaseSchema {
  protected tableName = 'user_roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('role_id').notNullable().unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.primary(['user_id', 'role_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
