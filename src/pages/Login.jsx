import { useState } from "react";
import { FormControl, FormErrorMessage, FormLabel, Text } from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { IconButton, Input, InputGroup, InputRightElement, Stack, Button } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import theme from "../config/ThemeConfig.jsx";
import first from "../assets/images/login.png";

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

    const saveNotification = (notification) => {
        if (localStorage.getItem('Token')) {
            const userId = sessionStorage.getItem('UserId');
            const username = sessionStorage.getItem('Username');

            if (!userId || !username) {
                console.error('User ID or Username not found in session storage');
                return;
            }

            const timestamp = new Date(notification.timestamp);
            if (isNaN(timestamp.getTime())) {
                console.error('Invalid timestamp value');
                return;
            }

            const fcmNotification = {
                UserId: parseInt(userId),
                UserName: username,
                Title: "User Login",  // You can adjust this as needed
                Message: notification.message,
                Date: timestamp.toISOString().split('T')[0],
                Time: timestamp.toTimeString().split(' ')[0],
                Status: false  // Assuming new notifications are unread
            };

            console.log('Sending notification:', fcmNotification);

            fetch('https://localhost:7265/api/Notification/save-notification', {
                method: 'POST',
                body: JSON.stringify(fcmNotification),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`
                }
            }).then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            }).then(data => {
                console.log('Notification saved:', data);
            }).catch(error => {
                console.error('Error saving notification:', error);
            });
        } else {
            // If user is not logged in, save to local storage as before
            let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            notifications.push(notification);
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
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
                    setLoading(true);
                    fetch('https://localhost:7265/api/Auth/login', {
                        method: 'POST',
                        body: JSON.stringify({
                            username: values.username,
                            password: values.password
                        }),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    }).then(response => response.json())
                        .then(data => {
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
                                    } else {
                                        console.error('UserId is undefined or null in the response');
                                    }

                                    sessionStorage.setItem('UserRole', jobTitle);
                                    localStorage.setItem('Token', accessToken);

                                    console.log('Session storage after login:', sessionStorage);

                                    saveNotification({
                                        message: `User ${values.username} logged in`,
                                        timestamp: new Date().toISOString()
                                    });

                                    let storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
                                    storedNotifications.forEach(notification => {
                                        saveNotification(notification);
                                    });
                                    localStorage.removeItem('notifications');

                                    navigate('/app/Dashboard');
                                } else {
                                    navigate("/unauthorized");
                                }
                            }
                        }).catch((error) => {
                        console.error('Login error:', error);
                        setBackendError('Login failed. Please try again.');
                    }).finally(() => {
                        setLoading(false);
                    });
                }}
            >
                {({ handleSubmit, errors, touched }) => (
                    <form onSubmit={handleSubmit} className="w-2/4">
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
                                            margin-top="5px"
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
