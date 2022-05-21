import styled from '@emotion/styled'
import { Box, Button } from '@material-ui/core'
import { StyledProps } from 'src/types/styles'

export const StyledItemList__Items = styled(Box)`
    display: grid;
    grid-template-columns: 5fr 3fr 3fr 1fr;
    grid-template-rows: 40px 1fr;
    justify-content: center;
    align-items: center;
    column-gap: 5px;
    border-top: 1px solid
        ${(props: StyledProps) => props.theme.palette.grey[400]};
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    &&.loading {
        opacity: 0.2;
    }
    && .item-title {
        font-weight: 800;
    }
    && .add-remove {
        margin: auto;
    }
    && .remaining {
        width: 90%;
        font-weight: 800;
        color: ${props => props.theme.palette.grey[600]};
    }
    && .centered {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }
    && .description {
        grid-column: 1/2;
        margin-top: 0.5rem;
        font-size: 0.85rem;
    }
    && .adjust {
        margin: auto;
    }
    && .delete {
        grid-row: 1/2;
        grid-column: 4;
        align-self: center;
    }
    @media all and (max-width: 1450px) {
        grid-template-columns: 2fr 5fr;
        grid-template-rows: 34px 1fr;
        grid-gap: 6px;
    }
    @media all and (max-width: 960px) {
        display: grid;
        grid-template-columns: 40% 40% 20%;
        grid-template-rows: 37px max-content 10px;
        && .remaining {
            margin: 0;
            text-align: left;
            grid-row: 3;
            grid-column: 1/-1;
        }
        && .item-title {
            grid-column: 1;
            text-align: left;
        }
        && .adjust {
            grid-column: 2;
            grid-row: 1;
        }
        && .add-remove {
            grid-column: 2/3;
            grid-row: 4;
        }
        && .quantity-to-add {
            grid-column: 3;
            text-align: right;
            margin: 0 auto;
        }
        && .delete {
            grid-column: 3;
            grid-row: 1;
            margin: 0 auto;
        }
        && .description {
            grid-column: 1/3;
            grid-row: 2;
            text-align: left;
        }
        && .status {
            grid-row: 4;
            grid-column: 1/2;
            text-align: left;
            margin: 0;
        }
    }
`

export const AddRmButton = styled(Button)`
    margin: auto;

    &&.add {
        color: ${props => props.theme.palette.success.main};
        border: 2px solid ${props => props.theme.palette.success.main};
    }
    &&.remove {
        color: ${props => props.theme.palette.error.main};
        border: 2px solid ${props => props.theme.palette.error.main};
    }
`

export const AddSubtract = styled(Box)`
    font-weight: 800;
    &&.zero {
        color: ${props => props.theme.palette.grey[400]};
    }
    &&.add {
        color: ${props => props.theme.palette.success.light};
        &&::before {
            content: '+';
        }
    }
    &&.subtract {
        color: ${props => props.theme.palette.error.light};
    }
`

export const StyledQuan = styled.div`
    color: ${(props: StyledProps) => props.theme.palette.info.light};
    && * {
        font-weight: 800;
    }
    &&.none {
        color: ${(props: StyledProps) => props.theme.palette.grey[400]};
    }
    && .MuiFormControlLabel-root {
        font-size: 0.875rem;
        margin: 0 auto;
        margin-top: 0.5rem;
    }
    && .MuiFormControlLabel-label {
        font-size: 0.875rem;
    }
    @media all and (max-width: 768px) {
        grid-column: 2/3;
        grid-row: 2/3;
    }
`

export const StyledItemTitle = styled(Box)`
    font-size: 0.85rem;
    font-weight: 800;
`

export const StyledTableBody = styled(Box)`
    background-color: #edf0f7;
    border-radius: 8px;
    padding: 1rem;
    margin: auto -1rem;
    display: grid;
    max-width: 650px;
    grid-template-rows: 30px 1fr auto;
    min-height: 250px;

    @media all and (max-width: 960px) {
        max-width: unset;
        width: 100%;
        margin: 0 0.25rem;
        grid-template-rows: 10px auto;
    }
`

export const StyledItemList__Header = styled(Box)`
    display: grid;
    grid-template-columns: 5fr 3fr 3fr 1fr;
    font-weight: 800;
    && .centered {
        text-align: center;
    }
    @media all and (max-width: 768px) {
        grid-template-columns: 7fr 5fr;
        visibility: hidden;
    }
    @media all and (max-width: 400px) {
        visibility: hidden;
    }
`

export const StyledAddArea = styled.div`
    margin-top: 2rem;
    display: flex;
    && .add-text {
        margin-right: 1rem;
    }
    && .MuiButton-root {
        font-weight: 600;
        background-color: ${props => props.theme.palette.info.main};
        color: white;
        min-width: 140px;
        padding: 0 20px;
        max-width: 200px;
        height: 40px;
        display: flex;
        align-items: center;
    }
    && button {
        margin-right: 1rem;
    }
    && button.disabled {
        background-color: ${props => props.theme.palette.grey[300]};
    }
    && button.save {
        background-color: ${props => props.theme.palette.success.main};
    }
    && button.cancel {
        background-color: ${props => props.theme.palette.error.light};
    }
    @media all and (max-width: 768px) {
        margin: unset;
        margin-top: 1rem;
        flex-direction: column;
        && .MuiButton-root {
            max-width: unset;
            width: 100%;
            margin-top: 0.5rem;
        }
    }
`
