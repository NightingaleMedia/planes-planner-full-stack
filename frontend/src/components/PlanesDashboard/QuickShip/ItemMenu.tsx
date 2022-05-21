import React from 'react'
import { IconButton } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { FileCopy, RemoveCircleOutline } from '@material-ui/icons'
import styled from '@emotion/styled'

const StyledMenuItem = styled(MenuItem)`
    display: flex;
    justify-content: space-between;
`

const ITEM_HEIGHT = 48

type ItemMenu = {
    onDelete: (index: number) => void
    onDuplicate: (index: number) => void
    index: number
}
export default function ItemMenu({
    onDelete,
    onDuplicate,
    index,
}: ItemMenu): any {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleDuplicate = e => {
        e.stopPropagation()
        onDuplicate(index)
        handleClose()
    }

    const handleDelete = e => {
        e.stopPropagation()
        onDelete(index)
        handleClose()
    }

    return (
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
                <StyledMenuItem onClick={handleDelete}>
                    Delete <RemoveCircleOutline />
                </StyledMenuItem>
                <StyledMenuItem onClick={handleDuplicate}>
                    Duplicate <FileCopy />
                </StyledMenuItem>
            </Menu>
        </div>
    )
}
