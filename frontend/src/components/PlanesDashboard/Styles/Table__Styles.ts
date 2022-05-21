import { Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core'

export const tablesStyle = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: '#fff',
            // border: 'none',
            borderRadius: '10px',
            padding: '8px',
            minHeight: '1080px',
            // minWidth: '500px',
            height: '80vh',
            '& .MuiDataGrid-toolbarContainer': {
                margin: '0.5rem 0 1rem 0',
                '& .MuiButton-root': {
                    fontSize: '16px',
                    marginRight: '6px',
                    padding: '6px 12px',
                    minWidth: '100px',
                },
            },
            '& .MuiDataGrid-columnsContainer': {
                borderBottom: 'none',
                borderRadius: '10px',
                backgroundColor: theme.palette.background.default,
            },
            '& .MuiDataGrid-row': {
                cursor: 'pointer',
            },
            '& .MuiDataGrid-cell:focus': {
                outline: 'none',
            },
            '& .index--2': {
                backgroundColor: theme.palette.error.light,
                color: 'white',
            },
            '& .index--2:hover': {
                color: 'black',
            },
            '& .MuiDataGrid-row:hover span.short': {
                color: theme.palette.error.main,
            },
        },
        paper: {
            boxShadow: theme.shadows[1],
            backgroundColor: '#fff',
            padding: '1rem',
            // boxShadow: "none",
            // minHeight: "400px",
            height: '100%',
        },
        header: {
            '& .headerText': {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            },
            padding: '0',
            justifyContent: 'space-between',
            '& .actions': {
                marginRight: '0',
                justifySelf: 'flex-end',
                alignSelf: 'center',
            },
        },
        toolbar: {
            padding: '10px 0',
            minHeight: '50px',
        },
    })
)
