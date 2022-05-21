import { useEffect } from 'react'
import Link from 'next/link'
import { Helmet } from 'react-helmet-async'
import {
    Box,
    Card,
    CardContent,
    Container,
    Divider,
    Typography,
} from '@material-ui/core'
import { LoginJWT } from '../authentication/login'
import Logo from '../Logo'
import useAuth from '../../hooks/useAuth'

const platformIcons = {
    Amplify: '/icons/amplify.svg',
    Auth0: '/icons/auth0.svg',
    Firebase: '/icons/firebase.svg',
    JWT: '/icons/jwt.svg',
}

const Login = () => {
    const { platform } = useAuth()
    return (
        <>
            <Helmet>
                <title>Planes Logistics | Login</title>
            </Helmet>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        lg: '35% 65%',
                        xs: 'repeat(1, 1fr)',
                    },
                    minHeight: '100vh',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'white',
                        pt: 8,
                        pb: 5,
                        height: '100%',
                    }}
                >
                    <Container
                        maxWidth="md"
                        sx={{
                            pl: {
                                lg: 15,
                            },
                            height: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mb: 8,
                                height: '100%',
                                p: 5,
                            }}
                        >
                            <img src={'./planes-logo.jpg'} />
                        </Box>
                    </Container>
                </Box>
                <Box
                    sx={{
                        backgroundColor: 'background.default',
                        pt: 8,
                        pb: 5,
                        height: '100%',
                    }}
                >
                    <Container
                        maxWidth="sm"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 8,
                            height: '100%',
                        }}
                    >
                        <Card>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 4,
                                }}
                            >
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3,
                                    }}
                                >
                                    <div>
                                        <Typography
                                            color="textPrimary"
                                            gutterBottom
                                            variant="h4"
                                        >
                                            Log in
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            variant="body2"
                                        >
                                            Log in on the internal platform
                                        </Typography>
                                    </div>
                                </Box>
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        mt: 3,
                                    }}
                                >
                                    {platform === 'JWT' && <LoginJWT />}
                                </Box>
                                <Divider sx={{ my: 3 }} />
                            </CardContent>
                        </Card>
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default Login
