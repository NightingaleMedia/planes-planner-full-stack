import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import {
    AppBar,
    Box,
    CircularProgress,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@material-ui/core'
import Finalize__Modal from './Finalize__Modal'
import MoreVert from '@material-ui/icons/MoreVert'
import { PoStatus } from '../PODetail'

const StyledAppBar = styled(AppBar)`
    background-color: ${props => props.theme.palette.secondary.main};
    color: white;
    padding: 1rem 0rem;
`

const StyledToolbar = styled(Toolbar)`
    && .status {
        width: inherit;
    }
    @media all and (max-width: 600px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        /* grid-auto-flow: column; */
        padding: 0;
        && .status {
            grid-column: 1;
        }
        && .menu {
            grid-column: 2;
            grid-row: -1;
            text-align: right;
            && .MuiButtonBase-root {
                margin-right: 0;
                float: right;
                padding: 0;
            }
        }
    }
`
export type LoadHeader__Props = {
    purchaseOrderId: string | number
    planLoadId: string | number
    loading: boolean
    businessUnit: string
    purchaseOrderNbr: string | number
    onFinalize: () => void
    setFinalizeOpen: (v: boolean) => void
    finalizeOpen: boolean
}

const LoadHeader = ({
    planLoadId,
    purchaseOrderId,
    loading,
    businessUnit,
    purchaseOrderNbr,
    finalizeOpen,
    setFinalizeOpen,
}: LoadHeader__Props) => {
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenu = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <StyledAppBar variant={'outlined'} position={'relative'}>
                <StyledToolbar>
                    <Box sx={{ flexGrow: 0, mr: 4 }}>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant={'h4'} sx={{ color: 'white' }}>
                                {businessUnit} {purchaseOrderNbr}
                            </Typography>
                        )}
                        <Typography variant={'body1'} sx={{ color: 'white' }}>
                            Purchase Order ID: {purchaseOrderId}
                        </Typography>
                    </Box>
                    <Box
                        className="status"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        <PoStatus
                            purchaseOrderId={Number(purchaseOrderId)}
                            planLoadId={Number(planLoadId)}
                        />
                    </Box>
                    <Box className="menu">
                        <>
                            <IconButton onClick={handleMenu} color="inherit">
                                <MoreVert />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    onClick={() => {
                                        router.push(
                                            `/quick-ship/${purchaseOrderId}`
                                        )
                                        handleClose()
                                    }}
                                >
                                    Quick Ship
                                </MenuItem>
                                {!loading && purchaseOrderId && planLoadId && (
                                    <MenuItem
                                        onClick={() => {
                                            setFinalizeOpen(true)
                                            handleClose()
                                        }}
                                    >
                                        Finalize
                                    </MenuItem>
                                )}

                                <MenuItem
                                    onClick={() => {
                                        router.push(
                                            `/orders/${purchaseOrderId}`
                                        )
                                        handleClose()
                                    }}
                                >
                                    Back to PO Details
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        router.push('/orders')
                                        handleClose()
                                    }}
                                >
                                    All Orders
                                </MenuItem>
                            </Menu>
                        </>
                    </Box>
                </StyledToolbar>
            </StyledAppBar>
            <Finalize__Modal
                purchaseOrderId={purchaseOrderId}
                planLoadId={planLoadId}
                open={finalizeOpen}
                setOpen={setFinalizeOpen}
            />
        </>
    )
}

LoadHeader.propTypes = {}

export default LoadHeader
