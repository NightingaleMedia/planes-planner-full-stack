import {
    Card,
    CardHeader,
    Dialog,
    Snackbar,
    Alert,
    IconButton,
} from '@material-ui/core'
import { HighlightOff } from '@material-ui/icons'
import { styled } from '@material-ui/styles'
import React from 'react'
import PoDetail from './PoDetail'

export const ModalCard = styled(Card)({
    width: '90vw',
    maxWidth: '1000px',
    minHeight: '95vh',
    padding: '1rem 0',
    overflow: 'hidden',
    backgroundColor: 'white',
    '& .MuiCardHeader-root': {
        padding: '0 16px 0 16px',
    },
    '& .MuiCardHeader-title': {
        fontSize: '1.5rem',
        fontWeight: '600',
    },
    '& .MuiPaper-root': {
        boxShadow: 'none',
    },
})

type PoDetail__Modal__Props = {
    open: boolean
    setOpen: (x: boolean) => void
    poData: any
}

const PLACEHOLDER = 59828
const PoDetail__Modal = ({
    open,
    setOpen,
    poData,
}: PoDetail__Modal__Props): React.ReactNode | string | any => {
    // we don't want it to pull data until clicked
    if (!open) {
        return null
    }

    if (!poData) {
        return (
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
            >
                <Alert onClose={() => setOpen(false)} severity="error">
                    There was an error getting PO Data
                </Alert>
            </Snackbar>
        )
    }
    return (
        <Dialog open={open} maxWidth={'xl'} onClose={() => setOpen(false)}>
            <ModalCard>
                <CardHeader
                    action={
                        <IconButton onClick={() => setOpen(false)}>
                            <HighlightOff sx={{ fontSize: '2rem' }} />
                        </IconButton>
                    }
                />
                <PoDetail purchaseOrderId={PLACEHOLDER} />
            </ModalCard>
        </Dialog>
    )
}
export default PoDetail__Modal
