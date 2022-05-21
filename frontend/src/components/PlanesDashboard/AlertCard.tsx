import styled from '@emotion/styled'
import React from 'react'
import { Button, Paper } from '@material-ui/core'
import { Error } from '@material-ui/icons'

const StyledPaper = styled(Paper)`
    padding: 1rem;
    background-color: ${props => props.theme.palette.error.light};
    color: white;
    height: 100%;

    && .header {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 600;
    }
    && .MuiSvgIcon-root {
        margin-right: 1rem;
        font-size: 2rem;
    }
    && .text-area {
        max-width: 600px;
        margin: 0.25rem 0;
        margin-left: 3rem;
    }
    && .MuiButton-root {
        border-color: white;
        color: white;
        display: block;
        margin: 0.75rem 0;
    }
    @media all and (max-width: 600px) {
        && .header {
            display: none;
        }
        && .text-area {
            margin: 0.25rem 0;
        }
    }
`

type Alert__Props = {
    title: string
    children?: React.ReactChild | any
    onAction?: () => void
}
const AlertCard = ({ title, children, onAction }: Alert__Props): any => {
    return (
        <StyledPaper>
            <div className="header">
                <Error />
                {title}
            </div>
            <div className="text-area">
                {children ? children : 'This alert has no content'}
                {onAction && (
                    <Button variant={'outlined'} onClick={onAction}>
                        Take Action
                    </Button>
                )}
            </div>
        </StyledPaper>
    )
}

export default AlertCard
