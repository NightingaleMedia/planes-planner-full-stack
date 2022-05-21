import { Grid } from '@material-ui/core'
import GreyBoxes from 'src/atoms/GreyBoxes'
import { HeaderBox } from '../PoDetailHeader'

const PoDetailHeader__Loading = () => {
    return (
        <div style={{ maxWidth: '1000px', marginTop: '1rem', opacity: '0.6' }}>
            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-start"
            >
                <Grid item sm={3} xs={6}>
                    <HeaderBox>
                        <GreyBoxes number={2} />
                    </HeaderBox>
                    <HeaderBox>
                        <GreyBoxes number={2} />
                    </HeaderBox>
                </Grid>
                <Grid item sm={3} xs={6}>
                    <HeaderBox>
                        <GreyBoxes number={2} />
                    </HeaderBox>
                </Grid>
                <Grid item sm={3} xs={6}>
                    <HeaderBox>
                        <GreyBoxes number={2} />
                    </HeaderBox>
                </Grid>
                <Grid item sm={3} xs={6}>
                    <HeaderBox className="dates">
                        <GreyBoxes number={3} />
                    </HeaderBox>
                </Grid>
            </Grid>
        </div>
    )
}

export default PoDetailHeader__Loading
