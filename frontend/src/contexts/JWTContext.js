import { createContext, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
// import { authApi } from '../__fakeApi__/authApi'
import NProgress from 'nprogress'
import { authApi } from 'lib/auth/authApi'

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
}

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, user } = action.payload

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        }
    },
    LOGIN: (state, action) => {
        const { user } = action.payload
        console.log('login!', user)
        return {
            ...state,
            isAuthenticated: true,
            user,
        }
    },
    LOGOUT: state => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state, action) => {
        const { user } = action.payload

        return {
            ...state,
            isAuthenticated: true,
            user,
        }
    },
}

const reducer = (state, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state

const AuthContext = createContext({
    ...initialState,
    platform: 'JWT',
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    register: () => Promise.resolve(),
})

export const AuthProvider = props => {
    const { children } = props
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        const initialize = async () => {
            try {
                const accessToken = localStorage.getItem(
                    process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME
                )

                if (accessToken) {
                    console.log('access token found')
                    const user = await authApi.me(accessToken)
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        }
        initialize()
    }, [])

    const login = async (email, password) => {
        const { jwt } = await authApi.login({ email, password })
        const user = await authApi.me(jwt)
        localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME, jwt)

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }

    const logout = async () => {
        localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME)
        dispatch({ type: 'LOGOUT' })
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                platform: 'JWT',
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AuthContext
