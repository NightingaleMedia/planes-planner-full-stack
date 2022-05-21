import { CircularProgress, Skeleton } from '@material-ui/core'
import React from 'react'
import { PlanLoadItemList } from './ItemsPreparedToShipModule'
type SubtitleProps = {
    itemList: PlanLoadItemList
}

const ItemsPreparedToShipSubtitle = ({ itemList }: SubtitleProps) => {
    if (!itemList?.planLoad) {
        return <Skeleton height={38} width={400} />
    }
    return (
        <>
            <div style={{ fontWeight: 600 }}>
                {itemList?.planLoad?.LoadName} |{' '}
                <span style={{ color: 'rgb(180,180,180)', fontWeight: 200 }}>
                    Plan Load#: {itemList?.planLoad?.PlanLoadId}
                </span>
            </div>
        </>
    )
}

export default ItemsPreparedToShipSubtitle
