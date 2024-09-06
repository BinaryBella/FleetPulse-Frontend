import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputRightElement, Stack, Button, Alert, AlertIcon, Box } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Field, Formik } from "formik";
import ResetPass2 from "../assets/images/ResetPass2.png";
import theme from "../config/ThemeConfig.jsx";
import PasswordStrengthBar from 'react-password-strength-bar';
import $ from 'jquery';
import {axiosApi} from "../interceptor.js";

export default function ResetPassword() {
    const [newPasswordVisibility, setNewPasswordVisibility] = useState(false);
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();
    const location = useLocation();
    let email = "";

    useEffect(() => {
        // Password strength meter style
        $(".pwd-meter > div").children().each(function () {
            $(this).css({"height": "3px", "border-radius": "5px"})
        });

        if (location.state == null) {
            navigate("/auth/login");
        } else {
            email = location.state.email;
        }
    }, []);

    const handleNewPasswordVisibility = () => {
        setNewPasswordVisibility(!newPasswordVisibility);
    };

    const handleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisibility(!confirmPasswordVisibility);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true); // Set loading to true when submitting form

            const response = await axiosApi.post('https://localhost:7265api/Auth/reset-password', {
                email: location.state.email, // Assuming location.state.email is defined elsewhere
                newPassword: values.newpassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                navigate("/auth/ResetPassSuccess");
            } else {
                setError("Failed to reset password. Please try again.");
            }
        } catch (error) {
            console.error('Error:', error.message);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Set loading to false when request is completed
        }
    };


    return (
        <>
            <p className="font-sans text-2xl text-[#393970] mb-7">Reset Password</p>
            <img src={ResetPass2} alt="ResetPassword" className="w-1/5 mb-4" />
            <Box textAlign="center" w="40%" fontSize="sm">
                <p className="text-2xl text-[#D49458] font-bold mb-4">Create new password</p>
                <p className="mb-4 text-1xl">Your new password must be different from the previously used password</p>
            </Box>
            <Formik
                initialValues={{
                    newpassword: "",
                    confirmpassword: ""
                }}
                validate={(values) => {
                    const errors = {};
                    if (!values.newpassword) {
                        errors.newpassword = "New Password is required.";
                    }
                    if (!values.confirmpassword) {
                        errors.confirmpassword = "Confirm Password is required.";
                    } else if (values.newpassword !== values.confirmpassword) {
                        errors.confirmpassword = "Passwords do not match.";
                    }
                    return errors;
                }}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, errors, touched, values }) => (
                    <form onSubmit={handleSubmit} className="w-2/5">
                        <Stack spacing={3}>
                            {error && ( // Display error message if error state is not empty
                                <Alert status="error" mb={4}>
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )}
                            <FormControl isInvalid={!!errors.newpassword && touched.newpassword}>
                                <FormLabel htmlFor="newpassword">New Password</FormLabel>
                                <InputGroup>
                                    <Field
                                        as={Input}
                                        id="newpassword"
                                        name="newpassword"
                                        type={newPasswordVisibility ? "text" : "password"}
                                        variant="filled"
                                        placeholder="New Password"
                                        mb="10px"
                                        size="sm"
                                        borderRadius="md"
                                        fontSize="sm"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <IconButton
                                            h="1.75rem"
                                            size="sm"
                                            marginBottom="3px"
                                            variant="ghost"
                                            onClick={handleNewPasswordVisibility}
                                            icon={newPasswordVisibility ? <ViewOffIcon /> : <ViewIcon />}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <PasswordStrengthBar className="pwd-meter" password={values.newpassword} />
                                <FormErrorMessage>{errors.newpassword}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.confirmpassword && touched.confirmpassword}>
                                <FormLabel htmlFor="confirmpassword">Confirm Password</FormLabel>
                                <InputGroup>
                                    <Field
                                        as={Input}
                                        id="confirmpassword"
                                        name="confirmpassword"
                                        type={confirmPasswordVisibility ? "text" : "password"}
                                        variant="filled"
                                        placeholder="Confirm Password"
                                        fontSize="sm"
                                        size="sm"
                                        borderRadius="md"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <IconButton
                                            h="1.75rem"
                                            size="sm"
                                            marginBottom="3px"
                                            variant="ghost"
                                            onClick={handleConfirmPasswordVisibility}
                                            icon={confirmPasswordVisibility ? <ViewOffIcon /> : <ViewIcon />}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage>{errors.confirmpassword}</FormErrorMessage>
                            </FormControl>
                            <Button
                                type="submit"
                                mt={5}
                                bg={theme.purple}
                                _hover={{ bg: theme.onHoverPurple }}
                                color="#ffffff"
                                size="sm"
                                variant="solid"
                                isLoading={loading} // Add isLoading prop
                            >
                                Save
                            </Button>
                        </Stack>
                    </form>
                )}
            </Formik>
        </>
    );
}
