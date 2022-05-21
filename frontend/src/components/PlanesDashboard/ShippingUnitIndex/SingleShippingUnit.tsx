import React from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@material-ui/core'
import { ArrowDropDownCircle } from '@material-ui/icons'
import SingleShippingUnitItem from './SingleShippingUnitItem'
import styled from '@emotion/styled'
const StyledAccordion = styled(Accordion)``

const StyledAccordionSummary = styled(AccordionSummary)`
    background-color: ${props => props.theme.palette.info.main};
    color: white;
    border-radius: 6px;
    && .MuiAccordionSummary-contentGutters {
        margin: 6px 0;
    }
`
const StyledSummary = styled.div`
    display: grid;
    width: 90%;
    grid-template-columns: 80% 20%;
    grid-template-rows: 34px 18px;
    && h3,
    h4,
    .MuiTypography-overline {
        margin: 0;
        line-height: unset;
        color: white;
        text-align: left;
    }
    @media all and (max-width: 600px) {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        && .lbs {
            font-size: 0.75rem;
        }
    }
`

export type SingleShippingUnit__Props = {
    // TODO figure this props out
    data: any
    correspondingDetails: any
}
const SingleShippingUnit = ({
    data,
    correspondingDetails,
}: SingleShippingUnit__Props) => {
    return (
        <StyledAccordion>
            <StyledAccordionSummary
                expandIcon={
                    <ArrowDropDownCircle
                        sx={{ color: 'white', fontSize: '2rem' }}
                    />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <StyledSummary>
                    <Typography variant={'h3'} sx={{ color: 'white' }}>
                        {data.Packaging} {data.PlanLoadShippingUnitId}
                    </Typography>
                    <Typography variant={'h3'} className={'lbs'}>
                        {data.Weight} {data.WeightUnits}
                    </Typography>
                    <Typography variant={'overline'}>
                        {data.items.length} Items
                    </Typography>
                    <Typography variant={'overline'}>
                        {data.Length} x {data.Width} x {data.Height}{' '}
                        {data.DimUnits}
                    </Typography>
                </StyledSummary>
            </StyledAccordionSummary>
            <AccordionDetails>
                {data.items.map(i => (
                    <SingleShippingUnitItem
                        correspondingItem={
                            correspondingDetails.filter(
                                d => d.ItemNbr === i.ItemNbr
                            )[0]
                        }
                        key={i.PlanLoadShippingUnitDetailId}
                        item={i}
                    />
                ))}
            </AccordionDetails>
        </StyledAccordion>
    )
}

SingleShippingUnit.propTypes = {}

export default SingleShippingUnit
