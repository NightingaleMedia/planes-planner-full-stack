import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import {
    Box,
    Button,
    ButtonBase,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Popover,
    Typography,
} from '@material-ui/core'
import Avatar from '../Avatar'
import useAuth from '../../hooks/useAuth'
import CogIcon from '../../icons/Cog'
import UserIcon from '../../icons/User'

const AccountPopover = () => {
    const anchorRef = useRef(null)
    const { user, logout } = useAuth()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleLogout = async () => {
        try {
            handleClose()
            await logout()
            router.push('/')
        } catch (err) {
            console.error(err)
            toast.error('Unable to logout.')
        }
    }

    return (
        <>
            <Box
                component={ButtonBase}
                onClick={handleOpen}
                ref={anchorRef}
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                {user?.name ? (
                    <Avatar
                        text={user.name}
                        sx={{
                            height: 32,
                            width: 32,
                        }}
                    />
                ) : (
                    <div>Login</div>
                )}
            </Box>
            <Popover
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom',
                }}
                keepMounted
                onClose={handleClose}
                open={open}
                PaperProps={{
                    sx: { width: 240 },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography color="textPrimary" variant="subtitle2">
                        {user.name}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle2">
                        {user.company}
                    </Typography>
                </Box>
                <Divider />
                <Box sx={{ mt: 2 }}>
                    <Link href="/account/profile">
                        <MenuItem>
                            <ListItemIcon>
                                <CogIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography
                                        color="textPrimary"
                                        variant="subtitle2"
                                    >
                                        Settings
                                    </Typography>
                                }
                            />
                        </MenuItem>
                    </Link>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Button
                        color="primary"
                        fullWidth
                        onClick={handleLogout}
                        variant="outlined"
                    >
                        Logout
                    </Button>
                </Box>
            </Popover>
        </>
    )
}

export default AccountPopover
