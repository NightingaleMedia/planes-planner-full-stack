import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
} from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { StyledDialog, StyledForm } from '../Styles/Modal__Styles'
import useAuth from 'src/hooks/useAuth'
import { VendorEditContext } from 'src/contexts/VendorEditContext'
import createVendorQuery from 'src/hooks/adminQueries/createVendorQuery copy'

type AddVendor__Modal__Props = {
    onCreate: () => void
}

const AddVendor__Modal = ({ onCreate }: AddVendor__Modal__Props): any => {
    const { user } = useAuth()

    const { state, closeCreate } = useContext(VendorEditContext)
    // TODO more elegant
    let ROLES = [
        { name: 'Vendor User', value: 'VENDORUSER' },
        { name: 'Vendor Admin', value: 'VENDORADMIN' },
    ]

    if (user.role === 'SUPERADMIN') {
        ROLES = [...ROLES, { name: 'Super User', value: 'SUPERUSER' }]
    }

    const [formValues, setFormValues] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        role: 'VENDORUSER',
        password: '',
        vendorCode: '',
    })

    const [formState, setFormState] = useState({ loading: false, errors: [] })

    const { creating, createVendor } = createVendorQuery()

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

    // TODO create vendor
    const handleSubmit = async () => {
        try {
            const res = await createVendor(formValues)
            toast.success(res.message)
            onCreate()
            handleClose()
        } catch (error) {
            setFormState(prev => ({
                loading: false,
                errors: [error.message],
            }))
        }
    }

    const handleClose = () => {
        setFormState(prev => ({
            ...prev,
            loading: false,
        }))
        closeCreate()
    }

    return (
        <StyledDialog open={state.createOpen}>
            <Card>
                <CardHeader title={'Add A Vendor'} />
                <CardContent>
                    <StyledForm className={formState.loading ? 'loading' : ''}>
                        <div className="errors">
                            {formState.errors.map((err, index) => (
                                <div key={index}>{err}</div>
                            ))}
                        </div>

                        <TextField
                            label="Vendor Name"
                            name="vendorName"
                            onChange={handleChange}
                            value={formValues.vendorName}
                            variant="outlined"
                        />
                        <TextField
                            label="Long Name (Optional)"
                            name="vendorLongName"
                            onChange={handleChange}
                            value={formValues.vendorLongName}
                            variant="outlined"
                        />

                        <TextField
                            label="Vendor Code"
                            name="vendorCode"
                            onChange={handleChange}
                            value={formValues.vendorCode}
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

export default AddVendor__Modal
