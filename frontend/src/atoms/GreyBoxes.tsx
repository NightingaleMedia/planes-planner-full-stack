import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const load = keyframes`

    0%{
        width: 0%
    }
    100% {
        width: 100%;
    }
`

type Loading = {
    index: number | string
}
const StyledBox = styled.div<Loading>`
    position: relative;
    &&::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: ${props => props.theme.palette.grey[200]};
        border-radius: 8px;
        animation: ${load} 1.5s infinite ease;
        animation-delay: ${(props: any) => props.index / 50}s;
    }
`
const GreyBoxes = ({ number = 5 }: { number: number }): any => {
    const arr = Array.from(Array(number).keys())

    return arr.map((a, index) => (
        <StyledBox
            index={index}
            key={a}
            style={{
                backgroundColor: '#f7f7f7',
                borderRadius: '8px',
                margin: '10px',
                height: '40px',
            }}
        ></StyledBox>
    ))
}

export default GreyBoxes
