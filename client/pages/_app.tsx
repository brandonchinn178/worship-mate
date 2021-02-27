import { AppProps } from 'next/app'
import Head from 'next/head'
import styled, { ThemeProvider } from 'styled-components'

import { ApolloProvider } from '~/apollo'
import { Header } from '~/layout/Header'
import { theme } from '~/theme'
import { GlobalStyle } from '~/theme/global'

export default function App(props: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider>
        <AppContent {...props} />
      </ApolloProvider>
    </ThemeProvider>
  )
}

function AppContent({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>WorshipMate</title>
      </Head>
      <GlobalStyle />
      <Header />
      <PageContent>
        <Component {...pageProps} />
      </PageContent>
    </>
  )
}

const PageContent = styled.div`
  padding: 15px;
`
