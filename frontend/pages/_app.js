// CSS STYLES
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'nprogress/nprogress.css'
import Head from 'next/head'
// import App from 'next/app';
import PropTypes from 'prop-types'
import { StrictMode, useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import App from 'next/app'

import StyledEngineProvider from '@material-ui/core/StyledEngineProvider'
import { AuthProvider } from '../src/contexts/JWTContext'

// import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import '../src/i18n'
import useScrollReset from '../src/hooks/useScrollReset'
// import routes from './routes';
import { createCustomTheme } from '../src/theme'
import { initialSettings } from '../src/contexts/SettingsContext'
import AuthGuard from '../src/components/AuthGuard'
import DashboardPage from '../src/components/Pages/DashboardPage'
import Router, { useRouter } from 'next/router'
import NProgress from 'nprogress'

Router.events.on('routeChangeStart', () => NProgress.start())

Router.events.on('routeChangeComplete', () => NProgress.done())

function MyApp({ Component, pageProps }) {
    //   const content = useRoutes(routes);
    // This is if we want to create and save settings
    // const { settings } = useSettings();
    const settings = initialSettings

    useScrollReset()

    const theme = createCustomTheme({
        direction: settings.direction,
        responsiveFontSizes: settings.responsiveFontSizes,
        roundedCorners: settings.roundedCorners,
        theme: settings.theme,
    })

    return (
        <StrictMode>
            <HelmetProvider>
                <StyledEngineProvider injectFirst>
                    <AuthProvider>
                        <Toaster position="top-center" />
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <AuthGuard>
                                <Head>
                                    <title> Planes Logistics</title>
                                </Head>
                                <DashboardPage>
                                    <Component {...pageProps} />
                                </DashboardPage>
                            </AuthGuard>
                        </ThemeProvider>
                    </AuthProvider>
                </StyledEngineProvider>
            </HelmetProvider>
        </StrictMode>
    )
}

MyApp.propTypes = {
    Component: PropTypes.any,
    pageProps: PropTypes.any,
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async appContext => {
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(appContext)

    return { ...appProps }
}

export default MyApp
