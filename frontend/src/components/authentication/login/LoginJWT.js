import * as Yup from 'yup'
import { Formik } from 'formik'
import {
    Alert,
    Box,
    Button,
    FormHelperText,
    TextField,
} from '@material-ui/core'
import useAuth from '../../../hooks/useAuth'
import useMounted from '../../../hooks/useMounted'
import { useState } from 'react'
import ForgotPass__Modal from './ForgotPass__Modal'
const LoginJWT = props => {
    const mounted = useMounted()
    const { login } = useAuth()

    const [forgotPassOpen, setForgotPassOpen] = useState(false)

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null,
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email('Must be a valid email')
                        .max(255)
                        .required('Email is required'),
                    password: Yup.string()
                        .max(255)
                        .required('Password is required'),
                })}
                onSubmit={async (
                    values,
                    { setErrors, setStatus, setSubmitting }
                ) => {
                    try {
                        await login(values.email, values.password)

                        if (mounted.current) {
                            setStatus({ success: true })
                            setSubmitting(false)
                        }
                    } catch (err) {
                        console.error(err)
                        if (mounted.current) {
                            setStatus({ success: false })
                            setErrors({ submit: err.message })
                            setSubmitting(false)
                        }
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
                    <form noValidate onSubmit={handleSubmit} {...props}>
                        <TextField
                            autoFocus
                            error={Boolean(touched.email && errors.email)}
                            fullWidth
                            helperText={touched.email && errors.email}
                            label="Email Address"
                            margin="normal"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="email"
                            value={values.email}
                            variant="outlined"
                        />
                        <TextField
                            error={Boolean(touched.password && errors.password)}
                            fullWidth
                            helperText={touched.password && errors.password}
                            label="Password"
                            margin="normal"
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="password"
                            value={values.password}
                            variant="outlined"
                        />
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>
                                    {errors.submit}
                                </FormHelperText>
                            </Box>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <Button
                                color="primary"
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Log In
                            </Button>
                        </Box>
                        {process.env.NODE_ENV === 'development' ? (
                            <Box sx={{ mt: 2 }}>
                                <Alert severity="info">
                                    <div>
                                        For Super Admin use:{' '}
                                        <b>planesadmin@planescompanies.com</b>
                                        <br /> and password
                                        <b>
                                            {' '}
                                            {
                                                process.env
                                                    .NEXT_PUBLIC_ADMIN_PASSWORD
                                            }
                                        </b>
                                    </div>
                                </Alert>
                                <br />

                                <Alert severity="info">
                                    <div>
                                        For Vendor Admin use{' '}
                                        <b>6961@planesvendor1.com</b>
                                        <br /> and password <b>adminadmin</b>
                                    </div>
                                </Alert>
                            </Box>
                        ) : null}
                    </form>
                )}
            </Formik>
            <Box
                sx={{ mt: 2, cursor: 'pointer' }}
                onClick={() => setForgotPassOpen(true)}
            >
                Forgot Password
            </Box>
            <ForgotPass__Modal
                open={forgotPassOpen}
                setOpen={() => setForgotPassOpen(false)}
            />
        </>
    )
}

export default LoginJWT
