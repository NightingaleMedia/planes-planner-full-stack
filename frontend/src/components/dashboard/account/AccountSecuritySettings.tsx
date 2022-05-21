import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { Formik } from 'formik'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormHelperText,
    Grid,
    LinearProgress,
    TextField,
} from '@material-ui/core'

import NProgress from 'nprogress'
import { useState } from 'react'
import { FetchAdmin } from 'lib/auth/FetchAdmin'
import useAuth from 'src/hooks/useAuth'

const AccountSecuritySettings = () => {
    const { logout } = useAuth()
    const [formState, setFormState] = useState('verify')
    const [oldPassword, setOldPassword] = useState('')
    return (
        <Card>
            <CardHeader title="Change Password" />
            <Divider />
            {
                {
                    verify: (
                        <VerifyPassword
                            successCallback={(oldPw: string) => {
                                setOldPassword(oldPw)
                                setFormState('reset')
                            }}
                        />
                    ),
                    reset: (
                        <ResetPassword
                            logout={logout}
                            oldPassword={oldPassword}
                        />
                    ),
                }[formState]
            }
        </Card>
    )
}

const VerifyPassword = ({
    successCallback,
}: {
    successCallback: (password: string) => void
}) => (
    <Formik
        initialValues={{
            oldPassword: '',
        }}
        onSubmit={async (values, actions) => {
            await FetchAdmin({
                path: '/me/confirm-password',
                options: {
                    method: 'POST',
                    body: JSON.stringify({ oldPassword: values.oldPassword }),
                },
            })
                .then(res => {
                    console.log({ res })
                    actions.setSubmitting(false)
                    successCallback(values.oldPassword)
                })
                .catch(err => {
                    console.log('confirm pass :', err)
                    return actions.setErrors({ oldPassword: err.message })
                })
        }}
    >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
        }) => (
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Grid container spacing={3}>
                        {isSubmitting && <LinearProgress />}
                        <Grid item md={4} sm={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    touched.oldPassword && errors.oldPassword
                                )}
                                fullWidth
                                helperText={
                                    touched.oldPassword && errors.oldPassword
                                }
                                label="Old Password"
                                name="oldPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.oldPassword}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        p: 2,
                    }}
                >
                    <Button
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </Box>
            </form>
        )}
    </Formik>
)

type ResetPassword__Props = {
    oldPassword: string
    logout: () => void
}

const ResetPassword = ({ oldPassword, logout }: ResetPassword__Props) => (
    <Formik
        initialValues={{
            password: '',
            passwordConfirm: '',
            submit: null,
        }}
        validationSchema={Yup.object().shape({
            password: Yup.string()
                .min(7, 'Must be at least 7 characters')
                .max(255)
                .required('Required'),
            passwordConfirm: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        })}
        onSubmit={(
            values,
            { resetForm, setErrors, setStatus, setSubmitting }
        ) => {
            setSubmitting(true)
            try {
                // NOTE: Make API request
                FetchAdmin({
                    path: '/me/change-password',
                    options: {
                        method: 'POST',
                        body: JSON.stringify({
                            password: oldPassword,
                            newPassword: values.passwordConfirm,
                        }),
                    },
                })
                    .then(res => {
                        resetForm()
                        setStatus({ success: true })
                        localStorage.removeItem(
                            process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME
                        )
                        NProgress.start()
                        logout()
                        toast.success(
                            'Password updated, please log in with your new password.'
                        )
                    })
                    .catch(err => {
                        resetForm()
                        setStatus({ success: false })
                        return toast.error(err.message)
                    })
                    .finally(() => setSubmitting(false))
            } catch (err) {
                console.error(err)
                toast.error('Something went wrong!')
                setStatus({ success: false })
                setErrors({ submit: err.message })
                setSubmitting(false)
            }
        }}
    >
        {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
        }) => (
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Grid container spacing={3}>
                        {isSubmitting && <LinearProgress />}
                        <Grid item md={4} sm={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    touched.password && errors.password
                                )}
                                fullWidth
                                helperText={touched.password && errors.password}
                                label="Password"
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.password}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <TextField
                                error={Boolean(
                                    touched.passwordConfirm &&
                                        errors.passwordConfirm
                                )}
                                fullWidth
                                helperText={
                                    touched.passwordConfirm &&
                                    errors.passwordConfirm
                                }
                                label="Password Confirmation"
                                name="passwordConfirm"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.passwordConfirm}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>
                                {errors.submit}
                            </FormHelperText>
                        </Box>
                    )}
                </CardContent>
                <Divider />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        p: 2,
                    }}
                >
                    <Button
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                    >
                        Change Password
                    </Button>
                </Box>
            </form>
        )}
    </Formik>
)

export default AccountSecuritySettings
