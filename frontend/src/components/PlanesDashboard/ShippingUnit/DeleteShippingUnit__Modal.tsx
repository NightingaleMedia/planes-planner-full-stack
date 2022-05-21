import { Button, Card, CardHeader, CircularProgress } from '@material-ui/core'
import toast from 'react-hot-toast'
import { useState } from 'react'
import styled from '@emotion/styled'
import { StyledDialog } from '../Styles/Modal__Styles'
import { FetchApi } from 'lib/fetchApi'

const StyledDeleteCard = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 200px;
`
const StyledButtonArea = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    padding-bottom: 1rem;
    && .MuiButton-root {
        margin: 0.5rem;
    }
    && .MuiCircularProgress-root {
        margin: auto;
    }
`

type DeleteShippingUnit__Props = {
    open: boolean
    setOpen: (x: boolean) => void
    shipUnitId: string | number
    onDelete: (id: number | string) => void
}

export const DeleteShippingUnit__Modal = ({
    open,
    setOpen,
    shipUnitId,
    onDelete,
}: DeleteShippingUnit__Props): any => {
    const [formState, setFormState] = useState({ loading: false })

    const handleSubmit = async () => {
        setFormState(() => ({ loading: true }))

        await FetchApi({
            path: `/shipping-units?planLoadShippingUnitId=${shipUnitId}`,
            options: {
                method: 'DELETE',
                body: JSON.stringify({ planLoadShippingUnitId: shipUnitId }),
            },
        })
            .then((res: any) => {
                toast.success(res?.message || 'Success!')
                setOpen(false)
            })
            .catch(err => {
                console.log('delete shipping unit modal err: ', err)
                return toast.error(err.message)
            })
            .finally(() => {
                setFormState(() => ({ loading: false }))
                onDelete(shipUnitId)
            })
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <StyledDialog open={open}>
            <Card sx={{ px: 2 }}>
                <StyledDeleteCard>
                    <CardHeader
                        title={'Are You Sure?'}
                        subheader={'Sure you want to delete?'}
                    />

                    <StyledButtonArea>
                        {formState.loading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Button
                                    variant={'contained'}
                                    onClick={handleSubmit}
                                >
                                    Yes
                                </Button>
                                <Button onClick={handleClose}>Cancel</Button>
                            </>
                        )}
                    </StyledButtonArea>
                </StyledDeleteCard>
            </Card>
        </StyledDialog>
    )
}

export default DeleteShippingUnit__Modal
