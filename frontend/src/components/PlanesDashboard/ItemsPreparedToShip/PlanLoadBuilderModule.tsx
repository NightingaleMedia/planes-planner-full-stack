import React, { BaseSyntheticEvent, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { SingleShippingUnitDetail, SingleItemTitle } from './ShippingUnitDetail'
import {
    Tabs,
    Tab,
    Box,
    Button,
    IconButton,
    Typography,
    TextField,
} from '@material-ui/core'
import { AddCircle, RemoveCircle } from '@material-ui/icons'
import { PlanLoads, PlanLoadShippingUnits } from '.prisma/client'
import { PlanLoadShippingUnitsWithItems } from 'src/types/prismaResponses'
import PlanLoadBuilder__Loading from './Loading/PlanLoadBuilder__Loading'

const StyledBox = styled(Box)`
    padding-left: 2rem;
    @media all and (max-width: 960px) {
        padding-left: 0rem;
    }
`

export const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: 'white',
        display: 'grid',
        gridTemplateColumns: '170px 1fr',
        height: '100%',
        minHeight: '500px',
        '&.loading': {
            opacity: '0.2',
        },
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        padding: '0 5px',
        borderRadius: '8px',
        '& .Mui-selected': {
            color: 'white',
            borderRadius: '8px',
            backgroundColor: `${theme.palette.primary.main}`,
        },
        '& .Mui-selected .MuiSvgIcon-root': {
            color: theme.palette.error.main,
            backgroundColor: 'white',
            borderRadius: '100%',
            opacity: '1',
        },
        '& .MuiInputLabel-root, & .MuiSvgIcon-root': {
            color: 'white',
        },
        [theme.breakpoints.down('md')]: {
            '& .MuiTabs-flexContainer': {
                alignItems: 'center',
            },
        },
    },
    [theme.breakpoints.down('md')]: {
        root: {
            gridTemplateColumns: '1fr',
            gridTemplateRows: '75px auto',
            gap: '20px',
        },
        tabs: {
            padding: '10px',
            backgroundColor: `${theme.palette.grey[800]}`,
            '& .MuiNativeSelect-select': {
                color: 'white',
            },
            '& .MuiTabs-indicator': {
                display: 'none',
            },
        },
    },
    addButton: {
        paddingTop: '1rem',
        '& .add-text': {
            marginRight: '0.5rem',
            fontWeight: 600,
            [theme.breakpoints.down('md')]: {
                display: 'none',
            },
        },
        '& button': {
            minWidth: '80px',
            backgroundColor: `${theme.palette.info.main}`,
            textTransform: 'uppercase',
            fontWeight: 500,
            width: '90%',
            maxWidth: '350px',
            [theme.breakpoints.down('md')]: {
                padding: '5px',
                width: 'min-content',
            },
        },
        [theme.breakpoints.down('md')]: {
            paddingTop: 'unset',
            marginLeft: '1rem',
        },
    },
    titleWithRemove: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        '& .MuiSvgIcon-root': {
            color: theme.palette.grey[200],
            opacity: '0.6',
        },
    },
}))

interface TabPanelProps {
    children?: React.ReactNode
    index: any
    value: any
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <StyledBox sx={{ px: 2 }}> {children}</StyledBox>
            )}
        </div>
    )
}

function a11yProps(index: any) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    }
}

type PlanLoadBuilder__Props = {
    planLoadUnits: PlanLoadShippingUnitsWithItems[]
    planLoad: PlanLoads
    correspondingPoDetails: any[]
    loading: boolean
    onChangeUnit: (unit: PlanLoadShippingUnits, planLoad: PlanLoads) => void
    onAddUnit: () => void
    onAddItems: (planLoad: PlanLoads) => any
    onDeleteUnit: (id: string) => void
    refreshResults: () => void
}

type hv = 'horizontal' | 'vertical'

