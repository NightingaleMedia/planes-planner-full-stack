import { useEffect, useState } from 'react'
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    Select,
    TextField,
} from '@material-ui/core'

import { PACKAGE_TYPES, UNITS, WEIGHTS } from 'src/constants'
import { DualSelector } from 'src/atoms'
import { Transition } from 'react-transition-group'

const duration = 300

const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    // border: 'none',
}

const transitionStyles = {
    entering: { outline: '0px solid black' },
    entered: { outline: '2px solid rgb(83, 133, 244)' },
    exiting: { outline: '0px solid rgb(83, 133, 244)' },
    exited: { border: 'none' },
}

type CreateUnit__Props = {
    onChange: (e: any) => void
    index: any
    data: any
}

const CreateUnit = ({ onChange, index, data }: CreateUnit__Props): any => {
    return (
        <Transition in={index !== 0} timeout={duration}>
            {state => (
                <Card style={{ ...defaultStyle, ...transitionStyles[state] }}>
                    <CardHeader
                        title={data.Packaging + ' ' + `${Number(index) + 1}`}
                        subheader={
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <div>
                                    {data.Length} x {data.Width} x {data.Height}{' '}
                                    {data.DimUnits}
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {data.Weight} {data.WeightUnits}
                                </div>
                            </div>
                        }
                    />
                    <CardContent>
                        <FormControl
                            size="small"
                            variant={'outlined'}
                            style={{ width: '100%' }}
                        >
                            <InputLabel id={`Packaging--${index}`}>
                                Type
                            </InputLabel>
                            <Select
                                native
                                labelId={`Packaging--${index}`}
                                variant={'outlined'}
                                label="Packaging"
                                name={'Packaging'}
                                value={data.Packaging}
                                onChange={onChange}
                            >
                                {Object.keys(PACKAGE_TYPES).map(key => (
                                    <option
                                        key={key}
                                        value={PACKAGE_TYPES[key]}
                                    >
                                        {PACKAGE_TYPES[key]}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <br />
                        <TextField
                            onChange={onChange}
                            size="small"
                            variant={'outlined'}
                            label={'License Nbr'}
                            value={data.LicensePlateNbr}
                            name={'LicensePlateNbr'}
                            sx={{ margin: '10px 0' }}
                        />

                        <DualSelector
                            onChangeValue={({ value }) =>
                                onChange({
                                    target: { name: 'WeightUnits', value },
                                })
                            }
                            title={'Weight Units'}
                            options={[
                                {
                                    name: 'lbs',
                                    value: 'LBS',
                                    id: `lbs--${index}`,
                                },
                                { name: 'kg', value: 'KG', id: `kg--${index}` },
                            ]}
                        />
                        <TextField
                            onChange={onChange}
                            size="small"
                            variant={'outlined'}
                            label={'Weight'}
                            name={'Weight'}
                            sx={{ margin: '10px 0' }}
                            value={data.Weight}
                        />
                        <DualSelector
                            title={'Measurement'}
                            onChangeValue={({ value }) =>
                                onChange({
                                    target: { name: 'DimUnits', value },
                                })
                            }
                            options={[
                                { ...UNITS[0], id: `units1--${index}` },
                                { ...UNITS[1], id: `units2--${index}` },
                            ]}
                        />
                        <div style={{ width: '100%' }}>
                            {['Length', 'Width', 'Height'].map(u => (
                                <Box
                                    key={`${u}--${index}`}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <TextField
                                        size="small"
                                        id={u}
                                        variant={'outlined'}
                                        label={u}
                                        name={u}
                                        onChange={onChange}
                                        value={data[u]}
                                        sx={{ margin: '5px 0' }}
                                    />{' '}
                                    <Box
                                        sx={{ textAlign: 'center', mx: 'auto' }}
                                    >
                                        {data['DimUnits'] && data['DimUnits']}
                                    </Box>
                                </Box>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </Transition>
    )
}

export default CreateUnit
