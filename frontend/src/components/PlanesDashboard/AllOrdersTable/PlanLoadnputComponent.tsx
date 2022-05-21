import { TextField } from '@material-ui/core'
import {
    GridFilterForm,
    GridFilterInputValueProps,
} from '@material-ui/data-grid'
import { POStatuses } from 'src/constants'

export function PlanLoadInputValue(props: GridFilterInputValueProps) {
    const { item, applyValue } = props

    const handleFilterChange = event => {
        applyValue({ ...item, value: event.target.value })
    }

    return (
        <TextField
            variant="standard"
            type="checkbox"
            label="Exists"
            SelectProps={{
                native: true,
            }}
            onChange={handleFilterChange}
        ></TextField>
    )
}
