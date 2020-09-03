import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Platform } from 'react-native'
import { Drawer as PaperDrawer } from 'react-native-paper'

import routes from '../routes'
import { useGlobalContext } from '../context/GlobalContext'

const { Item, Section } = PaperDrawer

function Drawer({ setOpen }) {
  const router = useRouter()
  const { navigation } = useGlobalContext()
  const [active, setActive] = useState('')

  const onNavigate = (route) => {
    if (Platform.OS === 'web') {
      router.push(route)
    } else {
      navigation.push(route)
    }

    setActive(route)
    setOpen(false)
  }

  return (
    <Section>
      <Item
        label='Inicio'
        active={active === routes.HOME.path}
        onPress={() => onNavigate(routes.HOME.path)}
      />
      <Item
        label='Entrar'
        active={active === routes.LOGIN.path}
        onPress={() => onNavigate(routes.LOGIN.path)}
      />
    </Section>
  )
}

export default Drawer

// <Drawer.Section title="Some title">
{
  /* <Drawer.Item
label="First Item"
active={active === 'first'}
onPress={() => setActive('first')}
/>
<Drawer.Item
label="Second Item"
active={active === 'second'}
onPress={() => setActive('second')}
/>
</Drawer.Section> */
}
