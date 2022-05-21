import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    TextField,
} from '@material-ui/core'
import React, { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { StyledDialog, StyledForm } from '../Styles/Modal__Styles'
import { matchEmail } from 'utils/matchEmail'
import { FetchApi } from 'lib/fetchApi'
import toast from 'react-hot-toast'

const StyledEmail = styled.div`
    background-color: ${props => props.theme.palette.primary.light};
    width: max-content;
    border-radius: 15px;
    position: relative;
    padding: 5px 35px 5px 10px;
    margin: 0.5rem 0;
    color: white;
    && span.exit {
        cursor: pointer;
        margin-left: 5px;
        transform: rotate(-45deg);
        position: absolute;
        font-size: 32px;
        top: -7px;
    }
`

const ButtonArea = styled.div`
    width: 100%;

    padding: 0.5rem;
    padding-top: 2rem;
    margin: auto;
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: flex-end;
    && .MuiButton-root {
        width: inherit;
    }
`

type EmailNotify__Modal__Props = {
    open: boolean
    setOpen: (value: boolean) => void
    notifyList: string
    id: number
}

const EmailNotify__Modal = ({
    open,
    setOpen,
    notifyList,
    id,
}: EmailNotify__Modal__Props) => {
    const [notifies, setNotifies] = useState(JSON.parse(notifyList) || [])
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)

    const initialLen = useMemo(() => notifies.length, [])

    useEffect(() => {
        if (matchEmail(value)) {
            setError(false)
        } else {
            setError(true)
        }
    }, [value, error])

    const addNotify = () => {
        if (matchEmail(value)) {
            const prev = [...notifies]
            prev.push(value)
            setNotifies(prev)
            setValue('')
        } else {
            setError(true)
        }
    }

    const removeNotify = index => {
        const prev = [...notifies]
        prev.splice(index, 1)
        setNotifies(prev)
    }

    const submit = () => {
        FetchApi({
            path: '/purchase-orders/addEmail',
            options: {
                body: JSON.stringify({
                    emailArray: notifies,
                    purchaseOrderId: id,
                }),
                method: 'POST',
            },
        })
            .then((res: any) => {
                toast.success(res.message)
                setOpen(false)
            })
            .catch(err => {
                console.error(err)
                toast.error('There was an error, check your browser')
            })
    }

    return (
        <StyledDialog open={open} onClose={() => setOpen(false)}>
            <Card>
                <CardHeader
                    title={'Notify By Email'}
                    subheader={'Hit enter to add emails'}
                />
                <CardContent>
                    <div>
                        {notifies &&
                            notifies.map((n, index) => (
                                <StyledEmail key={n}>
                                    {n}
                                    <span
                                        className="exit"
                                        onClick={() => removeNotify(index)}
                                    >
                                        +
                                    </span>
                                </StyledEmail>
                            ))}
                    </div>
                    <StyledForm>
                        <TextField
                            label="Email"
                            name="email"
                            variant="outlined"
                            error={error && value !== ''}
                            value={value}
                            onKeyUp={e => {
                                if (e.key == 'Enter') {
                                    addNotify()
                                }
                            }}
                            onChange={e => {
                                setValue(e.target.value)
                            }}
                            helperText={
                                error && value !== ''
                                    ? 'Email must be valid'
                                    : 'Press "ENTER" to save.'
                            }
                        />
                    </StyledForm>
                </CardContent>

                <CardActions>
                    <ButtonArea>
                        <Button
                            variant={'contained'}
                            sx={{ backgroundColor: 'gray' }}
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            disabled={initialLen === notifies.length}
                            variant={'contained'}
                            onClick={submit}
                        >
                            Save
                        </Button>
                    </ButtonArea>
                </CardActions>
            </Card>
        </StyledDialog>
    )
}

export default EmailNotify__Modal
