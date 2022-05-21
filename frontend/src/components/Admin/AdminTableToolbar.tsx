import { Button } from '@material-ui/core'
import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
    GridToolbarFilterButtonProps,
} from '@material-ui/data-grid'

type AdminToolbar__Props = GridToolbarFilterButtonProps & {
    clearFilter: () => void
}
export function AdminTableToolbar(props: any) {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton {...props} />
            <GridToolbarDensitySelector />
            <Button
                color="primary"
                variant="contained"
                onClick={props.clearFilter}
            >
                Clear Filter
            </Button>
        </GridToolbarContainer>
    )
}
