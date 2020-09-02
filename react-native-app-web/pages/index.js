import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Title, Paragraph } from 'react-native-paper'

import routes from '../routes'
import Link from '../components/Link'
import GlobalProvider from '../context/GlobalContext'

function Home({ navigation }) {
  return (
    <GlobalProvider navigation={navigation}>
      <View style={styles.container}>
        <Card style={{ width: 500, maxWidth: '95%' }} elevation={5}>
          <Card.Content>
            <Title>Ola mundo</Title>
            <Paragraph>Faca login clicando abaixo</Paragraph>
            <Link to={routes.LOGIN.path}>Login</Link>
          </Card.Content>
        </Card>
      </View>
    </GlobalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Home
