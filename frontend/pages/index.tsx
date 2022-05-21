import { LinearProgress } from '@material-ui/core'

import dynamic from 'next/dynamic'
const AllOverviewModules = dynamic(
    () =>
        import(
            'src/components/PlanesDashboard/OverviewModules/AllOverviewModules'
        ),
    {
        ssr: false,
        loading: () => <LinearProgress />,
    }
)

const Home = () => <AllOverviewModules />

export default Home
