import {
    Alert,
    Button,
    Card,
    CardHeader,
    CardContent,
    LinearProgress,
    Typography,
} from '@material-ui/core'
import { SupervisedUserCircleSharp } from '@material-ui/icons'
import styled from '@emotion/styled'
import { FetchApi } from 'lib/fetchApi'
import router from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import wait from 'utils/wait'
import {
    StyledButtonArea,
    FinalizeDialog,
    StyledSteps,
    StyledCardContent,
} from '../Styles/Modal__Styles'

const panels = {
    finalize: {
        displayName: 'Finalize This Shipment?',
        text:
            'This action is not reversible.  Please make sure your shipment is ready to go.',
        loading: false,
    },
    units: {
        displayName: 'Checking The Units',
        subtitle: 'Checking all the shipping units...',
        loading: true,
    },
    unitErrors: {
        displayName: 'Oops, there was a problem.',
        subtitle: 'Please fix these and try again',
        loading: false,
    },
    items: {
        displayName: 'Checking The Items',
        subtitle: 'Checking line items.',
        text: 'Checking the line items...',
        loading: true,
    },
    shortShip: {
        name: '3',
        displayName: 'Short Ship This Unit?',
        text:
            'Short Shipping will create another plan load where you can add the rest of the items.',
        loading: false,
    },
    finalizing: {
        name: '3',
        displayName: 'Finalizing',
        text: 'Finalizing this unit and sending it to the Planes team...',
        loading: true,
    },
    finalized: {
        name: '3',
        displayName: 'Finalized!',
        text: (
            <>
                <SupervisedUserCircleSharp
                    sx={{
                        fontSize: '5rem',
                        display: 'block',
                        margin: '0 auto 2rem',
                    }}
                />
                Congratulations, you have shipped this unit off to be processed
            </>
        ),
        loading: false,
    },
}

type FinalizeModal__Props = {
    open: boolean
    setOpen: (v: boolean) => void
    planLoadId: string | number
    purchaseOrderId: string | number
}

type FormSteps = {
    handleSubmit?: () => void
    handleClose?: () => void
    handleCancel?: () => void
}
const Finalize__Modal = ({
    open,
    setOpen,
    planLoadId,
    purchaseOrderId,
}: FinalizeModal__Props): any => {
    const [formState, setFormState] = useState({
        panel: 'finalize',
        loading: false,
        errors: [],
    })

    const setPanel = (name, other = null) => {
        setFormState(prev => ({
            ...prev,
            panel: name,
            ...other,
        }))
    }
    const handleStartProcess = async () => {
        // finalize units
        setPanel('units')
        await wait(1200)

        await FetchApi({
            path: `/purchase-orders/${purchaseOrderId}/finalize-units?planLoadId=${planLoadId}`,
        })
            .then(async res => {
                checkItems()
            })
            .catch(err => {
                const errors = []
                err.forEach(unit => {
                    const err = unit.errors.map(
                        e =>
                            `${unit.Packaging} ${unit.PlanLoadShippingUnitId}: ${e}`
                    )
                    errors.push(...err)
                })
                console.log(errors)

                return setPanel('unitErrors', { errors })
            })
    }

    async function checkItems() {
        setPanel('items')
        await wait(2000)
        await FetchApi({
            path: `/purchase-orders/${purchaseOrderId}/finalize-items?planLoadId=${planLoadId}`,
        })
            .then(res => {
                return handleFinalize()
            })
            .catch(err => {
                return setPanel('shortShip', { errors: [err.message] })
            })
    }

    async function handleFinalize() {
        setPanel('finalizing', { errors: [] })

        await FetchApi({
            options: {
                method: 'PUT',
            },
            path: `/purchase-orders/${purchaseOrderId}/finalize?planLoadId=${planLoadId}`,
        })
            .then(async () => {
                await wait(1000)
                setPanel('finalized')
            })
            .catch(err => {
                return setPanel('unitErrors', { errors: [err.message] })
            })
    }

    const handleClose = () => {
        if (formState.panel !== 'finalize') {
            return toast.error(
                'You cannot close this window until the script is complete.'
            )
        }
        setOpen(false)
    }

    const cancelScript = () => {
        setFormState({ panel: 'finalize', loading: false, errors: [] })
        setOpen(false)
    }

    const handleFinalizeConfirm = () => {
        cancelScript()
        router.push(`/orders/${purchaseOrderId}`)
    }

    return (
        <FinalizeDialog open={open} onClose={handleClose}>
            {panels[formState.panel].loading && <LinearProgress />}
            <Card>
                <CardHeader
                    title={panels[formState.panel].displayName}
                    subheader={
                        <Typography variant={'overline'}>
                            {panels[formState.panel].subtitle || ' '}
                        </Typography>
                    }
                />

                <StyledCardContent>
                    <StyledSteps>
                        {formState.panel !== 'finalized' &&
                            Array.from(Array(5)).map((a, i) => {
                                const isThis =
                                    Object.keys(panels).indexOf(
                                        formState.panel
                                    ) === i
                                return (
                                    <div
                                        className={`step ${
                                            isThis ? 'current' : ''
                                        }`}
                                        key={i}
                                    ></div>
                                )
                            })}
                    </StyledSteps>
                    {formState.errors.length > 0 &&
                        formState.errors.map((e, i) => (
                            <Alert
                                severity={'error'}
                                key={i}
                                style={{
                                    marginBottom: '10px',
                                }}
                            >
                                {e}
                            </Alert>
                        ))}
                    <Typography variant={'body1'} component={'div'}>
                        {panels[formState.panel].text}
                    </Typography>

                    {
                        {
                            finalize: (
                                <Submit
                                    handleClose={handleClose}
                                    handleSubmit={handleStartProcess}
                                />
                            ),
                            units: <CheckUnit handleCancel={cancelScript} />,
                            unitErrors: (
                                <UnitErrors handleClose={cancelScript} />
                            ),
                            shortShip: (
                                <ShortShip
                                    handleCancel={cancelScript}
                                    handleSubmit={handleFinalize}
                                />
                            ),
                            finalized: (
                                <Success handleSubmit={handleFinalizeConfirm} />
                            ),
                        }[formState.panel]
                    }
                </StyledCardContent>
            </Card>
        </FinalizeDialog>
    )
}
const Submit = ({ handleSubmit, handleClose }: FormSteps) => (
    <>
        <StyledButtonArea>
            <Button variant={'contained'} onClick={handleSubmit}>
                Yes
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
        </StyledButtonArea>
    </>
)

const CheckUnit = ({ handleCancel }: FormSteps) => (
    <>
        <StyledButtonArea>
            <Button onClick={handleCancel}>Cancel</Button>
        </StyledButtonArea>
    </>
)
const ShortShip = ({ handleSubmit, handleCancel }: FormSteps) => (
    <StyledButtonArea>
        <Button variant={'contained'} onClick={handleSubmit}>
            Yes
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
    </StyledButtonArea>
)

const UnitErrors = ({ handleClose }: FormSteps) => (
    <StyledButtonArea>
        <Button onClick={handleClose}>Close</Button>
    </StyledButtonArea>
)
const Success = ({ handleSubmit }: FormSteps) => (
    <>
        <StyledButtonArea>
            <Button
                onClick={handleSubmit}
                color={'secondary'}
                variant="contained"
            >
                Close
            </Button>
        </StyledButtonArea>
    </>
)

export default Finalize__Modal
