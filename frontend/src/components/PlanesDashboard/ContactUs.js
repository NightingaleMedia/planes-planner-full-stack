import { Helmet } from 'react-helmet-async'
import { Box, Container, Typography } from '@material-ui/core'
import { ContactForm } from '../contact'

const Contact = () => (
    <>
        <Helmet>
            <title>Contact</title>
        </Helmet>

        <Box
            sx={{
                backgroundColor: 'background.paper',
                pt: 8,
                pb: 5,
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    pr: {
                        lg: 15,
                    },
                }}
            >
                <Typography color="textPrimary" variant="h6" sx={{ pb: 3 }}>
                    Please Feel Free To Reach Out
                </Typography>
                <Box sx={{}}>
                    <ContactForm />
                </Box>
            </Container>
        </Box>
    </>
)

export default Contact
