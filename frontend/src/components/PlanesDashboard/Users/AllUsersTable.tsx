import React, { useContext, useEffect } from 'react'
import useAdminQuery from 'src/hooks/useAdminQuery'
import { DataGrid, GridColDef } from '@material-ui/data-grid'
import { tablesStyle } from '../Styles/Table__Styles'
import { dashboardInner } from '../../dashboard/Dashboard__Styles/dashboardInner.theme'
import { LinearProgress } from '@material-ui/core'
import AlertCard from '../AlertCard'
import EditUserButton from './EditUserButton'
import DeleteUserButton from './DeleteUserButton'
import { UserEditContext } from 'src/contexts/UserEditContext'
import { ROLE_ID } from 'src/constants'
import Head from 'next/head'
const columns: GridColDef[] = [
    {
        field: 'UserId',
        headerName: 'ID',
        type: 'number',
        width: 80,
        editable: false,
        hide: true,
        sortable: true,
        valueFormatter: params => {
            return `${params.value}`
        },
    },
    {
        field: 'FirstName',
        headerName: 'First Name',
        type: 'text',
        headerAlign: 'center',
        width: 150,
        align: 'center',
        editable: false,
        hideSortIcons: false,
        sortable: false,
        disableReorder: false,
        disableColumnMenu: true,
        hide: false,
    },
    {
        field: 'LastName',
        headerName: 'Last Name',
        type: 'text',
        headerAlign: 'center',
        width: 150,
        align: 'center',
        editable: false,
        hideSortIcons: false,
        sortable: false,
        disableReorder: true,
        disableColumnMenu: true,
        hide: false,
    },
    {
        field: 'Email',
        headerName: 'Email',
        type: 'text',
        headerAlign: 'center',
        width: 200,
        align: 'center',
        editable: false,
        hideSortIcons: false,
        sortable: false,
        disableReorder: true,
        disableColumnMenu: true,
        hide: false,
    },
    {
        field: 'RoleName',
        headerName: 'Role',
        type: 'text',
        headerAlign: 'center',
        width: 160,
        align: 'center',
        editable: false,
        hideSortIcons: false,
        sortable: false,
        disableReorder: true,
        disableColumnMenu: true,
        hide: false,
        // renderCell: ({ row }) => {
        //     return <div>{ROLE_ID[row.role]}</div>
        // },
    },
    {
        field: 'VendorId',
        headerName: 'Vendor',
        type: 'text',
        headerAlign: 'center',
        width: 160,
        align: 'center',
        editable: true,
        hideSortIcons: true,
        sortable: false,
        disableReorder: true,
        disableColumnMenu: true,
        hide: false,
    },
    {
        field: 'VendorName',
        headerName: 'Vendor Name',
        type: 'text',
        headerAlign: 'center',
        width: 160,
        align: 'center',
        editable: false,
        hideSortIcons: true,
        sortable: false,
        disableReorder: true,
        hide: false,
    },
    {
        field: 'edit',
        headerName: 'Edit',
        filterable: false,
        type: 'text',
        headerAlign: 'center',
        width: 80,
        align: 'center',
        editable: false,
        hideSortIcons: true,
        sortable: false,
        disableReorder: false,
        disableColumnMenu: true,
        hide: false,
        renderCell: ({ row }) => {
            return <EditUserButton data={row} />
        },
    },
    {
        field: 'delete',
        headerName: 'Delete',
        filterable: false,
        type: 'text',
        headerAlign: 'center',
        width: 80,
        align: 'center',
        editable: false,
        hideSortIcons: true,
        sortable: false,
        disableReorder: false,
        disableColumnMenu: true,
        hide: false,
        renderCell: ({ row }) => {
            return <DeleteUserButton data={row} />
        },
    },
]

const AllUsersTable = () => {
    const classes: any = tablesStyle({ dashboardInner })

    const { error, loading, data, mutate } = useAdminQuery({
        path: '/user',
    })

    const {
        state: { createOpen, editOpen },
    } = useContext(UserEditContext)

    useEffect(() => {
        mutate()
    }, [createOpen, editOpen])

    if (loading) {
        return <LinearProgress />
    }
    if (error) {
        return (
            <AlertCard title={'An Error Occured'}>
                {error.message ? error.message : JSON.stringify(error)}
            </AlertCard>
        )
    }
    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <DataGrid
                className={classes.root}
                rows={data.users}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection={false}
                disableSelectionOnClick
                onPageChange={(page, details) => {
                    console.log({ page, details })
                }}
            />
        </>
    )
}

export default AllUsersTable
