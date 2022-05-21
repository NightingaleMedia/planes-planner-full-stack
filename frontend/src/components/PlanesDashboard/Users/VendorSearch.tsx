import React from 'react'
import PropTypes from 'prop-types'
import { Vendors } from '@prisma/client'
import { Autocomplete, CircularProgress, TextField } from '@material-ui/core'
import { FetchAdmin } from 'lib/auth/FetchAdmin'

type VendorSearch__Props = {
    sendValue: (id: any) => void
}

const VendorSearch = ({ sendValue }: VendorSearch__Props) => {
    const [open, setOpen] = React.useState(false)
    const [options, setOptions] = React.useState<readonly Vendors[]>([])
    const loading = open && options.length === 0

    React.useEffect(() => {
        let active = true

        if (!loading) {
            return undefined
        }

        FetchAdmin({ path: '/vendor' }).then((res: any) => {
            if (active) {
                setOptions(res.vendors)
            }
        })

        return () => {
            active = false
        }
    }, [loading])

    return (
        <Autocomplete
            id="asynchronous-demo"
            open={open}
            onOpen={() => {
                setOpen(true)
            }}
            onClose={() => {
                setOpen(false)
            }}
            isOptionEqualToValue={(option, value) =>
                option.VendorName === value.VendorName
            }
            getOptionLabel={option => {
                return option.VendorName + ' | ' + option.VendorId
            }}
            options={options}
            loading={loading}
            onSelect={(e: any) => {
                const v = e.target.value
                const final = v.slice(v.search(' | ') + 3)
                sendValue(final)
            }}
            renderInput={params => {
                return (
                    <TextField
                        {...params}
                        label="Vendor"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? (
                                        <CircularProgress
                                            color="inherit"
                                            size={20}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )
            }}
        />
    )
}

VendorSearch.propTypes = {}

export default VendorSearch
