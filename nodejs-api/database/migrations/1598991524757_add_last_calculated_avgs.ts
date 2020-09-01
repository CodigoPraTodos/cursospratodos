import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ExercisesDefinitions extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.float('last_calculated_avg').unsigned().nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('last_calculated_avg')
    })
  }
}
