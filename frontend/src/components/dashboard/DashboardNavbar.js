import PropTypes from 'prop-types'
import { AppBar, Box, IconButton, Toolbar } from '@material-ui/core'
import { experimentalStyled } from '@material-ui/core/styles'
import MenuIcon from '../../icons/Menu'
import AccountPopover from './AccountPopover'
import ContentSearch from './ContentSearch'
import LanguagePopover from './LanguagePopover'
import NotificationsPopover from './NotificationsPopover'
import Image from 'next/image'

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
    ...(theme.palette.mode === 'light' && {
        backgroundColor: theme.palette.primary.main,
        boxShadow: 'none',
        color: theme.palette.primary.contrastText,
    }),
    ...(theme.palette.mode === 'dark' && {
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
    }),
    zIndex: theme.zIndex.drawer + 100,
    width: 'calc(100% - 280px)',
    [theme.breakpoints.down('lg')]: {
        width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
        minHeight: '56px',
    },
    [theme.breakpoints.down('xs')]: {
        minHeight: '56px',
    },
}))

const DashboardNavbar = props => {
    const { onSidebarMobileOpen, ...other } = props
    return (
        <DashboardNavbarRoot {...other}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    onClick={onSidebarMobileOpen}
                    sx={{
                        display: {
                            lg: 'none',
                        },
                    }}
                >
                    <MenuIcon fontSize="small" />
                </IconButton>
                <Box
                    sx={{
                        position: 'relative',
                        height: '55px',
                        width: '77px',
                    }}
                >
                    <Image
                        src={'/planes-logo--white.png'}
                        layout="fill"
                        objectFit="contain"
                    />
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        ml: 2,
                    }}
                />
                <LanguagePopover />
                <Box sx={{ ml: 1 }}>
                    <ContentSearch />
                </Box>
                {/* TODO hndle notifications */}
                {/* <Box sx={{ ml: 1 }}>
                    <NotificationsPopover />
                </Box> */}
                <Box sx={{ ml: 2 }}>
                    <AccountPopover />
                </Box>
            </Toolbar>
        </DashboardNavbarRoot>
    )
}

DashboardNavbar.propTypes = {
    onSidebarMobileOpen: PropTypes.func,
}

export default DashboardNavbar
