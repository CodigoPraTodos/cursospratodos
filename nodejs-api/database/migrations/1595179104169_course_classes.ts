import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseClasses extends BaseSchema {
  protected tableName = 'course_classes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 70).notNullable()
      table.string('youtubeId', 30).notNullable()
      table.string('description', 255).nullable()
      table.integer('order').unsigned().notNullable().comment('Order on classes')
      table.boolean('is_public').defaultTo(false).notNullable() // If the class is ready to be publicly visible
      table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('CASCADE')
      table.timestamps(true)

      table.index('order')
      table.index('is_public')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
