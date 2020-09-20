import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import AsyncStorage from '@react-native-community/async-storage'

import Loading from '../components/Loading'
import { TOKEN_KEY, USER_KEY } from '../config'
import { initialState, reducer } from '../reducer'
import { LOGIN } from '../reducer/actions'

// All pages should implement this context
export const GlobalContext = React.createContext({
  navigation: {}, // used for React Native Navigation
  dispatch: () => {},
  ...initialState,
})

export const useGlobalContext = () => useContext(GlobalContext)

export default function GlobalProvider({ navigation, children }) {
  const [loaded, setLoaded] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)

  const contextValue = useMemo(
    () => ({
      navigation,
      ...state,
      dispatch,
    }),
    [navigation, state, dispatch]
  )

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY)
      const user = await AsyncStorage.getItem(USER_KEY)

      if (token && user) {
        try {
          dispatch({ type: LOGIN, payload: { user: JSON.parse(user), token } })
        } catch (error) {}
      }

      setLoaded(true)
    }

    loadUser()
  }, [dispatch])

  return (
    <GlobalContext.Provider value={contextValue}>
      {loaded ? children : <Loading />}
    </GlobalContext.Provider>
  )
}
