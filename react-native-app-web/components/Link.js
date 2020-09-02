import React from 'react'
import PropTypes from 'prop-types'
import { Platform } from 'react-native'
import { useRouter } from 'next/router'

import { Button } from 'react-native-paper'

import { useGlobalContext } from '../context/GlobalContext'

function Link({ children, to, as, options }) {
  const { navigation } = useGlobalContext()
  const router = useRouter()

  const navigate = () => {
    if (Platform.OS === 'web') {
      router.push(to, as)
      return
    }

    navigation.push(to, options)
  }

  return <Button onPress={navigate}>{children}</Button>
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  as: PropTypes.string, // Optionally Web             - https://nextjs.org/docs/routing/introduction#linking-between-pages
  options: PropTypes.any, // Optionally React Native  - https://reactnavigation.org/docs/params
}

Link.defaultProps = {
  options: {},
}

export default Link
