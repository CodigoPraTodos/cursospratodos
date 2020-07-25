import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {})
  .prefix('instructor')
  .middleware('auth')
