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
import { FetchAdmin } from 'lib/auth/FetchAdmin'
import useAdminQuery from 'src/hooks/useAdminQuery'
import { VendorEditContext } from 'src/contexts/VendorEditContext'

const DeleteVendor__Modal = (): any => {
    const { state, closeDelete } = useContext(VendorEditContext)
    const [formState, setFormState] = useState({ loading: false, errors: null })

    const { mutate } = useAdminQuery({
        path: '/vendor',
    })

    // TODO set this up on backend
    const handleSubmit = async () => {
        setFormState({ loading: true, errors: null })
        await FetchAdmin({
            path: `/vendor/${state.vendorToModify.VendorId}`,
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
                    title={`${state.vendorToModify?.VendorName}`}
                    subheader={
                        <>
                            <Typography variant={'overline'}>
                                Vendor ID: {state.vendorToModify?.VendorId}
                            </Typography>
                            <br />
                            <Typography variant={'overline'}>
                                Vendor Code: {state.vendorToModify?.VendorCode}
                            </Typography>
                        </>
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
                            color={'error'}
                            onClick={handleSubmit}
                        >
                            Delete
                        </Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </div>
                </CardContent>
            </Card>
        </StyledDialog>
    )
}

export default DeleteVendor__Modal
