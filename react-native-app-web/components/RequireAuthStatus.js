import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Platform } from 'react-native'
import { useRouter } from 'next/router'

import routes from '../routes'
import { useGlobalContext } from '../context/GlobalContext'
import Loading from './Loading'

function RequireAuthStatus({ authenticated, children }) {
  const [loaded, setLoaded] = useState(false)
  const { token, navigation } = useGlobalContext()
  const router = useRouter()

  React.useEffect(() => {
    if ((authenticated && token) || (!authenticated && !token)) {
      setLoaded(true)
      return
    }

    if (Platform.OS === 'web') {
      router.push(routes.HOME.path)
    } else {
      navigation.push(routes.HOME.path)
    }
  }, [authenticated, token])

  return loaded ? children : <Loading />
}

RequireAuthStatus.propTypes = {
  authenticated: PropTypes.bool.isRequired,
}

export default RequireAuthStatus
