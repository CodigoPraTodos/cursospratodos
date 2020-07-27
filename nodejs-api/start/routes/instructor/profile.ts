import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // Get previous request, if exist
  Route.get('/request', 'Instructor/ProfilesController.getRequest')

  // Request to be an instructor
  Route.post('/request', 'Instructor/ProfilesController.request')

  // Update instructor request
  Route.put('/request', 'Instructor/ProfilesController.updateRequest')

  // Update profile, once the user is already an instructor
  Route.put(
    '/profile',
    'Instructor/ProfilesController.updateProfile'
  ).middleware('instructorAuth')
})
  .prefix('instructor')
  .middleware('auth')
