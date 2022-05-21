import Link from 'next/link'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    Select,
    TextField,
    Typography,
} from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { StyledDialog, StyledForm } from '../Styles/Modal__Styles'
import useAuth from 'src/hooks/useAuth'
import { UserEditContext } from 'src/contexts/UserEditContext'
import { FetchAdmin } from 'lib/auth/FetchAdmin'

const EditUser__Modal = (): any => {
    const { user } = useAuth()
    const { state, closeEdit, loading } = useContext(UserEditContext)

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
        role: '',
        password: '',
    })

    const [formState, setFormState] = useState({ loading: false, errors: null })

    useEffect(() => {
        if (state.userToModify) {
            setFormValues(state.userToModify)
        }
    }, [state.userToModify])

    const handleChange = e => {
        const value = e.target.value
        const name = e.target.name

        setFormValues(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    // useEffect(() => {
    //     setFormState((prev) => ({ ...prev, loading: creating }))
    //     return () => setFormState((prev) => ({ ...prev, loading: false }))
    // }, [creating])

    // TODO edit vendor
    const handleSubmit = async () => {
        setFormState({ loading: true, errors: null })
        await FetchAdmin({
            path: `/admin/users/${state.userToModify.id}`,
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
                    title={`Edit ${state.userToModify?.firstName} ${state.userToModify?.lastName}`}
                    subheader={
                        <Typography variant={'overline'}>
                            ID: {state.userToModify?.id}
                        </Typography>
                    }
                />
                <CardContent>
                    <StyledForm className={formState.loading ? 'loading' : ''}>
                        <div className="errors">
                            {formState.errors && <div>{formState.errors}</div>}
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
                        <TextField
                            label="Password"
                            name="password"
                            onChange={handleChange}
                            value={formValues.password}
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

export default EditUser__Modal
