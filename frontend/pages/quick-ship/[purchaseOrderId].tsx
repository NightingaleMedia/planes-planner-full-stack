import { Grid, LinearProgress, Button } from '@material-ui/core'
import React, { useState } from 'react'
import Head from 'next/head'
import Module from 'src/components/PlanesDashboard/Module'
import styled from '@emotion/styled'
import CreateUnit from 'src/components/PlanesDashboard/QuickShip/CreateUnit'
import UnitsTable from 'src/components/PlanesDashboard/QuickShip/UnitsTable'
import { ItemsToShipTable } from 'src/components/PlanesDashboard/PrepareItems'
import { useRouter } from 'next/router'
import useApiQuery from 'src/hooks/useApiQuery'
import { FetchApi } from 'lib/fetchApi'
import AlertCard from 'src/components/PlanesDashboard/AlertCard'
import toast from 'react-hot-toast'

const QuickMap = styled.div`
    &&.submitting {
        opacity: 0.2;
    }
    display: flex;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    @media all and (max-width: 900px) {
        display: block;
    }
`
const SingleUnit = styled.div`
    width: 100%;
    max-width: 360px;
    && .MuiPaper-root {
        background-color: white;
    }
`
const TableWrap = styled.div`
    flex-grow: 1;
    margin-left: 1rem;
    @media all and (max-width: 900px) {
        margin: unset;
        margin-top: 1rem;
    }
`

export type QuickUnit = {
    index: number
    LicensePlateNbr: string | null
    Weight: string
    WeightUnits: string
    DimUnits: string
    Length: string
    Width: string
    Height: string
    Packaging: string
    errors: string[]
    selected: boolean
    PlanLoadId?: any
}

const clone = {
    index: 0,
    LicensePlateNbr: null,
    Weight: '0',
    WeightUnits: 'LBS',
    DimUnits: 'in',
    Length: '0',
    Width: '0',
    Height: '0',
    Packaging: 'Pallet',
    errors: [],
    selected: true,
}

const QuickShip = () => {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const { error, loading, data, mutate } = useApiQuery({
        path: `/plan-loads/${router.query.purchaseOrderId}`,
    })
    const [numUnits, setNumUnits] = useState<QuickUnit[]>([clone])

    // reorder them after a remove or add

    function onAdd() {
        let units = [...numUnits]
        const lastUnit = units[units.length - 1]
        const newUnit = { ...clone, index: lastUnit.index + 1 }
        units.push(newUnit)

        units = units.map((u, index) => ({ ...u, index, selected: false }))

        units[units.findIndex(u => u.index === newUnit.index)].selected = true

        setNumUnits(units)
    }

    function removeUnit(index) {
        let units = [...numUnits]

        if (units.length === 1) {
            return
        }
        const unitToRemove = units.findIndex(u => u.index === index)

        units.splice(unitToRemove, 1)
        units = units.map((u, index) => ({ ...u, index, selected: false }))
        units[0].selected = true

        setNumUnits(units)
    }

    const handleChange = (index, e) => {
        const { value, name } = e.target
        if (
            ['Height', 'Weight', 'Length', 'Weight'].includes(name) &&
            isNaN(Number(value))
        ) {
            return toast.error('Numbers only!')
        }
        const units = [...numUnits]
        const unitToChange = units.findIndex(u => u.index === index)
        const copy = units.find(u => u.index === index)

        units[unitToChange] = { ...copy, [name]: value }

        setNumUnits(units)
    }

    const handleSelect = index => {
        let units = [...numUnits]

        units = units.map(u => ({
            ...u,
            selected: false,
        }))

        const found = units.find(u => u.index === index)
        found.selected = true

        setNumUnits(units)
    }

    const onDuplicate = index => {
        let units = [...numUnits]

        units.splice(index, 0, units[index])
        units = units.map((u, index) => ({ ...u, index, selected: false }))
        units[index + 1].selected = true

        setNumUnits(units)
    }

    const handleShip = async () => {
        setSubmitting(true)

        await FetchApi({
            path: `/quick-ship/${data[0].PlanLoadId}/`,
            options: {
                method: 'POST',
                body: JSON.stringify({ units: numUnits }),
            },
        })
            .then(res => {
                toast.success('Quick ship complete!')
                router.push(`/orders/${router.query.purchaseOrderId}`)
                mutate()
            })
            .catch(errors => {
                setSubmitting(false)
                const units = [...numUnits]
                console.log(errors)
                units.forEach(u => (u.errors = []))
                errors.forEach(err => {
                    if (err) {
                        const unitToChange = units.findIndex(
                            u => u.index === err.index
                        )
                        units[unitToChange].errors = [...err.errors]
                        setNumUnits(units)
                    }
                })
            })
    }
    if (loading) {
        return (
            <>
                <Head>
                    <title>Loading...</title>
                </Head>
                <LinearProgress />
            </>
        )
    }
    if (!data) {
        return (
            <>
                <Head>
                    <title>Quick Ship | {router.query.purchaseOrderId}</title>
                </Head>
                <AlertCard title="No Data Was Returned">
                    We cannot find that order. If you believe this is an issue
                    please contact a planes administrator.
                    <Button
                        variant="outlined"
                        onClick={() => router.push('/orders/status/open')}
                    >
                        Back To All Orders
                    </Button>
                </AlertCard>
            </>
        )
    }
    // if the location is not vendor
    if (data[0]?.LocationId !== Number(1636) || error) {
        router.push(`/orders/${router.query.purchaseOrderId}`)
        return <LinearProgress />
    }

    if (data) {
        return (
            <>
                <Head>
                    <title>Quick Ship | {router.query.purchaseOrderId}</title>
                </Head>
                <QuickMap className={submitting && 'submitting'}>
                    <SingleUnit>
                        <CreateUnit
                            index={numUnits.find(u => u.selected).index}
                            data={numUnits.find(u => u.selected)}
                            onChange={e =>
                                handleChange(
                                    numUnits.find(u => u.selected).index,
                                    e
                                )
                            }
                        />
                    </SingleUnit>
                    <TableWrap>
                        <Module
                            title={`Quick Ship ${numUnits.length} Units`}
                            subtitle={
                                data &&
                                `${data[0].LoadName} | Plan Load: ${data[0].PlanLoadId}`
                            }
                            actions={[
                                { name: 'Finalize', onClick: handleShip },
                                {
                                    name: 'Detailed Ship',
                                    onClick: () =>
                                        router.push(
                                            `/shipping-units/${router.query.purchaseOrderId}`
                                        ),
                                },
                                {
                                    name: 'Back To PO Details',
                                    onClick: () =>
                                        router.push(
                                            `/orders/${router.query.purchaseOrderId}`
                                        ),
                                },
                            ]}
                        >
                            <UnitsTable
                                selectedUnit={
                                    numUnits.filter(u => u.selected)[0]
                                }
                                units={numUnits}
                                onAdd={onAdd}
                                onSelect={handleSelect}
                                onDelete={removeUnit}
                                onDuplicate={onDuplicate}
                            />
                        </Module>
                    </TableWrap>
                </QuickMap>
                <Grid container spacing={3}>
                    <Grid item md={12} sm={12}>
                        <ItemsToShipTable
                            purchaseOrderId={router.query.purchaseOrderId.toString()}
                        />
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default QuickShip
