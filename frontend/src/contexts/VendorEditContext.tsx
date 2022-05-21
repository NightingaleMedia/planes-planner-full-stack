import React, { createContext, useEffect, useState } from 'react'
import { ApiUser } from 'src/types'
import getVendorQuery from 'src/hooks/adminQueries/getVendorQuery'

const initialState = {
    state: {
        selectedVendor: null,
        editOpen: false,
        createOpen: false,
        deleteOpen: false,
        vendorToModify: null,
    },
    openEdit: id => {},
    closeEdit: () => {},
    openDelete: id => {},
    closeDelete: () => {},
    openCreate: () => {},
    closeCreate: () => {},
    loading: false,
}

export const VendorEditContext = createContext(initialState)

type VendorEditProvider = {
    children: any
}

type VendorEditState = {
    selectedVendor: string | null
    editOpen: boolean
    createOpen: boolean
    deleteOpen: boolean
    vendorToModify: ApiUser | null
}
const VendorEditProvider = ({ children }: VendorEditProvider) => {
    const { error, loading, getVendor } = getVendorQuery()

    const [state, setState] = useState<VendorEditState>(initialState.state)

    const openEdit = id => {
        setState(prev => ({
            ...prev,
            selectedVendor: id,
            editOpen: true,
            createOpen: false,
            deleteOpen: false,
        }))
    }
    const closeEdit = () => {
        setState(prev => ({
            ...prev,
            editOpen: false,
            selectedVendor: null,
        }))
    }
    const openDelete = id => {
        setState(prev => ({
            ...prev,
            selectedVendor: id,
            deleteOpen: true,
        }))
    }
    const closeDelete = () => {
        setState(prev => ({
            ...prev,
            deleteOpen: false,
        }))
    }
    const openCreate = () => {
        setState(prev => ({
            ...prev,
            editOpen: false,
            createOpen: true,
            deleteOpen: false,
        }))
    }
    const closeCreate = () => {
        setState(prev => ({
            ...prev,
            createOpen: false,
        }))
    }

    useEffect(() => {
        if (state.selectedVendor) {
            console.log({ v: state.selectedVendor })
            getVendor(state.selectedVendor).then(res => {
                console.log({ res })
                setState(prev => ({ ...prev, vendorToModify: res }))
            })
        }
    }, [state.selectedVendor])

    return (
        <VendorEditContext.Provider
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
        </VendorEditContext.Provider>
    )
}

export default VendorEditProvider
