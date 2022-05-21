import { Card, Tabs, Tab, AppBar } from '@material-ui/core'

import GreyBoxes from 'src/atoms/GreyBoxes'
import { a11yProps, TabPanel, useStyles } from '../PoDetailModule'

const PoDetailModule__Loading = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appBar}>
                <Tabs
                    value={0}
                    aria-label="items to ship and prepared shipping units"
                >
                    <Tab label="Items to Ship" {...a11yProps(0)} />
                    <Tab label="Prepared Shipping Units" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={0} index={0}>
                <>
                    <GreyBoxes number={3} />{' '}
                </>
            </TabPanel>
            <TabPanel value={0} index={1}>
                <Card>
                    <GreyBoxes number={3} />{' '}
                </Card>
            </TabPanel>
        </div>
    )
}

PoDetailModule__Loading.propTypes = {}

export default PoDetailModule__Loading
