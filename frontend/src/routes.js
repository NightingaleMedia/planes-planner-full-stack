import { Suspense, lazy } from 'react'
import AuthGuard from './components/AuthGuard'
import DashboardLayout from './components/dashboard/DashboardLayout'
import GuestGuard from './components/GuestGuard'
import LoadingScreen from './components/LoadingScreen'
import MainLayout from './components/MainLayout'

const Loadable = (Component) => (props) =>
    (
        <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
        </Suspense>
    )

// Authentication pages

const Login = Loadable(lazy(() => import('./pages/authentication/Login')))
const PasswordRecovery = Loadable(
    lazy(() => import('./pages/authentication/PasswordRecovery'))
)
const PasswordReset = Loadable(
    lazy(() => import('./pages/authentication/PasswordReset'))
)
const Register = Loadable(lazy(() => import('./pages/authentication/Register')))
const VerifyCode = Loadable(
    lazy(() => import('./pages/authentication/VerifyCode'))
)

// Dashboard pages

const Account = Loadable(lazy(() => import('./pages/dashboard/Account')))
const CustomerDetails = Loadable(
    lazy(() => import('./pages/dashboard/CustomerDetails'))
)
const CustomerEdit = Loadable(
    lazy(() => import('./pages/dashboard/CustomerEdit'))
)
const CustomerList = Loadable(
    lazy(() => import('./pages/dashboard/CustomerList'))
)
const InvoiceDetails = Loadable(
    lazy(() => import('./pages/dashboard/InvoiceDetails'))
)
const InvoiceList = Loadable(
    lazy(() => import('./pages/dashboard/InvoiceList'))
)

const OrderDetails = Loadable(
    lazy(() => import('./pages/dashboard/OrderDetails'))
)
const OrderList = Loadable(lazy(() => import('./pages/dashboard/OrderList')))
const Overview = Loadable(lazy(() => import('./pages/dashboard/Overview')))
const ProductCreate = Loadable(
    lazy(() => import('./pages/dashboard/ProductCreate'))
)
const ProductList = Loadable(
    lazy(() => import('./pages/dashboard/ProductList'))
)

// Error pages

const AuthorizationRequired = Loadable(
    lazy(() => import('./pages/AuthorizationRequired'))
)
const NotFound = Loadable(lazy(() => import('./pages/NotFound')))
const ServerError = Loadable(lazy(() => import('./pages/ServerError')))

const routes = [
    {
        path: 'authentication',
        children: [
            {
                path: 'login',
                element: (
                    <GuestGuard>
                        <Login />
                    </GuestGuard>
                ),
            },
            {
                path: 'login-unguarded',
                element: <Login />,
            },
            {
                path: 'password-recovery',
                element: <PasswordRecovery />,
            },
            {
                path: 'password-reset',
                element: <PasswordReset />,
            },
            {
                path: 'register',
                element: (
                    <GuestGuard>
                        <Register />
                    </GuestGuard>
                ),
            },
            {
                path: 'register-unguarded',
                element: <Register />,
            },
            {
                path: 'verify-code',
                element: <VerifyCode />,
            },
        ],
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <DashboardLayout />
            </AuthGuard>
        ),
        children: [
            {
                path: '/',
                element: <Overview />,
            },
            {
                path: 'account',
                element: <Account />,
            },
            {
                path: 'customers',
                children: [
                    {
                        path: '/',
                        element: <CustomerList />,
                    },
                    {
                        path: ':customerId',
                        element: <CustomerDetails />,
                    },
                    {
                        path: ':customerId/edit',
                        element: <CustomerEdit />,
                    },
                ],
            },
            {
                path: 'invoices',
                children: [
                    {
                        path: '/',
                        element: <InvoiceList />,
                    },
                    {
                        path: ':invoiceId',
                        element: <InvoiceDetails />,
                    },
                ],
            },
            {
                path: 'orders',
                children: [
                    {
                        path: '/',
                        element: <OrderList />,
                    },
                    {
                        path: ':orderId',
                        element: <OrderDetails />,
                    },
                ],
            },
            {
                path: 'ship',
                children: [
                    {
                        path: '/',
                        element: <ProductList />,
                    },
                    {
                        path: 'new',
                        element: <ProductCreate />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: (
                    <AuthGuard>
                        <DashboardLayout />
                    </AuthGuard>
                ),
            },
            {
                path: '401',
                element: <AuthorizationRequired />,
            },
            {
                path: '404',
                element: <NotFound />,
            },
            {
                path: '500',
                element: <ServerError />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]

export default routes
