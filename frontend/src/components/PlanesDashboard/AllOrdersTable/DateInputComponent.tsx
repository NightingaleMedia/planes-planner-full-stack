import { GridFilterInputValueProps } from '@material-ui/data-grid'
import styled from '@emotion/styled'

const StyledInput = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    && input {
        font-size: 1rem;
    }
`
export function DateInputValue(props: GridFilterInputValueProps) {
    const { item, applyValue } = props

    const handleFilterChange = event => {
        const v = event.target.value

        const vd = {
            y: v.slice(0, 4),
            m: v.slice(5, 7),
            d: v.slice(-2),
        }

        applyValue({ ...item, value: `${vd.m}/${vd.d}/${vd.y}` })
    }

    return (
        <StyledInput>
            <input type="date" onChange={handleFilterChange}></input>
        </StyledInput>
    )
}
