import { TextField } from '@material-ui/core'
import { GridFilterInputValueProps } from '@material-ui/data-grid'
import React from 'react'

const VendorInputSearch = (props: GridFilterInputValueProps) => {
    const { item, applyValue } = props

    const handleFilterChange = event => {
        applyValue({ ...item, value: event.target.value })
    }
    return (
        <TextField
            onChange={handleFilterChange}
            label="Vendor Name"
            variant="standard"
            sx={{ textAlign: 'center' }}
        />
    )
}

export default VendorInputSearch
