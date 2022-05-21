import useApiQuery from 'src/hooks/useApiQuery'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import styled from '@emotion/styled'

import toast from 'react-hot-toast'
import { SingleLineItem } from '.'
import addItemQuery from 'src/hooks/queries/addItemQuery'
import {
    StyledItemList__Header,
    StyledTableBody,
} from '../Styles/LineItem__Styles'
import { QuantityEdit } from './SingleLineItem'
import _ from 'lodash'
import { useSWRConfig } from 'swr'

const PrepareWrap = styled.div`
    max-width: 800px;
    margin: auto 1rem;
    @media all and (max-width: 960px) {
        margin: 0;
    }
`

type PrepareItemsTable__Props = {
    handleCloseModal: () => void
    shippingUnitWithItems: any
    purchaseOrderId: string | number
}
const PrepareItemsTable = ({
    handleCloseModal,
    shippingUnitWithItems,
    purchaseOrderId,
}: PrepareItemsTable__Props): React.ReactNode | any => {
    const [itemsStaged, setItemsStaged] = useState([])
    const [itemsOnOrder, setItemsOnOrder] = useState([])

    // compute if the items staged is different from items on order
    const changesStaged = useMemo(() => {
        // compare
        return itemsStaged.length > 0
    }, [itemsStaged])

    const total = useMemo(() => {
        let itemCount = 0
        itemsOnOrder.map(i => {
            itemCount += i.Qty
        })
        return itemCount
    }, [itemsOnOrder])

    useEffect(() => {
        const initial = []
        shippingUnitWithItems.items.map(i => {
            if (i.Qty) {
                initial.push(i)
            }
        })
        setItemsOnOrder(initial)
    }, [])

    const { error, loading, data } = useApiQuery({
        path: `/plan-loads?purchaseOrderId=${purchaseOrderId}`,
        options: {
            revalidateOnFocus: true,
        },
    })

    const { mutate } = useSWRConfig()

    const { adding, addItems } = addItemQuery()

    useEffect(() => {
        if (adding) {
            toast.loading('Updating...', { id: 'adding' })
        }
    }, [adding])

    const handleAddSingleItem = async (item, quantity) => {
        const itemArr = [{ ...item, quantityToAdd: quantity }]
        await addItems(itemArr, shippingUnitWithItems.PlanLoadShippingUnitId)
            .catch(err => toast.error('Error:', err))
            .then(res => toast.success('Updated!', { id: 'adding' }))
            .finally(async () => {
                await mutate(`/plan-loads?purchaseOrderId=${purchaseOrderId}`)
            })
    }

    const handleSave = async () => {
        await addItems(
            itemsStaged,
            shippingUnitWithItems.PlanLoadShippingUnitId
        )
            .catch(err => toast.error('Error:', err))
            .then(res => {
                setItemsStaged([])
                toast.success('Updated!', { id: 'adding' })
            })
            .finally(async () => {
                await mutate(`/plan-loads?purchaseOrderId=${purchaseOrderId}`)
                handleCloseModal()
            })
    }

    return (
        <PrepareWrap>
            <Box
                sx={{
                    mb: 2,

                    py: '20px',
                    position: 'sticky',
                    top: '0px',
                    backgroundColor: 'white',
                    zIndex: 1000,
                    display: 'flex',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    sx={{ minWidth: '100px', mr: 2, mb: 1 }}
                    variant="contained"
                    disabled={!changesStaged}
                    onClick={handleSave}
                >
                    Save
                </Button>
                <Button
                    sx={{ minWidth: '100px', mr: 2, mb: 1 }}
                    variant="contained"
                    color="secondary"
                    onClick={handleCloseModal}
                >
                    Cancel
                </Button>
                <Box>
                    <Typography variant="overline">
                        {total} items on this order{' '}
                    </Typography>
                </Box>
            </Box>
            <StyledTableBody>
                {error && <div>{JSON.stringify(error)}</div>}
                {loading && <div>Loading...</div>}
                {data ? (
                    <StyledItemList__Header>
                        <div>Item Information</div>
                        <div className={'centered'}>Qty Remaining</div>
                        <div className={'centered'}></div>
                    </StyledItemList__Header>
                ) : (
                    <Typography variant={'h5'}>No Items</Typography>
                )}
                {data?.correspondingPoDetails?.length > 0 &&
                    data.correspondingPoDetails.map((item, index) => (
                        <SingleLineItem
                            changesStaged={changesStaged}
                            key={`${item.ItemNbr}--${index}`}
                            item={item}
                            shippingUnitPreparedItems={
                                shippingUnitWithItems.items
                            }
                            onAdd={(item, quantity) =>
                                handleAddSingleItem(item, quantity)
                            }
                            onChangeStaged={(quantityEdit: QuantityEdit) => {
                                // first find the item see if its staged
                                const existing = itemsStaged.findIndex(
                                    i => i.ItemNbr == item.ItemNbr
                                )
                                // if it is staged, change quantity

                                if (
                                    existing !== -1 &&
                                    quantityEdit.numberToAdd !== 0
                                ) {
                                    const newStaged = [...itemsStaged]
                                    let oldItem = itemsStaged[existing]
                                    oldItem = {
                                        ...oldItem,
                                        quantityToAdd: quantityEdit.numberToAdd,
                                    }

                                    newStaged.splice(existing, 1, oldItem)
                                    setItemsStaged(newStaged)
                                    // if it is not add it to staged array
                                } else if (quantityEdit.numberToAdd !== 0) {
                                    setItemsStaged(prev => [
                                        ...prev,
                                        {
                                            ...item,
                                            quantityToAdd:
                                                quantityEdit.numberToAdd,
                                        },
                                    ])
                                    // Otherwise the quantity is zero and we wanna delete it
                                } else {
                                    const newStaged = [...itemsStaged]
                                    newStaged.splice(existing, 1)
                                    setItemsStaged(newStaged)
                                }
                            }}
                        />
                    ))}
            </StyledTableBody>
        </PrepareWrap>
    )
}

PrepareItemsTable.propTypes = {}

export default PrepareItemsTable
