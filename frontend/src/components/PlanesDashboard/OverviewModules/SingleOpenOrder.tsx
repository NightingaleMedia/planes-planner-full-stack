import { OpenPos } from 'pages/api/purchase-orders/open'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
} from '@material-ui/core'

import DateParse from 'src/components/Assets/DateParse'
import {
    LocalShipping,
    LocalShippingRounded,
    RemoveRedEye,
    Share,
} from '@material-ui/icons'
import { deepPurple } from '@material-ui/core/colors'
import { PoStatus } from '../PODetail'

const StyledOrder = styled(Card)`
    background-color: #591beb;
    color: white;
    min-height: 200px;
    border-radius: 6px;
    min-width: 250px;
    transition: all 0.2s ease;
    margin-left: 1rem;
    margin-bottom: 1rem;

    && .MuiCardHeader-subheader,
    && .MuiTypography-h3 {
        color: white;
    }

    && .MuiCardActions-root button {
        color: white;
    }

    &&.inprogress {
        color: ${props => props.theme.palette.info.main};
        border: 2px solid ${props => props.theme.palette.info.main};
        background-color: white;
        && .MuiCardHeader-subheader,
        && .MuiTypography-h3 {
            color: ${props => props.theme.palette.info.main};
        }
        && .MuiCardActions-root button {
            color: ${props => props.theme.palette.info.main};
        }
    }
    &&:hover {
        background-color: ${deepPurple[400]};
        cursor: pointer;
    }
`

const StyledCardContent = styled(CardContent)``
const SingleOpenOrder = ({ data }: { data: OpenPos }) => {
    const router = useRouter()
    return (
        <StyledOrder
            className={data.POStatus}
            title={'Click here to load the shipping unit.'}
            onClick={() => {
                router.push(`/shipping-units/${data.PurchaseOrderId}`)
            }}
        >
            <CardHeader
                title={data.BusinessUnit + ' ' + data.PurchaseOrderNbr}
                subheader={
                    <Box sx={{ mt: 1 }}>
                        <PoStatus
                            planLoadId={data.PlanLoadId}
                            purchaseOrderId={data.PurchaseOrderId}
                        />
                    </Box>
                }
            />
            <StyledCardContent>
                <div>
                    Due: <DateParse>{data.PurchaseOrderDueDate}</DateParse>
                </div>
                <div>{data?.numItems || 'Unknown # of'} Items</div>
            </StyledCardContent>
            <CardActions>
                <IconButton aria-label="share">
                    <LocalShippingRounded color="inherit" />
                </IconButton>
                <IconButton aria-label="share">
                    <RemoveRedEye color="inherit" />
                </IconButton>
            </CardActions>
        </StyledOrder>
    )
}

export default SingleOpenOrder
