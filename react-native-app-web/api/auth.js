import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { API_URL, TOKEN_KEY, USER_KEY } from '../config'
import { throwIfError } from './utils'

const defaultHeaders = {
  'Content-Type': 'application/json',
}

export async function getAccessToken() {
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return undefined
  }

  return await AsyncStorage.getItem(TOKEN_KEY)
}

export async function getHeaderOptions() {
  const token = await getAccessToken()

  return !!token
    ? {
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    : {}
}

/**
 * Login an user
 *
 * @param {email, password} auth
 */
export async function login({ email, password }) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { ...defaultHeaders },
  })

  const data = await response.json()
  throwIfError(response, data)
  await saveUserData(data)

  return data
}

/**
 * Register an user
 *
 * @param {name, email, password} auth
 */
export async function register({ name, email, password }) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    headers: { ...defaultHeaders },
  })

  const data = await response.json()
  throwIfError(response, data)
  await saveUserData(data)

  return data
}

/**
 * Renew token from user
 */
export async function renewToken() {
  const token = await getAccessToken()
  if (!token) return {}

  const response = await fetch(
    `${API_URL}/auth/renew-token`,
    await getHeaderOptions()
  )

  if (response.status >= 400) {
    await logoutUser()
  }

  const data = await response.json()
  await saveUserData(data)
  return data
}

async function saveUserData(data) {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, data.auth.token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user)),
  ])
}

async function logoutUser() {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ])
}
