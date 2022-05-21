import styled from '@emotion/styled'
import { Dialog } from '@material-ui/core'

export const StyledDialog = styled(Dialog)`
    && .MuiDialog-paper {
        margin: 3%;
        min-width: 250px;
        /* max-width: 320px; */
    }
`

export const StyledForm = styled.div`
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    max-width: 380px;
    min-width: 380px;
    &&.loading {
        opacity: 0.1;
    }
    && .errors {
        color: ${props => props.theme.palette.error.main};
    }

    && > div {
        margin-top: 1rem;
    }
    && div.button-area {
        display: flex;
        flex-direction: column;
        padding-top: 2rem;
    }
    && .MuiButton-root {
        margin: 0.5rem;
    }
    @media all and (max-width: 768px) {
        min-width: unset;
    }
`

export const StyledButtonArea = styled.div`
    display: flex;
    flex-direction: column;

    && .MuiButton-root {
        margin-top: 1rem;
    }
`
export const StyledCardContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 350px;
    padding: 15px;
`
export const FinalizeDialog = styled(Dialog)`
    && .MuiBackdrop-root {
        background-color: rgba(0, 0, 0, 0.9);
    }
    && .MuiDialog-paper {
        min-width: 320px;
        max-width: 320px;
    }
    && .MuiPaper-root {
        overflow-y: scroll;
    }
`
export const StyledSteps = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    height: 20px;
    && .step {
        height: 15px;
        width: 15px;
        margin: 0 5px;
        border-radius: 10px;
        background-color: ${props => props.theme.palette.grey[400]};
        transition: all 0.2s ease;
    }

    && .step.current {
        background-color: ${props => props.theme.palette.primary.main};
        transform: scale(1.2);
    }
`
