import React from 'react'
import { Button, IconButton } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const ITEM_HEIGHT = 48

export type Action = {
    name: string
    onClick: () => any
}

type MenuActions = {
    actions: Action[]
}

export default function ModuleMenu({ actions }: MenuActions): any {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClick = (action: Action) => {
        action.onClick()
        handleClose()
    }

    return (
        <div>
            <IconButton onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            {actions?.length > 0 && (
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
                    {actions.map((action, index) => (
                        <MenuItem
                            key={`${action.name}--${index}`}
                            onClick={() => handleMenuClick(action)}
                        >
                            {action.name}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </div>
    )
}
