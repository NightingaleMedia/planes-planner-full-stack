import React, { useContext } from 'react'
import { IconButton } from '@material-ui/core'
import { DeleteForever, Edit } from '@material-ui/icons'
import { UserEditContext } from 'src/contexts/UserEditContext'
import { ApiUser } from 'src/types'

const DeleteUserButton = ({ data }: { data: ApiUser | any }) => {
    const { openDelete } = useContext(UserEditContext)
    return (
        <IconButton onClick={() => openDelete(data.id)}>
            <DeleteForever />
        </IconButton>
    )
}

export default DeleteUserButton
