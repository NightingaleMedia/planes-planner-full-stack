import { Helmet } from 'react-helmet-async'
import { Box, Button, Container, Typography } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { useEffect } from 'react'
import { FetchAdmin } from '../lib/auth/FetchAdmin'
import { useRouter } from 'next/router'

const sendErrorEmail = async (payload: { message: any; url: string }) => {
    await FetchAdmin({
        path: '/email-webmaster/error',
        options: {
            method: 'POST',
            body: JSON.stringify(payload),
        },
    })
}

const ServerError = ({ err, statusCode }: any) => {
    const router = useRouter()
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'))

    useEffect(() => {
        sendErrorEmail({
            message: {
                error: err ?? 'Not known',
                code: statusCode ?? 'unknown',
            },
            url: router.pathname,
        }).then(res => console.log(res))
    }, [])

    return (
        <>
            <Helmet>
                <title>Error: Server Error</title>
            </Helmet>
            <Box
                sx={{
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    display: 'flex',
                    minHeight: '100%',
                    px: 3,
                    py: '80px',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        align="center"
                        color="textPrimary"
                        variant={mobileDevice ? 'h4' : 'h1'}
                    >
                        500: Internal Server Error
                    </Typography>
                    <Typography
                        align="center"
                        color="textSecondary"
                        sx={{ mt: 0.5 }}
                        variant="subtitle2"
                    >
                        You either tried some shady route or you came here by
                        mistake. Whichever it is, try using the navigation.
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6,
                        }}
                    >
                        <Box
                            alt="Under development"
                            component="img"
                            src={`./error/error500_${theme.palette.mode}.svg`}
                            sx={{
                                height: 'auto',
                                maxWidth: '100%',
                                width: 400,
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6,
                        }}
                    ></Box>
                </Container>
            </Box>
        </>
    )
}

ServerError.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { err, statusCode }
}

export default ServerError
