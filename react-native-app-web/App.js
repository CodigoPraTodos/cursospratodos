import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { mobile } from './routes'
import HomeScreen from './pages'
import LoginScreen from './pages/login'

const components = {
  Home: HomeScreen,
  Login: LoginScreen,
}

const Stack = createStackNavigator()

function App() {
  const routes = Object.values(mobile).map((route) => (
    <Stack.Screen
      key={route.path}
      name={route.path}
      component={components[route.path]}
      options={route.options || {}}
    />
  ))

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {routes}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
