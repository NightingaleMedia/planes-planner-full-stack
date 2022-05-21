import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Box,
    Container,
} from '@material-ui/core'
import Link from 'next/link'
import { Image, Work, BeachAccess, Email, Phone } from '@material-ui/icons'
import data from 'public/contact.json'
import styled from '@emotion/styled'
import EmailNotify__Modal from '../PODetail/EmailNotify__Modal'

const StyledCard = styled(Card)`
    min-height: 550px;
    padding: 4rem;
    background-color: white;

    @media all and (max-width: 1200px) {
        padding: 2rem;
    }
`

const StyledCardContent = styled(CardContent)`
    display: grid;
    grid-template-columns: 40% 60%;
    @media all and (max-width: 1200px) {
        grid-template-columns: 1fr;
    }
`

const StyledInner = styled.div`
    max-width: 350px;
    @media all and (max-width: 1200px) {
        margin: auto;
        margin-bottom: 3rem;
    }
`
const StyledContact = styled.div`
    && a {
        text-decoration: none;
    }
    && .MuiListItem-root {
        margin-left: 0;
    }
    && .MuiAvatar-root {
        background-color: ${props => props.theme.palette.primary.main};
    }
`
const HelpCard = props => {
    return (
        <StyledCard>
            <CardHeader
                title="Contact Us"
                subheader={'Contact a Planes Admin'}
            />

            <StyledCardContent>
                <StyledInner>
                    <Typography variant="body1">{data.blurb}</Typography>
                    <StyledContact>
                        <List
                            sx={{
                                mt: 5,
                                width: '100%',
                                maxWidth: 360,
                                bgcolor: 'background.default',
                                borderRadius: '8px',
                            }}
                        >
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={data.name}
                                    secondary={data.title}
                                />
                            </ListItem>
                            <a
                                href={`mailto:${data.email}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ListItem style={{ cursor: 'pointer' }}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Email />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary="Email"
                                        secondary={data.email}
                                    />
                                </ListItem>
                            </a>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Phone />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Phone"
                                    secondary={data.phoneNumber}
                                />
                            </ListItem>
                        </List>
                    </StyledContact>
                </StyledInner>

                <Box>
                    <Container
                        maxWidth="md"
                        sx={{
                            height: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <img src={'./planes-logo.jpg'} />
                        </Box>
                    </Container>
                </Box>
            </StyledCardContent>
        </StyledCard>
    )
}

export default HelpCard
