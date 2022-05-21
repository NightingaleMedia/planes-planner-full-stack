import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { getEnumFromKey } from '../../../../utils/getEnumFromKey'
import { POStatuses } from 'src/constants'
import { CircularProgress, Menu, MenuItem } from '@material-ui/core'
import { changePoStatus } from 'src/hooks/queries'
import useApiQuery from 'src/hooks/useApiQuery'
import useAuth from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
const StatusWrap = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`

const StyledStatus = styled.div`
    text-transform: uppercase;
    font-size: 80%;
    line-height: 120%;
    height: 30px;
    font-weight: 600;
    cursor: pointer;
    width: max-content;
    min-width: 90px;
    text-align: center;
    padding: 6px;
    background-color: white;
    /* margin-right: 10px; */

    &&.new {
        color: white;
        background-color: #3d00cd;
    }
    &&.inprogress {
        color: ${props => props.theme.palette.info.main};
        border: 2px solid ${props => props.theme.palette.info.main};
        background-color: white;
    }
    &&.readyToShipPartial {
        color: #edd343;
        border: 2px solid #edd343;
    }
    &&.readyToShipInFull {
        color: ${props => props.theme.palette.success.light};
        border: 2px solid ${props => props.theme.palette.success.light};
    }
    &&.shipped {
        background-color: ${props => props.theme.palette.success.main};
        color: white;
    }
    &&.delivered {
        color: #787878;
        border: 2px solid #787878;
    }
    &&.cancelled {
        color: ${props => props.theme.palette.error.main};
    }
`

type StatusProps = {
    purchaseOrderId: number
    planLoadId: number
}

const Status = ({ purchaseOrderId, planLoadId }: StatusProps): any => {
    const { user } = useAuth()
    const { data, loading } = useApiQuery(
        {
            path: `/purchase-orders/${purchaseOrderId}/status`,
        },
        {
            refreshInterval: 10000,
        }
    )

    const { changing, changeStatus } = changePoStatus(
        Number(purchaseOrderId),
        Number(planLoadId)
    )
    const [stateStatus, setStateStatus] = useState(null)

    useEffect(() => {
        if (data) {
            if (data.POStatus) {
                setStateStatus(data.POStatus)
            } else {
                setStateStatus('new')
            }
        }
    }, [data])

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<any>) => {
        if (user.role === 'SUPERADMIN') {
            setAnchorEl(event.currentTarget)
        }
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleChangeStatus = async (changedStatus: POStatuses) => {
        await changeStatus(changedStatus)
        handleClose()
    }
    return changing || loading ? (
        <CircularProgress style={{ width: '20px', height: '20px' }} />
    ) : (
        <StatusWrap title={'Click to change status'}>
            <StyledStatus className={stateStatus} onClick={handleClick}>
                {getEnumFromKey(POStatuses, stateStatus)}
            </StyledStatus>
            {/* <MoreVert className={'icon'} onClick={handleClick} /> */}
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {Object.keys(POStatuses).map((s: POStatuses) => (
                    <MenuItem
                        key={s}
                        onClick={() => {
                            if (!planLoadId) {
                                handleClose()
                                return toast.error(
                                    'Cannot change status, plan load does not exist yet.'
                                )
                            }
                            handleChangeStatus(s)
                        }}
                    >
                        {POStatuses[s]}
                    </MenuItem>
                ))}
            </Menu>
        </StatusWrap>
    )
}

Status.propTypes = {}

export default Status
