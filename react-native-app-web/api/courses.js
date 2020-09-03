import { API_URL } from '../config'
import { getHeaderOptions } from './auth'

export const COURSES_QUERY = 'courses'

/**
 * Get paginated courses
 *
 * @param {string} key   Caching key used by react-query
 * @param {number} page  Page
 * @param {number} limit Limit
 */
export async function getCourses(_key = COURSES_QUERY, page = 1, limit = 10) {
  const response = await fetch(`${API_URL}/courses?page=${page}&limit=${limit}`, getHeaderOptions())
  return await response.json()
}
