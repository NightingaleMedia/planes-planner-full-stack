import React from 'react'
import styled from '@emotion/styled'
import ItemMenu from './ItemMenu'
import { QuickUnit } from 'pages/quick-ship/[purchaseOrderId]'
import { ArrowLeft } from '@material-ui/icons'

const UnitWrap = styled.div`
    border: 2px solid ${props => props.theme.palette.grey[200]};
    position: relative;
    border-radius: 6px;
    background-color: #fff;
    padding: 0.5rem;
    margin: 0.5rem 0;

    &&:hover {
        background-color: #f7f7f7;
        cursor: pointer;
    }
    && .MuiSvgIcon-root.indicator {
        color: ${props => props.theme.palette.secondary.light};
        visibility: hidden;
        position: absolute;
        font-size: 3.5rem;
        left: -35px;
    }
    &&.selected {
        /* color: white; */
        margin-left: 0.68rem;
        font-weight: 800;
        transition: all 0.2s ease;
        border: 3px solid ${props => props.theme.palette.secondary.light};
        box-shadow: ${props => props.theme.shadows[4]};
        /* && .MuiSvgIcon-root {
            color: white;
        } */
        && .MuiSvgIcon-root.indicator {
            visibility: unset;
            color: ${props => props.theme.palette.secondary.light};
        }
    }
`
const StyledWeight = styled.div`
    display: flex;
    text-align: center;
    && > div {
        margin-right: 0.5rem;
    }
`

const StyledError = styled.div`
    grid-column: 1/-1;
    color: ${props => props.theme.palette.error.main};
`

export type SingleTableUnit__Props = {
    onDuplicate: (i: number) => void
    onDelete: (i: number) => void
    onSelect: (i: number) => void
    selectedUnit: QuickUnit
    unit: QuickUnit
}
const SingleTableUnit = ({
    onDuplicate,
    onDelete,
    onSelect,
    selectedUnit,
    unit,
}: SingleTableUnit__Props) => {
    return (
        <UnitWrap
            onClick={() => onSelect(unit.index)}
            className={`gridded ${
                selectedUnit.index === unit.index ? ' selected' : ''
            }`}
        >
            <div>{unit.index + 1}</div>
            <div>{unit.Packaging}</div>
            <StyledWeight>
                <div>{unit.Weight}</div>
                <div>{unit.WeightUnits}</div>
            </StyledWeight>
            <StyledWeight>
                <div>{unit.Length}</div>
                <div>X</div>
                <div>{unit.Width}</div>
                <div>X</div>
                <div>{unit.Height}</div>
                <div>{unit.DimUnits}</div>
            </StyledWeight>
            <ArrowLeft className="indicator" />
            <div>{unit['License Nbr']}</div>
            <div>
                <ItemMenu
                    index={unit.index}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                />
            </div>
            <ErrorArea errors={unit.errors} />
        </UnitWrap>
    )
}

type ErrorProps = { errors: string[] }
const ErrorArea = ({ errors }: ErrorProps) => {
    return (
        <StyledError>
            {errors.length > 0 && errors.map((e, i) => <div key={i}>{e}</div>)}
        </StyledError>
    )
}

export default SingleTableUnit
