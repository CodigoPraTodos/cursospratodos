import { Platform } from 'react-native'

/**
 * Here we will define all the routes for mobile (react-navigation) and web (next.js)
 */
export const web = {
  HOME: {
    path: '/',
    title: 'Cursos pra todos',
  },
  LOGIN: {
    path: '/login',
    title: 'Entrar',
  },
}

export const mobile = {
  HOME: {
    path: 'Home',
    title: 'Cursos pra todos',
  },
  LOGIN: {
    path: 'Login',
    title: 'Entrar',
  },
}

export default Platform.OS === 'web' ? web : mobile
