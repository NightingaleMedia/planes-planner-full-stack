import React from 'react'
import Moment from 'react-moment'

export type DateParse = {
    format?: string
    children?: string | number | Date | any
}

export const DateParse = ({
    format = 'MM/DD/YYYY',
    children,
}: DateParse): React.ReactNode | JSX.Element | any => {
    if (!children) {
        return <> Not Available </>
    }
    return <Moment format={format}>{children}</Moment>
}

export default DateParse
