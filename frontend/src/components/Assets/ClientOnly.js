import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const ClientOnly = ({ children }) => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [])

    if (loading) {
        return null
    }
    return children
}

ClientOnly.propTypes = {
    children: PropTypes.any,
}

export default ClientOnly
