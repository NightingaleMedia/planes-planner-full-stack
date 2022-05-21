import React from 'react'
import styled from '@emotion/styled'
import GreyBoxes from 'src/atoms/GreyBoxes'
import { GridToolbar } from '@material-ui/data-grid'

const TableWrap = styled.div`
    margin-top: 3rem;
    border: 1px solid ${props => props.theme.palette.grey[300]};
    padding: 8px;
    border-radius: 6px;
`
const FakeHeader = styled.div`
    background-color: ${props => props.theme.palette.background.default};
    height: 50px;
    width: 100%;
    border-radius: 6px;
`

const AllOrdersTable__Loading = () => {
    return (
        <TableWrap>
            <FakeHeader />
            <GreyBoxes number={10} />
        </TableWrap>
    )
}
export default AllOrdersTable__Loading
