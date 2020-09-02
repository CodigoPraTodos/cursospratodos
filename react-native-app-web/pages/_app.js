import 'setimmediate'
import App from 'next/app'
import { Provider as PaperProvider } from 'react-native-paper'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <PaperProvider>
        <Component {...pageProps} />
      </PaperProvider>
    )
  }
}

export default MyApp
