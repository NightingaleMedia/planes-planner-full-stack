import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { dashboardInner } from '../dashboard/Dashboard__Styles/dashboardInner.theme'
import {
    DataGrid,
    getGridStringOperators,
    GridCellParams,
    GridColDef,
    GridFilterItem,
    GridToolbar,
} from '@material-ui/data-grid'
import { tablesStyle } from './Styles/Table__Styles'
import { PlanLoadFinder, PoDetail__Menu, PoStatus } from './PODetail'
import useApiQuery from 'src/hooks/useApiQuery'

import DateParse from '../Assets/DateParse'
import Module from './Module'
import { AllPoResponse } from 'pages/api/purchase-orders'
import ErrorModule from './ErrorModule'
import AllOrdersTable__Loading from './AllOrdersTable__Loading'
import useAuth from 'src/hooks/useAuth'
import { Typography } from '@material-ui/core'
import { StatusInputValue } from './AllOrdersTable/StatusInputComponent'
import { DateInputValue } from './AllOrdersTable/DateInputComponent'
import { CustomToolbar } from './AllOrdersTable/TableToolbar'

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 80,
        editable: false,
        filterable: false,
        hide: true,
        hideSortIcons: true,
    },
    {
        field: 'BusinessUnit',
        headerName: 'Bus Unit',
        headerAlign: 'center',
        align: 'center',
        editable: true,
        hideSortIcons: true,
        minWidth: 80,
        disableColumnMenu: true,
    },
    {
        field: 'PurchaseOrderNbr',
        headerName: 'PO #',
        hideSortIcons: true,
        filterOperators: getGridStringOperators().filter(
            o => o.value === 'equals' || o.value === 'contains'
        ),
        minWidth: 150,
        disableColumnMenu: false,
    },
    {
        field: 'POStatus',
        headerName: 'Status',
        type: 'text',
        headerAlign: 'center',
        align: 'center',
        width: 180,
        editable: false,
        filterable: true,
        disableColumnMenu: false,

        filterOperators: [
            {
                label: 'is',
                value: 'Is',
                InputComponent: StatusInputValue,
                getApplyFilterFn: (
                    filterItem: GridFilterItem,
                    column: GridColDef
                ) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }

                    return (params: GridCellParams): boolean => {
                        return params.value === filterItem.value
                    }
                },
            },
        ],
        hideSortIcons: false,
        renderCell: data => {
            return (
                <PoStatus
                    planLoadId={data.row.PlanLoadId}
                    purchaseOrderId={data.row.PurchaseOrderId}
                />
            )
        },
    },
    {
        field: 'VendorId',
        headerName: 'Vendor Id',
        type: 'text',
        align: 'center',
        headerAlign: 'center',
        width: 120,
        editable: false,
        hideSortIcons: true,
        filterable: false,
        sortable: true,
        disableReorder: true,
        disableColumnMenu: true,
        hide: true,
    },
    {
        field: 'StoreNbr',
        headerName: 'Store #',
        type: 'text',
        headerAlign: 'left',
        width: 120,
        editable: true,
        hideSortIcons: false,
        filterable: false,
        sortable: false,
        disableReorder: true,
        disableColumnMenu: true,
        hide: false,
    },
    {
        field: 'VendorName',
        headerName: 'Vendor Name',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        filterable: false,
        disableColumnMenu: true,
        width: 160,
        hide: true,
    },
    {
        field: 'poIssueDate',
        headerName: 'Issue Date',
        width: 130,
        filterable: false,
        editable: false,
        disableColumnMenu: true,
        hide: true,
    },
    {
        field: 'poShipDate',
        headerName: 'Ship Date',
        width: 120,
        filterable: false,
        editable: false,
        disableColumnMenu: true,
        renderCell: data => <DateParse>{data.value}</DateParse>,
    },
    {
        field: 'PurchaseOrderDueDate',
        headerName: 'Due Date',
        width: 120,
        filterable: true,
        editable: false,
        disableColumnMenu: true,
        align: 'center',
        headerAlign: 'center',
        filterOperators: [
            {
                label: 'After',
                value: 'after',
                InputComponent: DateInputValue,
                getApplyFilterFn: (
                    filterItem: GridFilterItem,
                    column: GridColDef
                ) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }
                    return (params: any): boolean => {
                        const dateToFilter = Date.parse(filterItem.value)
                        const dateOfRow = Date.parse(params.value)
                        return dateToFilter < dateOfRow
                    }
                },
            },
            {
                label: 'Before',
                value: 'before',
                InputComponent: DateInputValue,
                getApplyFilterFn: (
                    filterItem: GridFilterItem,
                    column: GridColDef
                ) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }

                    return (params: any): boolean => {
                        const dateToFilter = Date.parse(filterItem.value)
                        const dateOfRow = Date.parse(params.value)

                        return dateToFilter > dateOfRow
                    }
                },
            },
            {
                label: 'Equals',
                value: 'equals',
                InputComponent: DateInputValue,
                getApplyFilterFn: (
                    filterItem: GridFilterItem,
                    column: GridColDef
                ) => {
                    if (
                        !filterItem.columnField ||
                        !filterItem.value ||
                        !filterItem.operatorValue
                    ) {
                        return null
                    }

                    return (params: any): boolean => {
                        const dateToFilter = filterItem.value
                        let dateOfRow = new Date(params.value) as any
                        let month = dateOfRow.getMonth() + 1
                        if (dateOfRow.getMonth() < 10) {
                            month = '0' + month
                        }
                        let date = dateOfRow.getDate()

                        if (date < 10) {
                            date = '0' + date
                        }
                        dateOfRow = `${month}/${date}/${dateOfRow.getFullYear()}`
                        console.log({ dateToFilter, dateOfRow })
                        return dateToFilter == dateOfRow
                    }
                },
            },
        ],
        renderCell: data => <DateParse>{data.value}</DateParse>,
    },
    {
        field: 'poShipTo',
        headerName: 'PO Ship To',
        type: 'text',
        headerAlign: 'left',
        width: 180,
        editable: false,
        hideSortIcons: true,
        hide: true,
        filterable: false,
    },
    {
        field: 'PurchaseOrderReference',
        headerName: 'PO Reference',
        type: 'text',
        headerAlign: 'left',
        width: 180,
        filterable: false,
        editable: false,
        disableColumnMenu: true,
        hideSortIcons: true,
        hide: true,
    },
    {
        field: 'planLoadId',
        headerName: 'Plan Load',
        type: 'text',
        align: 'left',
        headerAlign: 'left',
        filterable: false,
        width: 200,
        editable: false,
        disableColumnMenu: true,
        hideSortIcons: false,
        renderCell: data => (
            <PlanLoadFinder
                purchaseOrderId={data.row.PurchaseOrderId}
                index={data.row.PurchaseOrderIndex}
            />
        ),
    },
    {
        field: 'contextMenu',
        headerName: 'Action',
        width: 120,
        editable: false,
        filterable: false,
        disableColumnMenu: true,
        hideSortIcons: true,
        align: 'center',
        headerAlign: 'center',
        renderCell: data => <PoDetail__Menu data={data.row} info={data} />,
    },
]

