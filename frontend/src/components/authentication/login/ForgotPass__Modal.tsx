import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    CardHeader,
    LinearProgress,
    TextField,
} from '@material-ui/core'
import { FetchAdmin } from 'lib/auth/FetchAdmin'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
    StyledDialog,
    StyledForm,
} from '../../../components/PlanesDashboard/Styles/Modal__Styles'
import { matchEmail } from '../../../../utils/matchEmail'
type ForgotPass__Modal__Props = {
    open: boolean
    setOpen: (v: boolean) => void
}
const ForgotPass__Modal = ({
    open,
    setOpen,
}: ForgotPass__Modal__Props): any => {
    const [formValues, setFormValues] = useState<any>({
        email: '',
    })

    const [formState, setFormState] = useState({ loading: false })

    const handleChange = e => {
        const { name, value } = e.target
        setFormValues(prev => ({ ...prev, [name]: value }))
    }

    const handleClose = () => {
        setFormState({ loading: false })
        setFormValues({ email: '' })
        setOpen(false)
    }

    const handleSubmit = async () => {
        setFormState({ loading: true })
        if (!matchEmail(formValues.email)) {
            return toast.error('Invalid Format!')
        }
        await FetchAdmin({
            path: '/auth/forgot-password',
            options: {
                method: 'POST',
                body: JSON.stringify({ email: formValues.email }),
            },
        }).then(res => {
            toast.success(
                'If that email exists, we have sent a new password.  If you do not recieve one, please contact a planes administrator',
                {
                    duration: 10000,
                }
            )
            setFormState({ loading: false })
            handleClose()
        })
    }

    return (
        <StyledDialog open={open}>
            <Card>
                {formState.loading && <LinearProgress />}
                <CardHeader title={'Forgot Password'} />
                <CardContent>
                    <StyledForm className={formState.loading ? 'loading' : ''}>
                        <TextField
                            label="Email"
                            name="email"
                            onChange={handleChange}
                            value={formValues.email}
                            variant="outlined"
                            helperText="If we find a user for this email we will email you a new password."
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

export default ForgotPass__Modal
