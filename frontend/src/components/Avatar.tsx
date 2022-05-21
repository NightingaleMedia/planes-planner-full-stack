import PropTypes from 'prop-types'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #00e48a 30%, #00e48d 90%)',
    },
})

export type PlanesAvatar__Props = {
    text: string
    width?: number
    height?: number
}

export default function PlanesAvatar({
    text,
    width,
    height,
}: PlanesAvatar__Props) {
    if (text.length > 1) {
        text = text.slice(0, 1)
    }
    const classes = useStyles()
    return (
        <Avatar sx={{ height, width }} className={classes.root}>
            {text}
        </Avatar>
    )
}

PlanesAvatar.propTypes = {
    text: PropTypes.string,
}
