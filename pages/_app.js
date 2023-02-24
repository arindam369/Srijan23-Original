import '@/styles/globals.css'
import { AuthContextProvider } from '@/store/AuthContext'
import LoaderLayout from '@/components/LoaderLayout'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <LoaderLayout>
        <Head>
          <meta
            name="description"
            content="The annual techno management fest of Jadavpur University"
          />
          <meta
            name="keywords"
            content="Srijan, cultural, ju, fest, srijanju, technology, events, games, coding"
          />
          <meta name="author" content="FETSU" />
          <link rel="manifest" href="manifest.json" />
          <title>Srijan 23</title>

          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Srijan23" />
          <meta
            property="og:description"
            content="Share your memories with others"
          />
          <meta property="og:url" content="https://srijanju.in" />
          <meta property="og:site_name" content="Srijan23" />
          <meta property="og:image" itemProp="image" content="https://srijanju.in/favicon.ico"/>
          <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
          <link rel="icon" type="image/x-icon" href="favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </LoaderLayout>
    </AuthContextProvider>
  )
}
