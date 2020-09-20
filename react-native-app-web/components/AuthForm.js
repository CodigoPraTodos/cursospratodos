import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import isEmail from 'validator/lib/isEmail'

import {
  Card,
  Button,
  Title,
  TextInput,
  Paragraph,
  Snackbar,
} from 'react-native-paper'

import routes from '../routes'
import { login, register } from '../api/auth'
import { useGlobalContext } from '../context/GlobalContext'

function AuthForm() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    isValid: false,
  })
  const { dispatch, navigation } = useGlobalContext()

  const router = useRouter()

  const [
    loginMutation,
    { isLoading: isLoadingLogin, error: errorLogin, isSuccess: isSuccessLogin },
  ] = useMutation(login)

  const [
    registerMutation,
    {
      isLoading: isLoadingRegister,
      error: errorRegister,
      isSuccess: isSuccessRegister,
    },
  ] = useMutation(register)

  const isLoading = isLoadingLogin || isLoadingRegister
  const isSuccess = isSuccessLogin || isSuccessRegister

  const { name, email, password, isValid } = form

  const submit = () => {
    if (!isValid) {
      return
    }

    if (isLogin) {
      loginMutation({ email, password, dispatch })
    } else {
      registerMutation({ name, email, password, dispatch })
    }
  }

  const isFormValid = (form, isLogin) => {
    let isValid = isEmail(form.email) && form.password.length > 5

    if (!isLogin) {
      isValid = isValid && form.name
    }

    return isValid
  }

  const onChangeValue = (value, field) => {
    setForm((oldForm) => {
      const newForm = {
        ...oldForm,
        [field]: value,
      }

      return {
        ...newForm,
        isValid: isFormValid(newForm, isLogin),
      }
    })
  }

  useEffect(() => {
    const error = errorLogin || errorRegister
    if (error) {
      setErrorMessage(error.message)
    }
  }, [errorLogin, errorRegister])

  useEffect(() => {
    if (isSuccess) {
      if (Platform.OS === 'web') {
        router.push(routes.HOME.path)
      } else {
        navigation.push(routes.HOME.path)
      }
    }
  }, [isSuccess, router, navigation])

  return (
    <React.Fragment>
      <View style={styles.container}>
        <Card style={styles.card} elevation={8}>
          <Card.Title
            title='Entrar'
            subtitle='Digite um email valido e uma senha com pelo menos 6 caracteres'
          />
          <Card.Content>
            {!isLogin && (
              <TextInput
                label='Nome'
                value={name}
                onChangeText={(text) => onChangeValue(text, 'name')}
                autoCapitalize='true'
                onSubmitEditing={submit}
              />
            )}
            <TextInput
              label='Email'
              value={email}
              onChangeText={(text) => onChangeValue(text, 'email')}
              keyboardType='email-address'
              error={email ? !isEmail(email) : false}
              onSubmitEditing={submit}
            />
            <TextInput
              label='Senha'
              value={password}
              onChangeText={(text) => onChangeValue(text, 'password')}
              secureTextEntry
              error={password ? password.length < 6 : false}
              onSubmitEditing={submit}
            />
            <View style={styles.buttonWrapper}>
              <Button
                mode='contained'
                disabled={!isValid || isLoading}
                loading={isLoading}
                onPress={submit}
              >
                {isLogin ? 'ENTRAR' : 'REGISTRAR'}
              </Button>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                onPress={() => {
                  const newIsLogin = !isLogin
                  setIsLogin(newIsLogin)
                  setForm((old) => ({
                    ...old,
                    isValid: isFormValid(old, newIsLogin),
                  }))
                }}
              >
                {isLogin ? 'Criar nova conta' : 'Ja tenho uma conta'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
      <Snackbar
        visible={errorMessage.length > 0}
        onDismiss={() => setErrorMessage('')}
      >
        {errorMessage}
      </Snackbar>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
  },
  buttonWrapper: {
    marginVertical: 8,
    width: '100%',
    maxWidth: 400,
  },
})

export default AuthForm