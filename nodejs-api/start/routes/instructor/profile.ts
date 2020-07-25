import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/request', 'Instructor/ProfilesController.getRequest')
  Route.post('/request', 'Instructor/ProfilesController.request')
  Route.put('/request', 'Instructor/ProfilesController.updateRequest')
  Route.put(
    '/profile',
    'Instructor/ProfilesController.updateProfile'
  ).middleware('instructorAuth')
})
  .prefix('instructor')
  .middleware('auth')
