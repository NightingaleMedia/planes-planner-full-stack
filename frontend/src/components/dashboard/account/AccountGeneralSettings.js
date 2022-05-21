import Link from 'next/link'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    FormHelperText,
    Grid,
    TextField,
    Typography,
} from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'
import PlanesAvatar from '../../Avatar'
import useAuth from '../../../hooks/useAuth'
import { ROLES } from 'src/constants'

const AccountGeneralSettings = props => {
    const { user } = useAuth()

    return (
        <Grid container spacing={3} {...props}>
            <Grid item lg={4} md={6} xl={3} xs={12}>
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'center',
                            }}
                        >
                            <AccountCircle
                                sx={{
                                    fontSize: '10rem',
                                    m: 0,
                                    p: 0,
                                    lineHeight: 0,
                                }}
                            />

                            <Box sx={{ mt: 3 }}>
                                <Typography
                                    color="textPrimary"
                                    sx={{ mt: 1 }}
                                    variant="h4"
                                >
                                    {user.name}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    variant="overline"
                                >
                                    Role: {ROLES[user.role]}
                                    {/* <NextLink href="/dashboard/account">
                                    {user.plan}
                                </NextLink> */}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                    <CardActions></CardActions>
                </Card>
            </Grid>
            <Grid item lg={8} md={6} xl={9} xs={12}>
                {/* TODO get initial values from a request instead of context */}

                <Card>
                    <CardHeader title="Profile" />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="id"
                                    name="name"
                                    value={user.id}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={user.name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    required
                                    type="email"
                                    value={user.email}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Vendor ID"
                                    name="vendorId"
                                    value={user.company}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    disabled
                                    fullWidth
                                    label="Role"
                                    name="role"
                                    value={ROLES[user.role]}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <FormHelperText filled>
                                This information is read only. To change
                                something, please contact a Planes
                                administrator.
                            </FormHelperText>
                        </Box>
                    </CardContent>
                    <Divider />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            p: 2,
                        }}
                    >
                        <Link href={'/account/reset-password'}>
                            <Button
                                color="primary"
                                type="submit"
                                variant="contained"
                            >
                                Change Password
                            </Button>
                        </Link>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    )
}

export default AccountGeneralSettings
