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
} from '@material-ui/core'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { DualSelector } from 'src/atoms'
import { PACKAGE_TYPES, UNITS, WEIGHTS } from 'src/constants'
import { FetchApi } from 'lib/fetchApi'
import { StyledDialog, StyledForm } from '../Styles/Modal__Styles'

const StyledEditUnitWrap = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 20px;
    background-color: ${props => props.theme.palette.background.default};
    padding: 12px;
    margin: -12px;
    border-radius: 8px;
    margin-bottom: 2rem;
    && .MuiFormControl-root.weight {
        grid-column: 1/3;
    }
    && .MuiTextField-root {
        width: 100%;
        background-color: #f7f7f7;
    }
`
type EditShippingUnit__Props = {
    open: boolean
    setOpen: (v: boolean) => void
    shipUnitDetails: any
    onEdit: () => void
}

export const EditShippingUnit__Modal = ({
    open,
    setOpen,
    shipUnitDetails,
    onEdit,
}: EditShippingUnit__Props): any => {
    const [formState, setFormState] = useState({ loading: false, errors: [] })

    const [formValues, setFormValues] = useState({
        Packaging: shipUnitDetails.Packaging,
        Weight: shipUnitDetails.Weight,
        WeightUnits: shipUnitDetails.WeightUnits,
        Length: shipUnitDetails.Length,
        Width: shipUnitDetails.Width,
        Height: shipUnitDetails.Height,
        DimUnits: shipUnitDetails.DimUnits,
        LicensePlateNbr: shipUnitDetails.LicensePlateNbr,
    })

    useEffect(() => {
        setFormValues({
            Packaging: shipUnitDetails.Packaging,
            Weight: shipUnitDetails.Weight,
            WeightUnits: shipUnitDetails.WeightUnits,
            Length: shipUnitDetails.Length,
            Width: shipUnitDetails.Width,
            Height: shipUnitDetails.Height,
            DimUnits: shipUnitDetails.DimUnits,
            LicensePlateNbr: shipUnitDetails.LicensePlateNbr,
        })
    }, [shipUnitDetails, open])

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = async () => {
        setFormState(prev => ({ ...prev, loading: true }))

        await FetchApi({
            path: '/shipping-units',
            options: {
                method: 'PUT',
                body: JSON.stringify({
                    planLoadShippingUnitId:
                        shipUnitDetails.PlanLoadShippingUnitId,
                    values: formValues,
                }),
            },
        })
            .catch(err => {
                err = JSON.parse(err)
                return toast.error(err.message)
            })
            .then(result => {
                toast.success(
                    'Edited! Please allow a few seconds to see the change'
                )
            })
            .finally(() => {
                setFormState(prev => ({ ...prev, loading: false }))
                handleClose()
                onEdit()
            })
    }

    const handleChange = e => {
        const { value, name } = e.target
        if (
            ['Length', 'Width', 'Height', 'Weight'].includes(name) &&
            isNaN(value)
        ) {
            return toast.error('Numbers Only!')
        }

        setFormValues(prev => ({ ...prev, [name]: value }))
    }

    return (
        <StyledDialog open={open}>
            <Card sx={{ px: 0 }}>
                <div>
                    <CardHeader title={'Edit Shipping Unit Details'} />
                    <CardContent>
                        <StyledForm
                            className={formState.loading ? 'loading' : ''}
                        >
                            <div className="errors">
                                {formState.errors.map((err, index) => (
                                    <div key={index}>{err}</div>
                                ))}
                            </div>

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
                                        <option key={key} value={key}>
                                            {PACKAGE_TYPES[key]}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                variant={'outlined'}
                                label="License Plate #"
                                name="LicensePlateNbr"
                                onChange={handleChange}
                                value={formValues.LicensePlateNbr}
                            ></TextField>

                            <StyledEditUnitWrap>
                                <TextField
                                    className="weight"
                                    id="weight"
                                    variant={'outlined'}
                                    label="Weight"
                                    name="Weight"
                                    onChange={handleChange}
                                    value={formValues.Weight}
                                ></TextField>
                                <DualSelector
                                    onChangeValue={({ value }) =>
                                        setFormValues(prev => ({
                                            ...prev,
                                            WeightUnits: value,
                                        }))
                                    }
                                    initial={WEIGHTS.findIndex(
                                        w => w.value === formValues.WeightUnits
                                    )}
                                    title={'Weight Units'}
                                    options={WEIGHTS}
                                />
                                <div
                                    style={{ gridColumn: '1/3', width: '100%' }}
                                >
                                    {['Length', 'Width', 'Height'].map(u => (
                                        <TextField
                                            size="small"
                                            id={u}
                                            key={u}
                                            variant={'outlined'}
                                            label={u}
                                            onChange={handleChange}
                                            name={u}
                                            value={formValues[u]}
                                            sx={{ margin: '5px 0' }}
                                        />
                                    ))}
                                </div>
                                <DualSelector
                                    title={'Measurement'}
                                    onChangeValue={({ value }) =>
                                        setFormValues(prev => ({
                                            ...prev,
                                            DimUnits: value,
                                        }))
                                    }
                                    initial={UNITS.findIndex(
                                        w => w.value === formValues.DimUnits
                                    )}
                                    options={UNITS}
                                />
                            </StyledEditUnitWrap>

                            <div className="button-area">
                                <Button
                                    variant={'contained'}
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                                <Button onClick={handleClose}>Cancel</Button>
                            </div>
                        </StyledForm>
                    </CardContent>
                </div>
            </Card>
        </StyledDialog>
    )
}

export default EditShippingUnit__Modal
