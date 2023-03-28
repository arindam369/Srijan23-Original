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
            content="The wait is over for the 15th edition of SRIJAN, Jadavpur University, Kolkata's largest and most awaited Techno-Management Fest."
          />
          <meta
            name="keywords"
            content="srijan, cultural, ju, fest, srijanju, technology, events, games, coding, srijan23, techfest"
          />
          <meta name="author" content="FETSU" />
          {/* <link rel="manifest" href="manifest.json" /> */}
          <title>SRIJAN'23 | Jadavpur University</title>

          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="SRIJAN'23 | Jadavpur University" />
          <meta
            property="og:description"
            content="The wait is over for the 15th edition of SRIJAN, Jadavpur University, Kolkata's largest and most awaited Techno-Management Fest."
          />
          <meta property="og:url" content="https://srijanju.in" />
          <meta property="og:site_name" content="SRIJAN'23 | Jadavpur University" />
          <meta property="og:image" itemProp="image" content="https://srijanju.in/favicon2.ico"/>
          <link rel="shortcut icon" href="favicon2.ico" type="image/x-icon" />
          <link rel="icon" type="image/x-icon" href="favicon2.ico" />
        </Head>
        <Component {...pageProps} />
      </LoaderLayout>
    </AuthContextProvider>
  )
}
