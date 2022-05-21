import ChartSquareBarIcon from '../icons/ChartSquareBar'
import UserIcon from '../icons/User'
import TocIcon from '@material-ui/icons/Toc'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import UsersIcon from '../icons/Users'
import FolderOpenIcon from '../icons/FolderOpen'
import useAuth from './useAuth'
import { useCallback, useEffect, useState } from 'react'
import _ from 'lodash'
import { DocumentScanner } from '@material-ui/icons'
const sections = [
    {
        title: 'General',
        items: [
            {
                title: 'Overview',
                path: '/',
                icon: <ChartSquareBarIcon fontSize="small" />,
            },
            {
                title: 'Account',
                path: '/account',
                icon: <UserIcon fontSize="small" />,
                children: [
                    {
                        title: 'Profile',
                        path: '/account/profile',
                    },
                    {
                        title: 'Reset Password',
                        path: '/account/reset-password',
                    },
                ],
            },
        ],
    },
    {
        title: 'Load / Ship',
        items: [
            {
                title: 'My Purchase Orders',
                path: '/orders',
                icon: <TocIcon />,
                children: [
                    {
                        title: 'All',
                        path: '/orders',
                    },
                    {
                        title: 'Open Orders',
                        path: '/orders/status/open',
                    },
                ],
            },
        ],
    },
]

const adminSections = [
    {
        title: 'Admin',
        items: [
            {
                title: 'User Mgmt',
                path: '/users',
                icon: <UsersIcon fontSize="small" />,
            },
        ],
    },
]

const superAdminSections = [
    {
        title: 'Super Admin',
        items: [
            {
                title: 'Vendor Mgmt',
                path: '/vendors',
                icon: <FolderOpenIcon fontSize="small" />,
            },
            {
                title: 'API Documentation',
                path: '/api-doc',
                icon: <DocumentScanner fontSize="small" />,
            },
        ],
    },
]

export const useSidebar = user => {
    const [sidebar, setSidebar] = useState(null)

    const getBar = useCallback(() => {
        console.log('setting sidebar')
        let fullSidebar = []
        fullSidebar = sections
        if (user) {
            if (user.role === 'VENDORADMIN') {
                fullSidebar.push(...adminSections)
            }
            if (user.role === 'SUPERADMIN') {
                // find the admin section
                fullSidebar.push(...adminSections)
                fullSidebar.push(...superAdminSections)
            }
        }

        fullSidebar = _.uniqBy(fullSidebar, 'title')
        console.log({ fullSidebar })
        setSidebar(fullSidebar)
        // return fullSidebar
    }, [user.role])

    useEffect(() => {
        getBar()
        return () => {
            console.log('cleanup sidebar')
            setSidebar(null)
        }
    }, [user.role])

    const clear = () => {
        console.log('clear sidebar')
        setSidebar(null)
    }
    return { sidebar, clear }
}

export default useSidebar
