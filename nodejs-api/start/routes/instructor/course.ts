import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    // Create course (general information, without thumbnail)
    Route.post('/', 'Instructor/CoursesController.create')

    // Update course (general information, without thumbnail)
    Route.put('/:id', 'Instructor/CoursesController.update')

    // Update course thumbnail
    Route.patch(
      '/thumbnail/:id',
      'Instructor/CoursesController.updateThumbnail'
    )

    // Update course status (Planned, Public, Removed)
    Route.patch(
      '/status/:id/:status',
      'Instructor/CoursesController.updateStatus'
    )
  }).prefix('course')

  Route.group(() => {
    // Create course class
    Route.post('/:courseId', 'Instructor/CourseClassesController.create')

    // Update course class
    Route.put('/:courseId/:id', 'Instructor/CourseClassesController.update')

    // Toggle active course class
    Route.patch('/:courseId/:id/active', 'Instructor/CourseClassesController.toggleActive')

    // Reorder course class
    Route.patch('/:courseId/:id/reorder', 'Instructor/CourseClassesController.reorder')
  }).prefix('course-class')

  Route.group(() => {
  }).prefix('course-class-exercise')

  Route.group(() => {
  }).prefix('course-class-exercise-approval')
})
  .prefix('instructor')
  .middleware('instructorAuth')
