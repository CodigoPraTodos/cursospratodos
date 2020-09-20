import React from 'react'

import Layout from '../../components/Layout'
import AuthForm from '../../components/AuthForm'

import routes from '../../routes'
import GlobalProvider from '../../context/GlobalContext'
import RequireAuthStatus from '../../components/RequireAuthStatus'

function Login({ navigation }) {
  return (
    <GlobalProvider navigation={navigation}>
      <RequireAuthStatus authenticated={false}>
        <Layout title={routes.LOGIN.title}>
          <AuthForm />
        </Layout>
      </RequireAuthStatus>
    </GlobalProvider>
  )
}

export default Login
