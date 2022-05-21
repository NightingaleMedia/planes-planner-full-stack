import { ShipUnitAndPlanLoad } from 'pages/shipping-units/[purchaseOrderId]'
import PrepareItemsTable from './PrepareItemsTable'
import styled from '@emotion/styled'
import Module from '../Module'
import { Dialog } from '@material-ui/core'

const StyledPrepareCard = styled.div`
    min-height: 500px;
    padding: 1rem;
    @media all and (max-width: 960px) {
        padding: 1%;
    }
`
type PrepareItems__Props = {
    open: boolean
    setOpen: (value: boolean) => void
    unit: ShipUnitAndPlanLoad
}
const PrepareItems__Modal = ({ open, setOpen, unit }: PrepareItems__Props) => {
    return (
        <Dialog open={open} maxWidth={'xl'} onClose={() => setOpen(false)}>
            <Module
                title={
                    'Add Items To ' +
                    unit?.unit?.Packaging +
                    ' ' +
                    unit?.unit?.PlanLoadShippingUnitId
                }
                subtitle={
                    unit?.planLoad?.LoadName +
                    ' ' +
                    unit?.planLoad?.BusinessUnit +
                    ' ' +
                    unit?.planLoad?.PurchaseOrderNbr
                }
                actions={[
                    {
                        name: 'Close',
                        onClick: () => setOpen(false),
                    },
                ]}
            >
                <StyledPrepareCard>
                    {unit && (
                        <PrepareItemsTable
                            handleCloseModal={() => setOpen(false)}
                            shippingUnitWithItems={unit.unit}
                            purchaseOrderId={unit?.planLoad?.PurchaseOrderId}
                        />
                    )}
                </StyledPrepareCard>
            </Module>
        </Dialog>
    )
}

PrepareItems__Modal.propTypes = {}

export default PrepareItems__Modal
