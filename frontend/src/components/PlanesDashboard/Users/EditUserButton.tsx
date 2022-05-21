import React, { useContext } from 'react'
import { IconButton } from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import { UserEditContext } from 'src/contexts/UserEditContext'
import { ApiUser } from 'src/types'

const EditUserButton = ({ data }: { data: ApiUser | any }) => {
    const { openEdit } = useContext(UserEditContext)
    return (
        <IconButton onClick={() => openEdit(data.id)}>
            <Edit />
        </IconButton>
    )
}

export default EditUserButton
