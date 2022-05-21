import React, { useContext } from 'react'
import { IconButton } from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import { ApiVendor } from 'src/types'
import { VendorEditContext } from 'src/contexts/VendorEditContext'

const EditVendorButton = ({ data }: { data: ApiVendor | any }) => {
    const { openEdit } = useContext(VendorEditContext)
    return (
        <IconButton onClick={() => openEdit(data.id)}>
            <Edit />
        </IconButton>
    )
}

export default EditVendorButton
