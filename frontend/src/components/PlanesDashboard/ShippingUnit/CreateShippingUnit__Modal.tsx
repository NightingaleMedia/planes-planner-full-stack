import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Input,
    InputLabel,
    Select,
    TextField,
    Typography,
} from '@material-ui/core'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { PACKAGE_TYPES, UNITS, WEIGHTS } from 'src/constants'
import { DualSelector } from 'src/atoms'
import toast from 'react-hot-toast'
import { StyledDialog, StyledForm } from '../Styles/Modal__Styles'
import { createShippingUnitQuery } from 'src/hooks/queries'

export const StyledWeightAndMeasure = styled(FormControl)`
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 0.5rem));
    gap: 1rem;
    @media all and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`

// TODO types

type CreateShippingUnit__Props = {
    open: boolean
    setOpen: (x: boolean) => void
    planLoadId: string | number
    onCreate: (id: number) => void
}

const CreateShippingUnit__Modal = ({
    open,
    setOpen,
    planLoadId,
    onCreate,
}: CreateShippingUnit__Props): any => {
    const [formValues, setFormValues] = useState<any>({
        LicensePlateNbr: null,
        Weight: '0',
        WeightUnits: 'LBS',
        DimUnits: 'IN',
        Length: '0',
        Width: '0',
        Height: '0',
        Packaging: 'Pallet',
    })

    const [formState, setFormState] = useState({ loading: false, errors: [] })

    const { creating, createUnit } = createShippingUnitQuery()

    const handleChange = e => {
        const value = e.target.value
        const name = e.target.name

        setFormValues(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    useEffect(() => {
        setFormState(prev => ({ ...prev, loading: creating }))
        return () => setFormState(prev => ({ ...prev, loading: false }))
    }, [creating])

    const handleSubmit = async () => {
        await createUnit({ PlanLoadId: planLoadId, ...formValues })
            .then(res => {
                setFormState({ loading: false, errors: [] })
                onCreate(res.shippingUnit.PlanLoadShippingUnitId)
                setOpen(false)
            })
            .catch(err => {
                return setFormState({
                    loading: false,
                    errors: [err.message],
                })
            })
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <StyledDialog open={open}>
            <Card>
                <CardHeader
                    title={'Add a Shipping Unit'}
                    subheader={`Plan Load ID: ${
                        planLoadId ? planLoadId : 'Loading...'
                    }`}
                />
                <CardContent>
                    <StyledForm className={formState.loading ? 'loading' : ''}>
                        <div className="errors">
                            {formState.errors.map((err, index) => (
                                <div key={index}>{err}</div>
                            ))}
                        </div>
                        <div>
                            <Typography variant={'body2'}>
                                A new shipping unit will initialize with 0
                                weight and 0 dimensions, you can edit this as
                                you load out the unit.
                            </Typography>
                        </div>

                        <TextField
                            type="text"
                            label="License Plate #"
                            onChange={({ target }) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    LicensePlateNbr: target.value,
                                }))
                            }}
                        />

                        <StyledWeightAndMeasure>
                            <DualSelector
                                onChangeValue={({ value }) =>
                                    setFormValues(prev => ({
                                        ...prev,
                                        WeightUnits: value,
                                    }))
                                }
                                initial={0}
                                title={'Weight Units'}
                                options={WEIGHTS}
                            />
                            <DualSelector
                                title={'Measurement'}
                                onChangeValue={({ value }) =>
                                    setFormValues(prev => ({
                                        ...prev,
                                        DimUnits: value,
                                    }))
                                }
                                initial={0}
                                options={UNITS}
                            />
                        </StyledWeightAndMeasure>

                        <FormControl variant={'outlined'}>
                            <InputLabel id={'Packaging'}>Type</InputLabel>
                            <Select
                                native
                                labelId="Packaging"
                                variant={'outlined'}
                                label="Packaging"
                                name={'Packaging'}
                                onChange={handleChange}
                                value={formValues.Packaging}
                            >
                                {Object.keys(PACKAGE_TYPES).map(key => (
                                    <option
                                        key={key}
                                        value={PACKAGE_TYPES[key]}
                                    >
                                        {PACKAGE_TYPES[key]}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <div className="button-area">
                            <Button
                                disabled={planLoadId === undefined}
                                variant={'contained'}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                            <Button onClick={handleClose}>Cancel</Button>
                        </div>
                    </StyledForm>
                </CardContent>
            </Card>
        </StyledDialog>
    )
}

export default CreateShippingUnit__Modal
