import BaseSchema from '@ioc:Adonis/Lucid/Schema'

import { ApproveStatus } from 'App/Helpers/ApproveStatus'

export default class InstructorRequests extends BaseSchema {
  protected tableName = 'instructor_requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('short_description', 100).notNullable()
      table.string('description', 1000).notNullable()
      table.integer('approved').unsigned().notNullable().defaultTo(ApproveStatus.WAITING_FOR_REVIEW)
      table.string('reproved_reason', 255).nullable()
      table.integer('user_id').primary().notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
