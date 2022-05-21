import React, {
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import styled from '@emotion/styled'
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
    FormControl,
    IconButton,
    Input,
    LinearProgress,
    TextField,
    Typography,
} from '@material-ui/core'
import {
    AddCircleOutlineSharp,
    Close,
    ExitToAppOutlined,
    Remove,
    TryRounded,
} from '@material-ui/icons'
import toast, { useToasterStore } from 'react-hot-toast'
import { QuantityEdit } from '../PrepareItems/SingleLineItem'
import { AddSubtract } from '../Styles/LineItem__Styles'
import { classx } from './ShippingUnitLineItem'

const StyledWrap = styled.div`
    width: 100%;
    margin: auto;
    align-items: center;
    gap: 3px;
    display: grid;
    grid-template-columns: auto 50px auto;
`

const QuanDialog = styled(Dialog)`
    && .MuiPaper-root {
        max-width: 300px;
        min-height: 300px;
    }
`

const QuanHolder = styled.input`
    background-color: #fff;
    padding: 3px;
    border-radius: 8px;
    font-size: 1rem;
    padding: 10px;
    text-align: center;
    border: none;
    outline: none;
`

const QuanCard = styled(Card)`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    && .MuiFormControl-root {
        margin: 0.5rem;
    }
    && .MuiOutlinedInput-root input {
        font-size: 1.5rem;
        text-align: center;
        padding: 5px;
    }
    && .MuiButton-root {
        width: 100%;
        margin: 0.5rem auto;
    }
    && .MuiButton-root.submit {
        background-color: ${props => props.theme.palette.info.main};
        color: white;
    }
    && .MuiButton-root.cancel {
        background-color: ${props => props.theme.palette.grey[300]};
        color: black;
    }
`

const StyledMetaData = styled.div`
    display: grid;
    grid-template-columns: 70% 30%;
    width: 100%;
    margin: 5%;
    padding: 20px;
    background-color: ${props => props.theme.palette.background.default};
    margin: auto;
    border-radius: 6px;
    && > div.value {
        text-align: right;
        font-weight: 600;
    }
`

const initial: QuantityEdit = {
    amtOnUnit: 0,
    numberToAdd: 0,
    remaining: 0,
}
type QuantityHandler = {
    quantityEdit?: QuantityEdit
    qty: number
    onAdd: () => any
    onCancel: () => void
    onSubtract: () => any
    onChangeValue: (v: number | string) => any
    canOpen: {
        challenge: boolean
        message: string
    }
}

const QuantityHandler = ({
    qty,
    onAdd,
    onSubtract,
    onChangeValue,
    onCancel,
    quantityEdit,
    canOpen,
    ...rest
}: QuantityHandler): any => {
    if (!quantityEdit) {
        return <LinearProgress />
    }
    const { numberToAdd, amtOnUnit, remaining } = quantityEdit
    const [quanInputOpen, setQuanInputOpen] = React.useState(false)

    const [manualQuantity, setManualQuantity] = React.useState(amtOnUnit)

    const quantityRef = useRef<HTMLInputElement>()
    const maxToAdd = useRef(remaining).current

    // const numberToAdd = useMemo(() => quantityEdit.numberToAdd, [quanInputOpen])

    useEffect(() => {
        if (quanInputOpen && quantityRef.current) {
            console.log('adding focus')
            quantityRef.current.focus()
        } else if (!quanInputOpen) {
            setManualQuantity(amtOnUnit)
        }
    }, [quanInputOpen])

    const { toasts } = useToasterStore()

    const incDec = value => {
        // prettier-ignore
        if ((manualQuantity + value - amtOnUnit) > (maxToAdd) || (manualQuantity + value) < 0 ) {
            return toast.error('Invalid value', { id: 'quantity' })
        }
        if (value === -1) {
            setManualQuantity(prev => prev - 1)
        }
        if (value === 1) {
            setManualQuantity(prev => prev + 1)
        }
    }
    const handleChange = e => {
        const { name, value } = e.target
        if (isNaN(Number(value))) {
            return toast.error('Numbers Only')
        }
        // if (value > maxToAdd) {
        //     return toast.error('Max to add: ' + maxToAdd, { id: 'quantity' })
        else setManualQuantity(value)
    }

    const addMax = () => {
        if (maxToAdd < 1) {
            toast.error('No more to add!')
        } else {
            setManualQuantity(amtOnUnit + maxToAdd)
        }
        // setManualQuantity(maxToAdd)
    }

    const handleSubmit = () => {
        // return console.log(manualQuantity)
        if (manualQuantity - amtOnUnit > maxToAdd) {
            return toast.error('Max Value: ' + (maxToAdd + amtOnUnit), {
                id: 'quantity',
            })
        } else {
            onChangeValue(manualQuantity - amtOnUnit)
            setQuanInputOpen(false)
        }
    }
    const handleOpenModal = () => {
        if (canOpen.challenge) {
            setQuanInputOpen(true)
        } else {
            toast.error(canOpen.message)
        }
    }

    const handleOnCancel = () => {
        setManualQuantity(amtOnUnit)
        setQuanInputOpen(false)
        onCancel()
    }

    return (
        <>
            <StyledWrap {...rest}>
                <IconButton size={'small'} onClick={onSubtract}>
                    <Remove />
                </IconButton>
                <QuanHolder
                    readOnly
                    value={numberToAdd + amtOnUnit}
                    onClick={handleOpenModal}
                ></QuanHolder>

                <IconButton size={'small'} onClick={onAdd}>
                    <AddCircleOutlineSharp />
                </IconButton>
            </StyledWrap>

            <QuanDialog
                open={quanInputOpen}
                onClose={() => setQuanInputOpen(false)}
            >
                <QuanCard title={'Add Quantity'}>
                    <CardHeader
                        // title="Add Quantity"
                        subheader={
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant={'h6'}
                                    sx={{ display: 'inline', mr: 3 }}
                                >
                                    Quantity
                                </Typography>
                            </div>
                        }
                    />
                    <StyledMetaData>
                        <div>Amount on This Unit: </div>
                        <div className="value">{amtOnUnit}</div>
                        <div>Max To Add: </div>
                        <div className="value">{remaining + amtOnUnit}</div>
                        <div>Change</div>
                        <div className="value">
                            {' '}
                            <AddSubtract
                                className={`${classx(
                                    manualQuantity - amtOnUnit
                                )}`}
                                style={{
                                    paddingTop: '5px',
                                }}
                            >
                                {manualQuantity - amtOnUnit}
                            </AddSubtract>{' '}
                        </div>
                    </StyledMetaData>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            maxWidth: '80%',
                        }}
                    >
                        <div>
                            <IconButton
                                size={'medium'}
                                onClick={() => incDec(-1)}
                            >
                                <Remove />
                            </IconButton>
                        </div>

                        <TextField
                            ref={quantityRef}
                            autoFocus={true}
                            id={'quantity'}
                            value={manualQuantity}
                            onChange={handleChange}
                            error={
                                toasts.filter(t => t.id === 'quantity').length >
                                0
                            }
                            // onClick={() => setManualQuantityOpen(true)}
                        />

                        <div>
                            <IconButton
                                size={'medium'}
                                onClick={() => incDec(1)}
                            >
                                <AddCircleOutlineSharp />
                            </IconButton>
                        </div>
                    </div>
                    <Button className="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button
                        className="cancel"
                        variant={'contained'}
                        color={'secondary'}
                        onClick={handleOnCancel}
                    >
                        Cancel
                    </Button>
                </QuanCard>
            </QuanDialog>
        </>
    )
}

export default QuantityHandler
