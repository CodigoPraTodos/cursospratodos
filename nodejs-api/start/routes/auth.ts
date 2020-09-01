import Route from '@ioc:Adonis/Core/Route'

// Unauthenticated routes
Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')

  // Authenticated routes
  Route.group(() => {
    Route.get('/renew-token', 'AuthController.renewToken')
    Route.get('/logout', 'AuthController.logout')
  }).middleware('auth')
}).prefix('auth')
