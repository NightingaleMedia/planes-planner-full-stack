import React, { createContext, useEffect, useState } from 'react'
import getUserQuery from 'src/hooks/adminQueries/getUserQuery'
import { ApiUser } from 'src/types'

const initialState = {
    state: {
        selectedUser: null,
        editOpen: false,
        createOpen: false,
        deleteOpen: false,
        userToModify: null,
    },
    openEdit: id => {},
    closeEdit: () => {},
    openDelete: id => {},
    closeDelete: () => {},
    openCreate: () => {},
    closeCreate: () => {},
    loading: false,
}

export const UserEditContext = createContext(initialState)

type UserEditProvider = {
    children: any
}

type UserEditState = {
    selectedUser: string | null
    editOpen: boolean
    createOpen: boolean
    deleteOpen: boolean
    userToModify: ApiUser | null
}
const UserEditProvider = ({ children }: UserEditProvider) => {
    const { error, loading, user, getUser } = getUserQuery()

    const [state, setState] = useState<UserEditState>(initialState.state)

    const openEdit = id => {
        setState(prev => ({
            ...prev,
            selectedUser: id,
            editOpen: true,
            createOpen: false,
            deleteOpen: false,
        }))
    }
    const closeEdit = () => {
        setState(prev => ({
            ...prev,
            editOpen: false,
            selectedUser: null,
        }))
    }
    const openDelete = id => {
        setState(prev => ({
            ...prev,
            selectedUser: id,
            editOpen: false,
            createOpen: false,
            deleteOpen: true,
        }))
    }
    const closeDelete = () => {
        setState(prev => ({
            ...prev,
            deleteOpen: false,
            selectedUser: null,
        }))
    }
    const openCreate = () => {
        setState(prev => ({
            ...prev,
            selectedUser: null,
            editOpen: false,
            createOpen: true,
            deleteOpen: false,
        }))
    }
    const closeCreate = () => {
        setState(prev => ({
            ...prev,
            createOpen: false,
            selectedUser: null,
        }))
    }

    useEffect(() => {
        if (state.selectedUser) {
            getUser(state.selectedUser).then(res => {
                console.log({ res })
                setState(prev => ({ ...prev, userToModify: res }))
            })
        }
    }, [state.selectedUser])

    return (
        <UserEditContext.Provider
            value={{
                state,
                openEdit,
                loading,
                openDelete,
                closeDelete,
                closeEdit,
                openCreate,
                closeCreate,
            }}
        >
            {children}
        </UserEditContext.Provider>
    )
}

export default UserEditProvider
