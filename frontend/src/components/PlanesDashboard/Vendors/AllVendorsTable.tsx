import React from 'react'
import Head from 'next/head'
import useAdminQuery from 'src/hooks/useAdminQuery'
import {
    DataGrid,
    GridColDef,
    GridFilterItem,
    GridToolbar,
} from '@material-ui/data-grid'
import { tablesStyle } from '../Styles/Table__Styles'
import { dashboardInner } from '../../dashboard/Dashboard__Styles/dashboardInner.theme'
import { LinearProgress } from '@material-ui/core'
import AlertCard from '../AlertCard'
import DeleteVendorButton from './Buttons/DeleteVendorButton'
import EditVendorButton from './Buttons/EditVendorButton'
import VendorInputSearch from './VendorInputSearch'

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 80,
        editable: false,
        hide: true,
        hideSortIcons: true,
        filterable: true,
    },
    {
        field: 'VendorId',
        headerName: 'Vendor Id',
        type: 'number',
        headerAlign: 'center',
        width: 120,
        align: 'center',
        filterable: true,
        editable: false,
        hideSortIcons: false,
        sortable: true,
        disableReorder: false,
        disableColumnMenu: true,
        hide: false,
        valueFormatter: params => {
            return `${params.value}`
        },
    },
    {
        field: 'VendorCode',
        headerName: 'Vendor Code',
        type: 'number',
        headerAlign: 'center',
        width: 180,
        align: 'center',
        editable: false,
        hideSortIcons: false,
        sortable: true,
        disableReorder: true,
        disableColumnMenu: true,
        hide: false,
        valueFormatter: params => {
            return `${params.value}`
        },
    },
    {
        field: 'VendorName',
        headerName: 'Vendor Name',
        type: 'text',
        headerAlign: 'center',
        width: 220,
        align: 'center',
        editable: false,
        hideSortIcons: false,
        filterable: true,
        filterOperators: [
            {
                label: 'Contains',
                value: 'contains',
                InputComponent: VendorInputSearch,
                getApplyFilterFn: (filterItem: GridFilterItem) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }

                    return (params: any): boolean => {
                        const request = filterItem.value.toLowerCase()
                        const answer = params?.value?.toLowerCase()
                        return params.value && answer.search(request) !== -1
                    }
                },
            },
        ],
        sortable: false,
        disableReorder: true,
        disableColumnMenu: false,
        hide: false,
    },
    {
        field: 'VendorLongName',
        headerName: 'Long Name',
        type: 'text',
        headerAlign: 'center',
        width: 320,
        align: 'center',
        editable: false,
        hideSortIcons: false,
        filterable: true,
        sortable: false,
        disableReorder: true,
        disableColumnMenu: true,
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
            return <EditVendorButton data={row} />
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
            return <DeleteVendorButton data={row} />
        },
    },
]

const AllVendorsTable = () => {
    const classes: any = tablesStyle({ dashboardInner })

    const { error, loading, data } = useAdminQuery({
        path: '/vendor',
    })

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
                <title>Vendors</title>
            </Head>
            <DataGrid
                className={classes.root}
                rows={data.vendors}
                columns={columns}
                components={{
                    Toolbar: GridToolbar,
                }}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection={false}
                disableSelectionOnClick
                onPageChange={(page, details) => {
                    console.log({ page, details })
                }}
                // filterModel={{
                //     items: [
                //         {
                //             columnField: 'POStatus',
                //             operatorValue: 'contains',
                //             value: 'new',
                //         },
                //     ],
                // }}
            />
        </>
    )
}

AllVendorsTable.propTypes = {}

export default AllVendorsTable
