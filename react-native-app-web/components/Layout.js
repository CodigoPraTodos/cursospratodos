import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { Appbar } from 'react-native-paper'
import SideMenu from 'react-native-side-menu'

import Drawer from './Drawer'

const { Action, Content, Header } = Appbar

function Layout({ title, subtitle, children }) {
  const [open, setOpen] = useState(false)
  // TODO: Implement BackAction listening to user route changes (it should work for both mobile and web)

  return (
    <SideMenu menu={<Drawer setOpen={setOpen} />} isOpen={open}>
      <Header>
        <Action icon='menu' onPress={() => setOpen(true)} />
        <Content title={title} subtitle={subtitle} />
      </Header>
      <View style={{ backgroundColor: '#ffffff', padding: 16 }}>
        {children}
      </View>
    </SideMenu>
  )
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
}

export default Layout
