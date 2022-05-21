import NProgress from 'nprogress'
import { FetchAdmin } from './FetchAdmin'

class AuthApi {
    async login({ email, password }) {
        NProgress.start()
        return await FetchAdmin({
            path: '/auth/login',
            options: {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            },
        })
            .then(res => {
                console.log('login: ', res)
                return res
            })
            .catch(err => {
                console.log('err: ', err)
                throw new Error(err.message)
            })
            .finally(() => NProgress.done())
    }

    async me(accessToken) {
        return await FetchAdmin({
            path: '/me',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => {
                console.log('me: ' + res)
                return {
                    name: res.firstName + ' ' + res.lastName,
                    id: res.id,
                    email: res.email,
                    company: res.vendorId,
                    role: res.role,
                }
            })
            .catch(err => {
                console.log(err)
                throw err
            })
    }
}

export const authApi = new AuthApi()
