import React from 'react'
import { IconButton } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useRouter } from 'next/router'
import useAuth from 'src/hooks/useAuth'
import EmailNotify__Modal from './EmailNotify__Modal'

const ITEM_HEIGHT = 48

type PoDetail = {
    data: any
    info: any
}
export default function PoDetail__Menu({ data, info }: PoDetail): any {
    const router = useRouter()
    const { user } = useAuth()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [emailNotifyModal, setEmailNotifyModal] = React.useState(false)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <>
            <div>
                <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    <MenuItem
                        key={'view'}
                        onClick={() => {
                            router.push(`/orders/${data.PurchaseOrderId}`)
                        }}
                    >
                        View
                    </MenuItem>
                    <MenuItem
                        key={`load--${data.PurchaseOrderId}`}
                        onClick={() => {
                            router.push(
                                `/shipping-units/${data.PurchaseOrderId}?index=${data.PurchaseOrderIndex}`
                            )
                        }}
                    >
                        Detailed Ship
                    </MenuItem>
                    <MenuItem
                        key={`quick-ship--${data.PurchaseOrderId}`}
                        onClick={() => {
                            router.push(`/quick-ship/${data.PurchaseOrderId}`)
                        }}
                    >
                        Quick Ship
                    </MenuItem>
                    {user.role === 'SUPERADMIN' && (
                        <MenuItem
                            key={`email-notify--${data.PurchaseOrderId}`}
                            onClick={() => {
                                handleClose()
                                setEmailNotifyModal(true)
                            }}
                        >
                            Notify Email
                        </MenuItem>
                    )}
                </Menu>
            </div>
            <EmailNotify__Modal
                id={data.PurchaseOrderId}
                notifyList={data.PurchaseOrderNotify}
                open={emailNotifyModal}
                setOpen={() => setEmailNotifyModal(false)}
            />
        </>
    )
}
