import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Box, Button, Divider, Drawer, Typography } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useSidebar from '../../hooks/useSidebar'
import Avatar from '../Avatar'
import useAuth from '../../hooks/useAuth'

import UsersIcon from '../../icons/Users'

// import Logo from '../Logo';
import NavSection from '../NavSection'
import Scrollbar from '../Scrollbar'

const DashboardSidebar = props => {
    const { onMobileClose, openMobile } = props
    const router = useRouter()
    const { user } = useAuth()
    const lgUp = useMediaQuery(theme => theme.breakpoints.up('lg'))

    const { sidebar, clear } = useSidebar(user)

    useEffect(() => {
        return () => clear()
    }, [])
    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose()
        }
    }, [router.pathname])

    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Scrollbar options={{ suppressScrollX: true }}>
                <Box
                    sx={{
                        display: {
                            lg: 'none',
                            xs: 'flex',
                        },
                        justifyContent: 'center',
                        p: 2,
                    }}
                />
                <Box sx={{ py: 2, pl: 3 }}>
                    <Typography color="textSecondary" variant="body2">
                        Planes Moving & Storage
                    </Typography>
                    {user?.company && (
                        <Typography color="primary" variant="h4">
                            Vendor #: {user.company}
                        </Typography>
                    )}
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            backgroundColor: 'background.default',
                            borderRadius: 1,
                            display: 'flex',
                            overflow: 'hidden',
                            p: 2,
                        }}
                    >
                        {user?.name ? (
                            <>
                                <Avatar
                                    text={user.name}
                                    sx={{
                                        height: 32,
                                        width: 32,
                                    }}
                                />
                                <Box sx={{ ml: 2 }}>
                                    <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                    >
                                        {user.name}
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            <div>Login</div>
                        )}
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    {sidebar &&
                        sidebar.map(section => (
                            <NavSection
                                key={section.title}
                                pathname={router.pathname}
                                sx={{
                                    '& + &': {
                                        mt: 3,
                                    },
                                }}
                                {...section}
                            />
                        ))}
                </Box>
                <Divider />
            </Scrollbar>
            <Box sx={{ p: 2, justifySelf: 'flex-end', width: '100%' }}>
                <NavSection
                    key={'help'}
                    pathname={'/contact'}
                    title={null}
                    icon={<UsersIcon fontSize="small" />}
                    items={[
                        {
                            title: 'Help',
                            path: '/contact-us',
                            icon: <UsersIcon fontSize="small" />,
                        },
                    ]}
                />
            </Box>
        </Box>
    )

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: 'background.paper',
                        height: 'calc(100%) !important',
                        top: '0',
                        width: 280,
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        )
    }

    return (
        <Drawer
            anchor="left"
            onClose={onMobileClose}
            open={openMobile}
            PaperProps={{
                sx: {
                    backgroundColor: 'background.paper',
                    width: 280,
                },
            }}
            variant="temporary"
        >
            {content}
        </Drawer>
    )
}

DashboardSidebar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool,
}

export default DashboardSidebar
