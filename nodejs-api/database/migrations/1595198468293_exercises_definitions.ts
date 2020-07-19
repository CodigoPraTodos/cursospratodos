import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ExercisesDefinitions extends BaseSchema {
  protected tableName = 'course_class_exercises'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('exercise_url', 255).notNullable()
      table.string('base_code_url', 255).nullable().comment('Any base code saved on AWS S3')
      table.integer('lambda_id').nullable().unsigned().references('id').inTable('lambdas').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumns('exercise_url', 'lambda_id')
    })
  }
}
