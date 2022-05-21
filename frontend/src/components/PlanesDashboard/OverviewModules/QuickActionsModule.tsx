import { Button, IconButton } from '@material-ui/core'
import React from 'react'
import Module from '../Module'
import styled from '@emotion/styled'
import { ArrowForwardIosOutlined } from '@material-ui/icons'
import { useRouter } from 'next/router'
const StyledActionButton = styled(Button)`
    border-radius: 3px;
    box-shadow: none;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    background-color: ${props => props.theme.palette.info.light};
    color: white;
`
type ActionButton__Props = {
    text: string
    onClick: () => void
}
const ActionButton = ({ text, onClick }: ActionButton__Props) => (
    <StyledActionButton onClick={onClick} variant={'contained'}>
        {text}
        <IconButton component={'div'}>
            <ArrowForwardIosOutlined
                sx={{ fontSize: '16px', color: 'white' }}
            />
        </IconButton>
    </StyledActionButton>
)
const QuickActionsModule = () => {
    const router = useRouter()
    return (
        <Module title="Quick Actions">
            <ActionButton
                onClick={() => router.push('/orders/')}
                text="All Purchase Orders"
            ></ActionButton>
            <ActionButton
                onClick={() => router.push('/orders/status/open')}
                text="Open Purchase Orders"
            ></ActionButton>
            <ActionButton
                onClick={() => router.push('/account/profile')}
                text="My Account"
            ></ActionButton>
        </Module>
    )
}

export default QuickActionsModule
