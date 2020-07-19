import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UserRoleSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run() {
    await Database.insertQuery()
      .table('user_roles')
      .multiInsert([{ user_id: 6, role_id: 2, created_at: new Date() }])
  }
}
