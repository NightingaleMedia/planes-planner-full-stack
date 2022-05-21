import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    Select,
    TextField,
} from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'

import { StyledDialog, StyledForm } from '../Styles/Modal__Styles'
import useAuth from 'src/hooks/useAuth'
import { createUserQuery } from 'src/hooks/adminQueries'
import { UserEditContext } from 'src/contexts/UserEditContext'

import VendorSearch from './VendorSearch'

const AddUser__Modal = (): any => {
    const { user } = useAuth()

    const { state, closeCreate } = useContext(UserEditContext)
    let ROLES = [
        { name: 'Vendor User', value: 'VENDORUSER' },
        { name: 'Vendor Admin', value: 'VENDORADMIN' },
    ]

    if (user.role === 'SUPERADMIN') {
        ROLES = [...ROLES, { name: 'Super User', value: 'SUPERADMIN' }]
    }

    const [formValues, setFormValues] = useState<any>({
        firstName: '',
        lastName: '',
        email: '',
        role: 'VENDORUSER',
        password: '',
        vendorId: user.company,
        sendEmail: true,
    })

    const [formState, setFormState] = useState({ loading: false, errors: [] })

    const { creating, createUser } = createUserQuery()

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
        setFormState(prev => ({
            ...prev,
            loading: true,
        }))
        try {
            const user: any = await createUser(formValues)
            closeCreate()
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
                <CardHeader title={'Add A User'} />
                <CardContent>
                    <StyledForm className={formState.loading ? 'loading' : ''}>
                        <div className="errors">
                            {formState.errors.map((err, index) => (
                                <div key={index}>{err}</div>
                            ))}
                        </div>

                        <TextField
                            label="First Name"
                            name="firstName"
                            onChange={handleChange}
                            value={formValues.firstName}
                            variant="outlined"
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            onChange={handleChange}
                            value={formValues.lastName}
                            variant="outlined"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            onChange={handleChange}
                            value={formValues.email}
                            variant="outlined"
                        />
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Send Email Confirmation"
                                onChange={(e: any) =>
                                    setFormValues(prev => ({
                                        ...prev,
                                        sendEmail: e.target.checked,
                                    }))
                                }
                                name="sendEmail"
                            />
                        </FormGroup>
                        {user.role === 'SUPERADMIN' && (
                            <VendorSearch
                                sendValue={(value: string) => {
                                    if (value) {
                                        const target = {
                                            value,
                                            name: 'vendorId',
                                        }
                                        handleChange({ target })
                                    }
                                }}
                            />
                        )}
                        <TextField
                            label="Password"
                            disabled
                            name="password"
                            onChange={handleChange}
                            value={formValues.password}
                            variant="outlined"
                            helperText={'Password will be auto-generated'}
                        />

                        <FormControl variant={'outlined'}>
                            <InputLabel id={'Packaging'}>Role</InputLabel>
                            <Select
                                native
                                labelId="Packaging"
                                variant={'outlined'}
                                label="Role"
                                name={'role'}
                                onChange={handleChange}
                                value={formValues.role}
                            >
                                {ROLES.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

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

export default AddUser__Modal
