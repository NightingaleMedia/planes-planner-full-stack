import { TextField } from '@material-ui/core'
import {
    GridFilterForm,
    GridFilterInputValueProps,
} from '@material-ui/data-grid'
import { POStatuses } from 'src/constants'

export function StatusInputValue(props: GridFilterInputValueProps) {
    const { item, applyValue } = props

    const handleFilterChange = event => {
        applyValue({ ...item, value: event.target.value })
    }

    return (
        <TextField
            variant="standard"
            select
            label="Status"
            SelectProps={{
                native: true,
            }}
            onChange={handleFilterChange}
        >
            {Object.keys(POStatuses).map(s => (
                <option key={s} value={s}>{POStatuses[s]}</option>
            ))}
        </TextField>
    )
}