export const PlanLoadBuilderModule = ({
    planLoad,
    planLoadUnits,
    correspondingPoDetails,
    loading,
    onChangeUnit,
    onAddUnit,
    onDeleteUnit,
    onAddItems,
    refreshResults,
}: PlanLoadBuilder__Props): any => {
    const classes: any = useStyles()
    const [value, setValue] = useState(0)
    const [selectedItem, setSelectedItem] = useState(null)
    const [tabOrientation, setTabOrientation] = useState<hv>('vertical')

    const handleWindowWidth = () => {
        if (window.innerWidth < 961) {
            setTabOrientation('horizontal')
        } else {
            setTabOrientation('vertical')
        }
    }

    useEffect(() => {
        handleWindowWidth()
        window.addEventListener('resize', handleWindowWidth)
        return () => {
            window.removeEventListener('resize', handleWindowWidth)
        }
    }, [])

    useEffect(() => {
        if (planLoadUnits && planLoadUnits.length > 0) {
            setSelectedItem(planLoadUnits[value])
        }
    }, [planLoadUnits, value])

    useEffect(() => {
        onChangeUnit(selectedItem, planLoad)
    }, [selectedItem])

    const handleChange = (e: BaseSyntheticEvent, newValue: number) => {
        console.log(e)
        if (e.target.nodeName === 'SELECT') {
            console.log('SELECT detected')
            return
        }
        setValue(newValue)
    }

    const handleAdd = () => {
        onAddUnit()
        setValue(planLoadUnits.length)
    }

    const handleDelete = id => {
        onDeleteUnit(id)
        setValue(0)
    }
    if (loading || !planLoadUnits) {
        return <PlanLoadBuilder__Loading tabOrientation={tabOrientation} />
    }
    return (
        <div className={classes.root}>
            <Tabs
                orientation={tabOrientation}
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="tabbed shipping units"
                className={classes.tabs}
            >
                {tabOrientation === 'vertical' ? (
                    planLoadUnits?.map((load, index) => (
                        <Tab
                            onClick={() => setSelectedItem(load)}
                            key={load.PlanLoadShippingUnitId}
                            LinkComponent={'div'}
                            label={
                                <Box className={classes.titleWithRemove}>
                                    <SingleItemTitle
                                        title={`${load.Packaging}: ${load.PlanLoadShippingUnitId}`}
                                    />
                                    <IconButton size="small">
                                        <RemoveCircle
                                            onClick={() =>
                                                handleDelete(
                                                    load.PlanLoadShippingUnitId
                                                )
                                            }
                                        />
                                    </IconButton>
                                </Box>
                            }
                            {...a11yProps(index)}
                        />
                    ))
                ) : (
                    <Box
                        sx={{
                            flexGrow: 1,
                            width: '100%',
                        }}
                    >
                        <TextField
                            style={{ width: '100%', color: 'white' }}
                            select
                            label="Shipping Unit"
                            onChange={id => {
                                const load = planLoadUnits.findIndex(
                                    l =>
                                        l.PlanLoadShippingUnitId ===
                                        Number(id.target.value)
                                )
                                console.log({ load })
                                setValue(load)
                                setSelectedItem(planLoadUnits[load])
                            }}
                            SelectProps={{
                                native: true,
                                variant: 'filled',
                                color: 'secondary',
                            }}
                        >
                            {planLoadUnits?.map((load, index) => (
                                <option
                                    key={index}
                                    value={load.PlanLoadShippingUnitId}
                                >
                                    {load.Packaging}:{' '}
                                    {load.PlanLoadShippingUnitId}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                )}

                <Box sx={{ textAlign: 'center' }} className={classes.addButton}>
                    <Button variant={'contained'} onClick={handleAdd}>
                        <Typography variant={'body2'} className="add-text">
                            Add
                        </Typography>
                        <AddCircle />
                    </Button>
                </Box>
            </Tabs>

            {planLoadUnits?.map((load, index) => (
                <TabPanel
                    key={load.PlanLoadShippingUnitId}
                    value={value}
                    index={index}
                >
                    <SingleShippingUnitDetail
                        planLoadUnitId={load.PlanLoadShippingUnitId}
                        refreshResults={refreshResults}
                        correspondingPoDetails={correspondingPoDetails}
                        suItems={load.items}
                        onAddItems={() => onAddItems(planLoad)}
                    />
                </TabPanel>
            ))}
        </div>
    )
}

export default PlanLoadBuilderModule
