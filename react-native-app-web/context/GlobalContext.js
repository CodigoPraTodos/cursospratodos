import React, { useContext, useMemo, useState } from 'react'

// All pages should implement this context
export const GlobalContext = React.createContext({
  navigation: {}, // used for React Native Navigation
  user: null,
  token: null,
})

export const useGlobalContext = () => useContext(GlobalContext)

export default function GlobalProvider({ navigation, children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const contextValue = useMemo(
    () => ({
      navigation,
      user,
      setUser,
      token,
      setToken,
    }),
    [navigation, user, token]
  )

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}
