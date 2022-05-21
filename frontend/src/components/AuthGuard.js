import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import useAuth from '../hooks/useAuth'
import SplashScreen from './SplashScreen'
import { Login } from './Layouts'

const AuthGuard = (props) => {
    const { children } = props
    const router = useRouter()
    const auth = useAuth()
    const [requestedLocation, setRequestedLocation] = useState(null)

    useEffect(() => {
        if (auth.isInitialized && !auth.isAuthenticated) {
            setRequestedLocation(router.pathname)
            return router.push('/login')
        }
        return () => {}
    }, [])

    useEffect(() => {
        console.log(requestedLocation)
    }, [requestedLocation])

    if (router.pathname === '/login') {
        return <>{children}</>
    }
    if (!auth.isInitialized) {
        return <SplashScreen />
    }
    if (!auth.isAuthenticated) {
        return <Login />
    }
    if (auth.isInitialized && auth.isAuthenticated) {
        return <>{children}</>
    }
}

AuthGuard.propTypes = {
    children: PropTypes.node,
}

export default AuthGuard
