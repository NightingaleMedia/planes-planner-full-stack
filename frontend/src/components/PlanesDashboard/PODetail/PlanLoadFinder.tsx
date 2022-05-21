import { CircularProgress } from '@material-ui/core'
import styled from '@emotion/styled'
import React from 'react'
import useApiQuery from 'src/hooks/useApiQuery'

const PlanLoadFinder__Wrap = styled.div`
    width: max-content;
    margin: auto;
`

const PlanLoadBox = styled.span`
    font-weight: 800;
    padding: 6px;
    width: inherit;

    &&.error {
        border: 2px solid ${props => props.theme.palette.error.main};
        color: ${props => props.theme.palette.error.main};
        margin: auto;
    }
    &&.info {
        text-align: left !important;
        margin: 0 !important;
        color: ${props => props.theme.palette.info.main};
    }
    &&.short {
        text-align: left !important;
        margin: 0 !important;
        color: white;
    }
    && span.tooltip {
        position: absolute;
        top: -20px;
        left: 0;
        visibility: hidden;
    }

    &&:hover span.tooltip {
        visibility: visible;
    }
`

type Finder = {
    purchaseOrderId: number
    index: number | string
}

const PlanLoadFinder = ({ purchaseOrderId, index = 1 }: Finder): any => {
    const { error, loading, data } = useApiQuery({
        path: `/plan-loads/quick-find?purchaseOrderId=${purchaseOrderId}&index=${index}`,
    })
    if (error)
        return (
            <PlanLoadFinder__Wrap>
                <PlanLoadBox className="error">{error.message}</PlanLoadBox>
            </PlanLoadFinder__Wrap>
        )

    if (loading || !data)
        return <CircularProgress style={{ width: '20px', height: '20px' }} />
    if (data) {
        const title =
            index === 1 ? (
                <PlanLoadBox className={'info'} title={data.LoadName}>
                    {data.LoadName}
                </PlanLoadBox>
            ) : (
                <PlanLoadBox
                    className={'short'}
                    title={`SHORT SHIP - ${data.LoadName}`}
                >
                    SHORT SHIP - {data.LoadName}
                </PlanLoadBox>
            )
        return <PlanLoadFinder__Wrap>{title}</PlanLoadFinder__Wrap>
    }
}

export default PlanLoadFinder
