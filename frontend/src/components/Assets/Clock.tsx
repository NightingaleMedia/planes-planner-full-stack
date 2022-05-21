import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { DateParse } from './DateParse'

const Clock = ({ format = 'h:mm:ss a' }: DateParse) => {
    const [time, setTime] = useState(Date.now())

    useEffect(() => {
        const int = setInterval(() => {
            setTime(Date.now())
        }, 1000)

        return () => {
            clearInterval(int)
        }
    }, [])

    return <DateParse format={format}>{time}</DateParse>
}

export default Clock
