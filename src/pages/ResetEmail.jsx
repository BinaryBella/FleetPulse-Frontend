import { Input, Button, FormControl, FormLabel, Stack, FormErrorMessage, Box } from "@chakra-ui/react";
import { Field, Formik} from "formik";
import forgotPassword from "../assets/images/forgotPassword.png";
import theme from "../config/ThemeConfig.jsx";
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {axiosApi} from "../interceptor.js";

export default function ResetEmail() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    return (
        <>
            <p className="font-sans text-3xl text-[#393970] mb-10">Reset Password Verification</p>
            <img src={forgotPassword} alt="ResetPasswordConfirmation" className="w-1/2 mb-10"/>
            <Box textAlign="center" w="50%" fontSize="sm" marginBottom="10">
                <p>Enter your email address to continue.</p>
            </Box>
            <Formik
                initialValues={{
                    email: ""
                }}
                validate={(values) => {
                    const errors = {};
                    if (!values.email) {
                        errors.email = "Email is required.";
                    }
                    return errors;
                }}
                onSubmit={async (values, { setFieldError }) => {
                    try {
                        console.log("Submitting form with values:", values);
                        setLoading(true);

                        const response = await axiosApi.post('https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Auth/forgot-password', {
                            email: values.email
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.status === 200) { // Check if the status code indicates success
                            console.log("Response data:", response.data);
                            if (response.data.status) {
                                navigate(`/auth/ResetPasswordConfirmation`, { state: { email: values.email } });
                            } else {
                                setFieldError('email', 'Email is not found');
                            }
                        } else {
                            throw new Error('Unexpected response status');
                        }
                    } catch (error) {
                        console.error('Error:', error.message);
                        setFieldError('email', 'Something went wrong. Please try again.');
                    } finally {
                        setLoading(false);
                    }
                }}

            >
                {({handleSubmit, errors, touched}) => (
                    <form className="w-2/5" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <FormControl isInvalid={errors.email && touched.email}>
                                <FormLabel>Email Address</FormLabel>
                                <Field
                                    as={Input}
                                    id="email"
                                    name="email"
                                    type="email"
                                    variant="filled"
                                    size="sm"
                                    borderRadius="md"
                                    placeholder="Email Address"
                                    mb={3}
                                />
                                <FormErrorMessage>{errors.email}</FormErrorMessage>
                            </FormControl>
                            <Button className="mb-2"
                                    type="submit"
                                    bg={theme.purple}
                                    _hover={{bg: theme.onHoverPurple}}
                                    color="#ffffff"
                                    mt={5}
                                    size="sm"
                                    isLoading={loading}
                                    loadingText='Sending'
                                    variant='outline'
                            >
                                Send Verification Code
                            </Button>
                        </Stack>
                    </form>
                )}
            </Formik>
            <div className="flex justify-end">
                    <Link to="/auth/login">
                        <Button variant="link" className="mt-3" size="sm">
                            Return to Login
                        </Button>
                    </Link>
            </div>
        </>
    );
}
