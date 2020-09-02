import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Card, Title, Paragraph } from 'react-native-paper'

import GlobalProvider from '../../context/GlobalContext'

function Login({ navigation }) {
  return (
    <GlobalProvider navigation={navigation}>
      <View style={styles.container}>
        <Card style={{ width: 500, maxWidth: '95%' }} elevation={5}>
          <Card.Content>
            <Title>Hello World</Title>
            <Paragraph>Temos SSR + React Native!</Paragraph>
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

export default Login