type AllOrder__Response = {
    error: boolean
    loading: boolean
    data: AllPoResponse
}

type AllOrdersTable__Props = {
    orderQuery?: 'open' | ''
}

const AllOrdersTable = ({ orderQuery }: AllOrdersTable__Props) => {
    if (!orderQuery) orderQuery = ''

    const router = useRouter()

    const { error, loading, data }: AllOrder__Response = useApiQuery({
        path: `/purchase-orders/${orderQuery}?start=10&count=10`,
    })

    const { user } = useAuth()

    const classes: any = tablesStyle({ dashboardInner })
    const [rows, setRows] = useState([])
    const [filters, setFilters] = useState([])
    const [selectedCellData, setSelectedCellData] = useState(null)
    const [pageSize, setPageSize] = useState(20)

    // transform data
    useEffect(() => {
        if (data) {
            const newRows = data.orders.map((d, index) => {
                return { id: index, ...d }
            })
            setRows(newRows)
        }
    }, [data])

    // handle query param
    useEffect(() => {
        const { status } = router.query

        if (status) {
            let objArray = []
            if (Array.isArray(status)) {
                objArray = status.map((s, index) => {
                    if (s === 'null') {
                        s = null
                    }
                    return {
                        id: index,
                        columnField: 'POStatus',
                        operatorValue: 'Is',
                        value: s,
                    }
                })
            } else {
                objArray = [
                    {
                        columnField: 'POStatus',
                        operatorValue: 'Is',
                        value: status,
                    },
                ]
            }
            setFilters(objArray)
        }
    }, [router.query])

    const handlePoOpen = selected => {
        router.push({
            pathname: `/orders/${selected.PurchaseOrderId}`,
        })
    }
    if (error) {
        return <ErrorModule error={error} />
    }
    // console.log(getGridStringOperators())
    return (
        <Module
            title={
                orderQuery === 'open'
                    ? 'Open Purchase Orders'
                    : 'All Purchase Orders'
            }
            subtitle={
                <>
                    <Typography variant={'body1'}>
                        Vendor ID#: {user.company}
                    </Typography>
                </>
            }
        >
            {loading ? (
                <AllOrdersTable__Loading />
            ) : (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                    onRowDoubleClick={({ row }) => {
                        setSelectedCellData(row)
                        handlePoOpen(row)
                    }}
                    getRowClassName={({ row }) => {
                        const v = row.PurchaseOrderIndex
                        return `index--${v}`
                    }}
                    className={classes.root}
                    pageSize={pageSize}
                    rowsPerPageOptions={[20, 50, 100]}
                    onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                    checkboxSelection={false}
                    disableSelectionOnClick
                />
            )}
        </Module>
    )
}
export default AllOrdersTable
