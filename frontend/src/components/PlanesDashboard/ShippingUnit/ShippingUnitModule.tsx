import React, { useEffect, useState } from 'react'
import { FormControl, Button, LinearProgress } from '@material-ui/core'
import styled from '@emotion/styled'
import Module from '../Module'
import { Edit } from '@material-ui/icons'
import { EditShippingUnit__Modal } from './EditShippingUnit__Modal'
import { StyledProps } from 'src/types/styles'
import useApiQuery from 'src/hooks/useApiQuery'

const StyledShippingUnitCard = styled.div`
    font-size: 1rem;
`

const StyledForm = styled(FormControl)`
    width: 100%;
    display: grid;
    grid-template-columns: 140px auto;
    gap: 0.25rem;
    row-gap: 1rem;
    && .label {
        font-weight: 800;
    }
    && .add-items {
        grid-column: 1/-1;
        background-color: ${(props: StyledProps) =>
            props.theme.palette.info.main};
    }
    && .finalize {
        grid-column: 1/-1;
        background-color: ${(props: StyledProps) =>
            props.theme.palette.success.main};
    }
`

const StyledWeightDims = styled.div`
    margin-top: 1rem;
    display: grid;
    grid-column: 1/-1;
    padding: 1rem;
    border-radius: 8px;
    grid-template-columns: 140px repeat(3, 1fr);
    background-color: ${(props: StyledProps) =>
        props.theme.palette.background.default};
    width: 100%;
    && .bold {
        font-weight: 800;
    }
    && .header {
        grid-column: 2/5;
    }
    && .weight {
        font-size: 1.5rem;
        font-weight: 800;
    }
`

type ShippingUnitModule__Props = {
    planLoadName: string
    shippingUnitId: number

    editModuleOpen: boolean
    setEditModuleOpen: (v: boolean) => void
}

export const ShippingUnitModule = ({
    planLoadName,
    shippingUnitId,

    editModuleOpen,
    setEditModuleOpen,
}: ShippingUnitModule__Props): any => {
    if (!shippingUnitId) {
        return (
            <Module title={'Shipping Unit'} subtitle={'None Selected'}>
                <div style={{ padding: '1rem', backgroundColor: '#f7f7f7' }}>
                    Please select a shipping unit.
                </div>
            </Module>
        )
    }
    const { error, loading, data, mutate } = useApiQuery({
        path: `/shipping-units/${shippingUnitId}`,
    })

    if (loading || !data) {
        return (
            <Module title={'Shipping Unit'} subtitle={'None Selected'}>
                <LinearProgress />
            </Module>
        )
    }

    return (
        <>
            <Module
                title={'Shipping Unit'}
                subtitle={`ID#: ${data?.PlanLoadShippingUnitId} ${
                    data?.LicensePlateNbr
                        ? '| License #: ' + data?.LicensePlateNbr
                        : ''
                }`}
                actions={[
                    {
                        name: 'Edit SU Details',
                        onClick: () => setEditModuleOpen(true),
                    },
                ]}
            >
                <StyledShippingUnitCard>
                    <StyledForm>
                        <div className="label load-name">Load Name:</div>
                        <div className="load-name">{planLoadName}</div>
                        <div className="label">Load Type</div>
                        <div className="label">{data?.Packaging}</div>

                        <StyledWeightDims>
                            <div className="bold">
                                Weight
                                <hr />
                            </div>
                            <div className="bold header">
                                Dimensions
                                <hr />
                            </div>

                            <div className={'weight'}>
                                {data.Weight} {data.WeightUnits.toLowerCase()}
                            </div>
                            {['Length', 'Width', 'Height'].map(d => (
                                <div key={d}>
                                    <div>{d}</div>
                                    <div>
                                        {data[d]} {data.DimUnits.toLowerCase()}
                                    </div>
                                </div>
                            ))}
                        </StyledWeightDims>

                        <Button
                            onClick={() => setEditModuleOpen(true)}
                            className="add-items"
                            variant={'contained'}
                        >
                            <span
                                style={{
                                    marginRight: '0.5rem',
                                    fontWeight: 800,
                                }}
                            >
                                EDIT SU DETAILS
                            </span>
                            <Edit />
                        </Button>
                    </StyledForm>
                </StyledShippingUnitCard>
            </Module>
            <EditShippingUnit__Modal
                onEdit={mutate}
                open={editModuleOpen}
                setOpen={value => setEditModuleOpen(value)}
                shipUnitDetails={data}
            />
        </>
    )
}

export default ShippingUnitModule
