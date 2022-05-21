import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { Theme, Typography } from '@material-ui/core'

const BGWrap = styled.div`
    width: 100%;
    background-color: ${props => props.theme.palette.background.default};
    padding: 4px;
    border-radius: 8px;
    && h3 {
        margin: 0.5rem 0;
    }
`
const SelectorWrap = styled.div`
    position: relative;
    min-height: 40px;
    display: grid;
    cursor: pointer;
    grid-template-columns: 1fr 1fr;
    && span.selector {
        position: absolute;
        border-radius: 5px;
        min-height: 38px;
        margin: auto;
        margin-top: 1px;
        width: 0%;
        z-index: 0;
        transition: all 0.1s ${props => props.theme.transitions.easing.easeIn};
    }
    && span.selector.left {
        width: 50%;
        background-color: #f7f7f7;
        left: 0;
    }
    && span.selector.right {
        width: 50%;
        background-color: #f7f7f7;
        left: 50%;
    }
`

const SelectorInput = styled.input``
const SelectorOption = styled.label``
const StyledLabelAndInput = styled.div`

    && label {
        font-weight: 800;
        transition: all 0.1s ${props => props.theme.transitions.easing.easeIn};

        /* color: ${props => props.theme.palette.grey[400]}; */
        color: ${props => props.theme.palette.text.primary};
        z-index: 100;
        height: 100%;
        width: 50%;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

`

type RadioList = {
    name: string
    value: string
    id?: string
}
type OnChangeValue = { name: string; value: string }

type DualSelector__Types = {
    title?: string
    options: RadioList[]
    initial?: number
    onChangeValue: ({ name, value }: OnChangeValue) => void
}
const DualSelector = ({
    title,
    options,
    initial = 0,
    onChangeValue,
}: DualSelector__Types): any => {
    const [selected, setSelected] = useState(null)
    const [index, setIndex] = useState(initial)

    const handleChange = e => {
        const { name, value } = e.target
        // find the index of the selected
        const selectedIndex = options.findIndex(opt => opt.name === name)
        // set the selected index to that one
        setIndex(selectedIndex)
        setSelected(options[selectedIndex])
        // handle the change
        onChangeValue({ name, value })
    }

    useEffect(() => {
        if (initial) {
            setSelected(options[initial])
        }
    }, [initial, options])

    return (
        <div>
            {title && <Typography variant={'subtitle1'}>{title}</Typography>}
            <BGWrap>
                <SelectorWrap>
                    {options.map(o => (
                        <StyledLabelAndInput key={o.id || o.name}>
                            <SelectorInput
                                id={o.id || o.name}
                                name={o.name}
                                type={'radio'}
                                value={o.value}
                                hidden
                                onChange={handleChange}
                                checked={selected?.name === o.name}
                            />
                            <SelectorOption htmlFor={o.id || o.name}>
                                {o.name}
                            </SelectorOption>
                        </StyledLabelAndInput>
                    ))}
                    <span
                        className={`selector ${index === 0 &&
                            'left'} ${index === 1 && 'right'}`}
                    ></span>
                </SelectorWrap>
            </BGWrap>
        </div>
    )
}

DualSelector.propTypes = {}

export default DualSelector
