import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from '@material-ui/core'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { StyledDialog } from '../Styles/Modal__Styles'
import useAuth from 'src/hooks/useAuth'
import { UserEditContext } from 'src/contexts/UserEditContext'
import { FetchAdmin } from 'lib/auth/FetchAdmin'
import useAdminQuery from 'src/hooks/useAdminQuery'

const DeleteUser__Modal = (): any => {
    const { user } = useAuth()

    const { state, closeDelete, loading } = useContext(UserEditContext)
    const [formState, setFormState] = useState({ loading: false, errors: null })

    const { mutate } = useAdminQuery({
        path: '/user',
    })

    // TODO edit vendor
    const handleSubmit = async () => {
        setFormState({ loading: true, errors: null })
        await FetchAdmin({
            path: `/admin/users/${state.userToModify.id}`,
            options: {
                method: 'DELETE',
            },
        })
            .then((res: any) => {
                toast.success(res.message)
                handleClose()
            })
            .catch(err => {
                mutate()
                toast.error(err.message)
                setFormState({ loading: false, errors: err.message })
            })
    }

    const handleClose = () => {
        closeDelete()
    }

    return (
        <StyledDialog open={state.deleteOpen}>
            <Card>
                <CardHeader
                    title={`Delete ${state.userToModify?.firstName} ${state.userToModify?.lastName}`}
                    subheader={
                        <Typography variant={'overline'}>
                            ID: {state.userToModify?.id}
                        </Typography>
                    }
                />
                <CardContent sx={{ minHeight: '250px' }}>
                    {formState.errors && (
                        <p style={{ color: 'red' }}>{formState.errors}</p>
                    )}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            height: '200px',
                        }}
                    >
                        <Button
                            style={{ marginBottom: '1rem' }}
                            variant={'contained'}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </div>
                </CardContent>
            </Card>
        </StyledDialog>
    )
}

export default DeleteUser__Modal
