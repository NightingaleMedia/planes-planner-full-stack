import { Skeleton, Tabs } from '@material-ui/core'
import GreyBoxes from 'src/atoms/GreyBoxes'
import { TabPanel, useStyles } from '../PlanLoadBuilderModule'

import LoadingLineItems from './LoadingLineItems'

type PlanLoadBuilder__Loading = {
    tabOrientation: 'horizontal' | 'vertical' | null
}

const PlanLoadBuilder__Loading = ({
    tabOrientation,
}: PlanLoadBuilder__Loading) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Tabs
                orientation={tabOrientation}
                variant="scrollable"
                value={1}
                aria-label="tabbed shipping units"
                className={classes.tabs}
            >
                {Array.from(Array(3)).map((n, i) => (
                    // <GreyBoxes key={i} number={10} />
                    <Skeleton key={i} height={34} width={148} />
                ))}
            </Tabs>

            <TabPanel value={1} index={1}>
                <LoadingLineItems />
            </TabPanel>
        </div>
    )
}

PlanLoadBuilder__Loading.propTypes = {}

export default PlanLoadBuilder__Loading
