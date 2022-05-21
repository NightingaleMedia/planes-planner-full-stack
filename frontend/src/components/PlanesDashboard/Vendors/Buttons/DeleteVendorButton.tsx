import React, { useContext } from 'react'
import { IconButton } from '@material-ui/core'
import { DeleteForever } from '@material-ui/icons'
import { ApiUser } from 'src/types'
import { VendorEditContext } from 'src/contexts/VendorEditContext'

const DeleteVendorButton = ({ data }: { data: ApiUser | any }) => {
    const { openDelete } = useContext(VendorEditContext)
    return (
        <IconButton onClick={() => openDelete(data.id)}>
            <DeleteForever />
        </IconButton>
    )
}

export default DeleteVendorButton
