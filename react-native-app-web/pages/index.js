import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { usePaginatedQuery, useMutation } from 'react-query'
import { Card, Title, Paragraph } from 'react-native-paper'

import routes from '../routes'
import Link from '../components/Link'
import Layout from '../components/Layout'
import GlobalProvider from '../context/GlobalContext'
import { getCourses, COURSES_QUERY, renewToken } from '../api'

function Home({ navigation, initialData }) {
  const [page, setPage] = useState(initialData?.meta?.current_page ?? 1)

  const {
    isLoading,
    isError,
    error,
    resolvedData,
    latestData,
    isFetching,
  } = usePaginatedQuery([COURSES_QUERY, page], getCourses, { initialData })

  const [renewTokenMutation] = useMutation(renewToken)

  useEffect(() => {
    renewTokenMutation()
  }, [renewTokenMutation])

  console.log('isLoading', isLoading)
  console.log('isError', isError)
  console.log('error', error)
  console.log('resolvedData', resolvedData)
  console.log('latestData', latestData)
  console.log('isFetching', isFetching)

  return (
    <GlobalProvider navigation={navigation}>
      <Layout title={routes.HOME.title}>
        <View style={styles.container}>
          <Card style={{ width: 500, maxWidth: '95%' }} elevation={5}>
            <Card.Content>
              <Title>Ola mundo</Title>
              <Paragraph>Faca login clicando abaixo</Paragraph>
              <Link to={routes.LOGIN.path}>Login</Link>
            </Card.Content>
          </Card>
        </View>
      </Layout>
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

// Cache page for 10 hours on production
const cacheInSeconds = process.env.NODE_ENV === 'production' ? 36000 : 1

export async function getStaticProps() {
  const initialData = await getCourses()

  return {
    props: {
      initialData,
    },
    revalidate: cacheInSeconds,
  }
}

export default Home
