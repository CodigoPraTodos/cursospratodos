import 'setimmediate'
import App from 'next/app'
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0f6ff5',
  },
}

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <PaperProvider theme={theme}>
        <Component {...pageProps} />
      </PaperProvider>
    )
  }
}

export default MyApp
