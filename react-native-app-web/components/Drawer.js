import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Platform,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'
import { useMutation } from 'react-query'
import { Avatar, Drawer as PaperDrawer } from 'react-native-paper'

import routes from '../routes'
import { useGlobalContext } from '../context/GlobalContext'
import { logoutUser } from '../api'

const { Item, Section } = PaperDrawer

function Drawer({ setOpen }) {
  const router = useRouter()
  const { dispatch, navigation, user } = useGlobalContext()
  const [active, setActive] = useState('')

  const [logoutMutation] = useMutation(logoutUser)

  const closeDrawer = () => {
    setOpen(false)
  }

  const onLogout = () => {
    logoutMutation(dispatch)
    closeDrawer()
  }

  const onNavigate = (route) => {
    if (Platform.OS === 'web') {
      router.push(route)
    } else {
      navigation.push(route)
    }

    setActive(route)
    closeDrawer()
  }

  return (
    <View style={styles.drawer}>
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <Section style={styles.drawerContent}>
        <View style={styles.avatarWrapper}>
          <Avatar.Icon icon='account' size={64} />
        </View>
        <Item
          label='Inicio'
          active={active === routes.HOME.path}
          onPress={() => onNavigate(routes.HOME.path)}
        />
        {!user ? (
          <Item
            label='Entrar'
            active={active === routes.LOGIN.path}
            onPress={() => onNavigate(routes.LOGIN.path)}
          />
        ) : (
          <Item label='Sair' onPress={onLogout} />
        )}
      </Section>
    </View>
  )
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: 'transparent',
    height: '100%',
    width: '100%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  drawerContent: {
    backgroundColor: '#ffffff',
    width: '75%',
    maxWidth: 400,
    height: '100%',
  },
  avatarWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
})

export default Drawer
