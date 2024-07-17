import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { Button, Stack, FormControl, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Spinner } from '@chakra-ui/react';
import ResetPass1 from "../assets/images/ResetPass1.png";
import theme from "../config/ThemeConfig.jsx";
import { Box } from "@chakra-ui/react";
import VerificationInput from "react-verification-input";
import './ResetPasswordConfirmation.css';
import { useLocation } from "react-router-dom";
import {axiosApi} from "../interceptor.js";

export default function ResetPasswordConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const [verificationCode, setVerificationCode] = useState("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const { email } = location.state;

    const handleChange = (value) => {
        setVerificationCode(value);
    };

    const handleAlertClose = () => {
        setIsAlertOpen(false);
        setVerificationCode("");
    };

    return (
        <>
            <p className="font-sans text-3xl text-[#393970] mb-4">Reset Password Verification</p>
            <img src={ResetPass1} alt="ResetPasswordConfirmation" className="w-1/3 mb-4" />
            <Box textAlign="center" w="50%" fontSize="small">
                <p className="mb-10">We want to make sure its really you. In order to verify your identity, enter
                    the verification code that was sent to {email} </p>
            </Box>
            <Formik
                initialValues={{ pinValue: "" }}
                validate={() => {
                    const errors = {};
                    const pinText = verificationCode === undefined ? "" : verificationCode.toString();
                    if (pinText.length < 6) {
                        errors.pinValue = "Pin number should contain 6 numbers.";
                    }
                    return errors;
                }}
                onSubmit={async () => { // Mark onSubmit function as async
                    try {
                        setLoading(true); // Set loading to true when submitting form

                        if (verificationCode.toString().length === 6) {
                            const response = await axiosApi.post('https://localhost:7265/api/Auth/validate-verification-code', {
                                email: email,
                                code: verificationCode
                            }, {
                                headers: {
                                    'Content-Type': 'application/json; charset=UTF-8',
                                }
                            });
                            console.log(response.data);

                            if (response.data.status === true) {
                                navigate(`/auth/ResetPassword`, { state: { email: email } });
                            } else {
                                setIsAlertOpen(true);
                            }
                        } else {
                            alert("Please enter a valid 6-digit PIN.");
                        }
                    } catch (error) {
                        console.error('Error:', error.message);
                    } finally {
                        setLoading(false); // Set loading to false when request is completed
                    }
                }}
            >
                {({ handleSubmit, errors, touched }) => (
                    <form className="w-1/2" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <FormControl isInvalid={errors.pinValue && touched.pinValue}>
                                <p className="mb-4">Verification Code</p>
                                <VerificationInput
                                    validChars="0-9"
                                    inputProps={{inputMode: "numeric"}}
                                    value={verificationCode}
                                    onChange={handleChange}
                                    size="sm"
                                    classNames={{
                                        container: "container",
                                        character: "character",
                                        characterFilled: "character--filled"
                                    }}
                                />
                                {errors.pinValue && (
                                    <p className="text-red-500">{errors.pinValue}</p>
                                )}
                                <p></p>
                            </FormControl>

                            {/* Conditional rendering of loading spinner */}
                            <Button
                                bg={theme.purple}
                                _hover={{ bg: theme.onHoverPurple }}
                                color="#ffffff"
                                variant="solid"
                                type="submit"
                                size="sm"
                            >
                                {loading ? <Spinner size="sm" /> : "Verify"}
                            </Button>
                        </Stack>
                    </form>
                )}
            </Formik>
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={undefined}
                onClose={handleAlertClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Invalid Verification Code
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            The verification code you entered is invalid. Please try again.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={handleAlertClose}>
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
