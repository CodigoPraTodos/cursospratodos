import { Platform } from 'react-native'

/**
 * Here we will define all the routes for mobile (react-navigation) and web (next.js)
 */
export const web = {
  HOME: {
    path: '/',
  },
  LOGIN: {
    path: '/login',
  },
}

export const mobile = {
  HOME: {
    path: 'Home',
    options: { title: 'Inicio' },
  },
  LOGIN: {
    path: 'Login',
    options: { title: 'Entrar' },
  },
}

export default Platform.OS === 'web' ? web : mobile
