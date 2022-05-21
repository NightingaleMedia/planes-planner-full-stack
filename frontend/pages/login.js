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
import { LoginJWT } from '../src/components/authentication/login'
import Logo from '../src/components/Logo'
import useAuth from '../src/hooks/useAuth'

const platformIcons = {
    Amplify: '/icons/amplify.svg',
    Auth0: '/icons/auth0.svg',
    Firebase: '/icons/firebase.svg',
    JWT: '/icons/jwt.svg',
}

const Login = () => {
    const { platform } = useAuth()

    // useEffect(() => {
    //   gtm.push({ event: 'page_view' });
    // }, []);

    return (
        <>
            <Helmet>
                <title>Planes | Login</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                <Container maxWidth="sm" sx={{ py: '80px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 8,
                        }}
                    >
                        <Link href="/">
                            <Logo
                                sx={{
                                    height: 40,
                                    width: 40,
                                }}
                            />
                        </Link>
                    </Box>
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
        </>
    )
}

export default Login
