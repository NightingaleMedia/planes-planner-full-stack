import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@material-ui/data-grid'

export function CustomToolbar(props) {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton {...props} />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    )
}
