import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { Appbar, Portal } from 'react-native-paper'

import Drawer from './Drawer'

const { Action, Content, Header } = Appbar

function Layout({ title, subtitle, children }) {
  const [open, setOpen] = useState(false)
  // TODO: Implement BackAction listening to user route changes (it should work for both mobile and web)

  return (
    <Portal.Host>
      <Header>
        <Action icon='menu' onPress={() => setOpen(true)} />
        <Content title={title} subtitle={subtitle} />
      </Header>
      <View style={{ backgroundColor: '#ffffff', padding: 16 }}>
        {children}
      </View>
      {open && (
        <Portal>
          <Drawer setOpen={setOpen} />
        </Portal>
      )}
    </Portal.Host>
  )
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
}

export default Layout
