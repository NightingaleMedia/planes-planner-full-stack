import React from 'react'
import { Typography } from '@material-ui/core'
import useApiQuery from 'src/hooks/useApiQuery'
import GreyBoxes from 'src/atoms/GreyBoxes'

const Address = ({ PoLocationId }: { PoLocationId: string | any }) => {
    if (!PoLocationId) {
        return <Typography>No Address Found</Typography>
    }
    const { error, loading, data } = useApiQuery({
        path: `/locations/${PoLocationId}`,
    })

    if (loading) {
        return (
            <Typography>
                <GreyBoxes number={4} />
            </Typography>
        )
    }
    if (error) {
        return (
            <Typography>
                <div>{error}</div>
                <GreyBoxes number={3} />
            </Typography>
        )
    }
    return (
        <>
            <Typography title={data.LocationLongName}>
                {data.LocationName}
            </Typography>
            {Array.from(Array(10)).map((v, i) => {
                const addString = `Address${i + 1}`
                return (
                    <Typography key={addString}>{data[addString]}</Typography>
                )
            })}
            <Typography>
                {data.City}, {data.State} {data.Country}
            </Typography>
            <Typography>{data.ZipCode}</Typography>
        </>
    )
}
export default Address
