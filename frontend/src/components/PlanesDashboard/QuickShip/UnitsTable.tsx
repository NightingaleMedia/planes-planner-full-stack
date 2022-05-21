import React from 'react'
import styled from '@emotion/styled'
import SingleTableUnit from './SingleTableUnit'
import { Button } from '@material-ui/core'
import { QuickUnit } from 'pages/quick-ship/[purchaseOrderId]'

const TableWrap = styled.div`
    max-width: 900px;
    border: 1px solid ${props => props.theme.palette.grey[300]};
    border-radius: 6px;
    padding: 0.5rem;

    && .gridded {
        display: grid;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        padding-left: 1rem;
        grid-template-columns: 8% 15% 22% 30% 17% 8%;
    }
    && .MuiButton-root {
        color: white;
        width: 100%;
        background-color: ${props => props.theme.palette.primary.main};
    }
`
const HeaderArea = styled.div`
    background-color: ${props => props.theme.palette.background.default};
    padding: 1rem 0.5rem !important;
    padding-left: 1rem !important;
    border-radius: 10px;
    font-weight: 800;
`

type UnitsTable__Props = {
    onDuplicate: (i: any) => void
    onDelete: (i: any) => void
    onSelect: (i: any) => void
    onAdd: () => void
    selectedUnit: QuickUnit
    units: QuickUnit[]
}
const UnitsTable = ({
    onDuplicate,
    onDelete,
    onSelect,
    onAdd,
    selectedUnit,
    units,
}: UnitsTable__Props) => {
    return (
        <TableWrap>
            <HeaderArea className="gridded">
                <div>#</div>
                <div>Type *</div>
                <div>Weight *</div>
                <div>Measure *</div>
                <div>License #</div>
            </HeaderArea>
            {units.map((u, index) => (
                <SingleTableUnit
                    key={index}
                    unit={u}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    selectedUnit={selectedUnit}
                    onSelect={onSelect}
                />
            ))}
            <Button onClick={onAdd}>Add Unit</Button>
        </TableWrap>
    )
}

UnitsTable.propTypes = {}

export default UnitsTable
