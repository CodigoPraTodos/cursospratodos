import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // List all subscribed courses
  Route.get('/subscribed', 'Student/CoursesController.paginate')

  // Subscribe to course
  Route.get('/subscribe/:id', 'Student/CoursesController.subscribe')

  // Rate course
  Route.post('/rate/:id', 'Student/CoursesController.rate')

  // Group for classes' actions
  Route.group(() => {
    // Mark class as watched
    Route.get('/watch/:id', 'Student/CourseClassesController.watch')

    // Send exercise response for class
    Route.post(
      '/exercise-response/:exerciseId',
      'Student/CourseClassesController.exerciseResponse'
    )
  }).prefix('classes')
})
  .prefix('courses')
  .middleware('auth')
