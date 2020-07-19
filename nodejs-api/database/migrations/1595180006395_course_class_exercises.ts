import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseClassExercises extends BaseSchema {
  protected tableName = 'course_class_exercises'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      /**
       * @TODO
       * define exercises logic
       */
      table.integer('course_class_id').unsigned().references('id').inTable('course_classes').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
