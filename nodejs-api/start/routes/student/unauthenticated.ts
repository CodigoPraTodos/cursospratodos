import Route from '@ioc:Adonis/Core/Route'

// Don't require authentication,
// but if user is authenticated, auth.user will be available
Route.group(() => {
  // List all courses and if user is logged, return if user is subscribed
  Route.get('/', 'Student/CoursesController.paginate')

  // Get course details + classes
  Route.get('/detail/:id', 'Student/CoursesController.get')

  // Group for classes' actions
  Route.group(() => {
    // List all classes from a courseId
    Route.get('/:courseId', 'Student/CourseClassesController.paginate')

    // Get class detail + exercises
    Route.get('/detail/:id', 'Student/CourseClassesController.get')
  }).prefix('classes')
})
  .prefix('courses')
  .middleware('silentAuth')
