import { useState } from "react";
import { FormControl, FormErrorMessage, FormLabel, Text } from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { IconButton, Input, InputGroup, InputRightElement, Stack, Button } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import theme from "../config/ThemeConfig.jsx";
import first from "../assets/images/login.png";
import {axiosApi} from "../interceptor.js";

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetClicked, setResetClicked] = useState(false);
    const [backendError, setBackendError] = useState("");

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleResetClick = () => {
        setResetClicked(true);
    };

    return (
        <>
            <p className="font-sans text-3xl text-[#393970]">Login</p>
            <img src={first} alt="login" width="300" height="300" />
            <Formik
                initialValues={{
                    username: "",
                    password: ""
                }}
                onSubmit={(values) => {
                    setLoading(true); // Set loading to true when submitting form

                    axiosApi.post('https://localhost:7265/api/Auth/login', {
                        username: values.username,
                        password: values.password
                    }, {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        }
                    })
                        .then(response => {
                            const data = response.data;
                            if (!data.status) {
                                if (data.message === "Unauthorized: Only Admin or Staff can login") {
                                    navigate("/unauthorized");
                                } else {
                                    setBackendError(data.message);
                                }
                            } else {
                                console.log('Login response:', data);

                                const accessToken = data.data?.accessToken;
                                const jobTitle = data.data?.jobTitle;
                                const userId = data.data?.userId;

                                console.log('AccessToken:', accessToken);
                                console.log('JobTitle:', jobTitle);
                                console.log('UserId:', userId);

                                if (jobTitle === "Admin" || jobTitle === "Staff") {
                                    sessionStorage.setItem('Username', values.username);
                                    sessionStorage.setItem('UserRole', jobTitle);

                                    if (userId !== undefined && userId !== null) {
                                        sessionStorage.setItem('UserId', userId.toString());
                                        console.log('UserId set in session storage:', userId);
                                    }
                                    localStorage.setItem('Token', accessToken);

                                    // Set isAdmin status in localStorage
                                    localStorage.setItem('isAdmin', jobTitle === "Admin");

                                    console.log('Session storage after login:', sessionStorage);

                                    let storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
                                    storedNotifications.forEach(notification => {
                                        // saveNotification(notification);
                                    });
                                    localStorage.removeItem('notifications');

                                    navigate('/app/Dashboard');
                                } else {
                                    navigate("/unauthorized");
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Login error:', error);
                            setBackendError('Login failed. Please try again.');
                        })
                        .finally(() => {
                            setLoading(false); // Set loading to false when request is completed
                        });
                }}
            >
                {({ handleSubmit, errors, touched }) => (
                    <form onSubmit={handleSubmit} className="w-2/5">
                        <Stack spacing={2}>
                            <FormControl isInvalid={errors.username && touched.username}>
                                <FormLabel htmlFor="username" fontSize="sm">Username</FormLabel>
                                <Field
                                    as={Input}
                                    id="username"
                                    name="username"
                                    type="text"
                                    variant="filled"
                                    placeholder="Username"
                                    fontSize="sm"
                                    size="sm"
                                    borderRadius="md"
                                    padding="2"
                                    validate={(value) => {
                                        if (!value) {
                                            return "Username is required.";
                                        }
                                    }}
                                />
                                <FormErrorMessage fontSize="xs">{errors.username}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.password && touched.password}>
                                <FormLabel htmlFor="password" fontSize="sm">Password</FormLabel>
                                <InputGroup>
                                    <Field
                                        as={Input}
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        variant="filled"
                                        placeholder="Password"
                                        fontSize="sm"
                                        size="sm"
                                        borderRadius="md"
                                        padding="2"
                                        validate={(value) => {
                                            if (!value) {
                                                return "Password is required.";
                                            }
                                        }}
                                    />
                                    <InputRightElement width="3rem">
                                        <IconButton
                                            h="1.3rem"
                                            size="xs"
                                            variant="ghost"
                                            onClick={handleShowPassword}
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            aria-label="password-icon"
                                            marginTop="5px"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
                            </FormControl>
                            <div className="flex justify-end">
                                {!resetClicked && (
                                    <Link to="/auth/ResetEmail" onClick={handleResetClick}>
                                        <Button variant="link" className="mb-4" fontSize="sm">
                                            Forgot Password
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            {backendError && (
                                <Text color="red.500" fontSize="xs" align="center">
                                    {backendError}
                                </Text>
                            )}
                            <Button
                                bg={theme.purple}
                                _hover={{ bg: theme.onHoverPurple }}
                                color="#ffffff"
                                variant="solid"
                                type="submit"
                                size="sm"
                                isLoading={loading}
                            >
                                Login
                            </Button>
                        </Stack>
                    </form>
                )}
            </Formik>
        </>
    );
}
