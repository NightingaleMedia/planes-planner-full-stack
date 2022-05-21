import React from 'react'
import PropTypes from 'prop-types'
import Module from './Module'
import { Paper } from '@material-ui/core'
import GreyBoxes from 'src/atoms/GreyBoxes'

type ErrorModule = {
    error: any
}
const ErrorModule = ({ error }: ErrorModule): any => {
    return (
        <Module title={'Sorry there was an error...'} subtitle={error?.message}>
            <GreyBoxes number={5} />
        </Module>
    )
}

ErrorModule.propTypes = {}

export default ErrorModule
