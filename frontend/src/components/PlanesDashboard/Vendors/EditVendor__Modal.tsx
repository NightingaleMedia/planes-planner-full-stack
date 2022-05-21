import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography,
} from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'

import toast from 'react-hot-toast'
import { StyledDialog, StyledForm } from '../Styles/Modal__Styles'
import { FetchAdmin } from 'lib/auth/FetchAdmin'
import { VendorEditContext } from 'src/contexts/VendorEditContext'

const EditVendor__Modal = (): any => {
    const { state, closeEdit } = useContext(VendorEditContext)
    const [formValues, setFormValues] = useState({
        id: '',
        VendorId: 0,
        VendorLongName: '',
        VendorName: '',
    })

    const [formState, setFormState] = useState({ loading: false, errors: null })

    useEffect(() => {
        if (state.vendorToModify) {
            setFormValues(state.vendorToModify)
        }
    }, [state.vendorToModify])

    const handleChange = e => {
        const value = e.target.value
        const name = e.target.name

        setFormValues(prev => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleSubmit = async () => {
        setFormState({ loading: true, errors: null })
        delete formValues.id
        await FetchAdmin({
            path: `/vendor/${state.vendorToModify.id}`,
            options: {
                method: 'PUT',
                body: JSON.stringify(formValues),
            },
        })
            .then((res: any) => {
                toast.success(res.message)
                handleClose()
            })
            .catch(err => {
                toast.error(err.message)
                setFormState({ loading: false, errors: err.message })
            })
    }

    const handleClose = () => {
        setFormState(prev => ({
            ...prev,
            loading: false,
        }))
        closeEdit()
    }

    return (
        <StyledDialog open={state.editOpen}>
            <Card>
                <CardHeader
                    title={`Edit ${state.vendorToModify?.vendorName} `}
                    subheader={
                        <Typography variant={'overline'}>
                            ID: {state.vendorToModify?.id}
                        </Typography>
                    }
                />
                <CardContent>
                    <StyledForm className={formState.loading ? 'loading' : ''}>
                        <div className="errors">
                            {formState.errors && <div>{formState.errors}</div>}
                        </div>

                        <TextField
                            label="Vendor Name"
                            name="vendorName"
                            onChange={handleChange}
                            value={formValues.VendorName}
                            variant="outlined"
                        />
                        <TextField
                            label="Vendor Long Name"
                            name="vendorLongName"
                            onChange={handleChange}
                            value={formValues.VendorLongName}
                            variant="outlined"
                        />
                        <TextField
                            label="Vendor ID"
                            name="vendorId"
                            onChange={handleChange}
                            value={formValues.VendorId}
                            variant="outlined"
                        />
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
            </Card>
        </StyledDialog>
    )
}

export default EditVendor__Modal
