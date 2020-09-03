import { TOKEN_KEY } from '../config'

export const getAccessToken = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return undefined
}

export const getHeaderOptions = () => {
  const token = getAccessToken()

  return !!token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {}
}
