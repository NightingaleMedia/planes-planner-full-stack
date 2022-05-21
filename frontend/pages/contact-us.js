import { Box, Container } from '@material-ui/core'

import HelpCard from '../src/components/PlanesDashboard/Help/HelpCard'

const ContactUs = () => (
    <>
        <Container>
            <Box sx={{ my: 8, maxHeight: '90%' }}>
                <HelpCard />
            </Box>
        </Container>
    </>
)

export default ContactUs
