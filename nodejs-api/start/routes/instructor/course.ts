import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    // Create course (general information, without thumbnail)
    Route.post('/', 'Instructor/CoursesController.create')

    // Update course (general information, without thumbnail)
    Route.put('/:id', 'Instructor/CoursesController.update')

    // Update course thumbnail
    Route.patch('/thumbnail/:id', 'Instructor/CoursesController.updateThumbnail')

    // Update course status (Planned, Public, Removed)
    Route.patch('/status/:id/:status', 'Instructor/CoursesController.updateStatus')
  }).prefix('course')

  Route.group(() => {

  }).prefix('course-class')
  /**
   * CourseClass
   * CourseClassExercise
   * CourseClassExerciseApproval
   */
})
  .prefix('instructor')
  .middleware('instructorAuth')
