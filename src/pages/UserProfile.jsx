import { useState, useRef, useEffect } from 'react';
import {
    Text,
    Input,
    Button,
    Avatar,
    AvatarGroup,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineCamera, AiOutlineUser } from "react-icons/ai";

export default function UserProfile() {
    const navigate = useNavigate();
    const {isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose} = useDisclosure();
    const {isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose} = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [image, setImage] = useState("");
    const [isImageRemoved, setIsImageRemoved] = useState(false);
    const [userData, setUserData] = useState({
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        EmailAddress: "",
        PhoneNo: "",
        NIC: "",
        ProfilePicture: "",
    });

    const fetchUser = async () => {
        try {
            const username = sessionStorage.getItem("Username");
            if (username) {
                const response = await axios.get(`https://localhost:7265/api/Auth/userProfile?username=${username}`);
                const responseData = response.data;

                console.log(responseData);
                setUserData({
                    FirstName: responseData.firstName,
                    LastName: responseData.lastName,
                    DateOfBirth: responseData.dateOfBirth.split('T')[0], // Only take the date part
                    EmailAddress: responseData.emailAddress,
                    PhoneNo: responseData.phoneNo,
                    NIC: responseData.nic,
                    ProfilePicture: responseData.profilePicture,
                });
                setImage(responseData.profilePicture);
            } else {
                console.error("Username not found in session storage.");
            }
        } catch (error) {
            console.error("Error fetching User details:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            setImage(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (values) => {
        try {
            const username = sessionStorage.getItem("Username");
            const profilePicture = isImageRemoved ? "" : image;
            const response = await axios.put('https://localhost:7265/api/Auth/UpdateUser', {
                    Username: username,
                    FirstName: values.FirstName,
                    LastName: values.LastName,
                    DateOfBirth: values.DateOfBirth,
                    EmailAddress: values.EmailAddress,
                    PhoneNo: values.PhoneNo,
                    NIC: values.NIC,
                    ProfilePicture: profilePicture,
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            if (response.status === 200) {
                await fetchUser(); // Refresh user data after update
                setSuccessDialogMessage('User details updated successfully');
                onSuccessDialogOpen();
            } else {
                throw new Error('Failed to update User details');
            }
        } catch (error) {
            console.error('Error updating User details:', error);
            setDialogMessage(error.message || 'Failed to update User details');
            onDialogOpen();
        }
    };

    const handleRemoveImage = async () => {
        setIsImageRemoved(true);
        setImage("");
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        window.location.reload(); // Reload the page after success dialog closes
    };

    const handleCancel = () => {
        navigate('/app/Dashboard');
    };

    return (
        <>
            <Text fontSize="3xl" color="#393970" mb="7" fontFamily="sans-serif">
                User Profile
            </Text>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    FirstName: userData.FirstName ?? "",
                    LastName: userData.LastName ?? "",
                    DateOfBirth: userData.DateOfBirth ?? "",
                    EmailAddress: userData.EmailAddress ?? "",
                    PhoneNo: userData.PhoneNo ?? "",
                    NIC: userData.NIC ?? "",
                    ProfilePicture: userData.profilePicture ?? "",
                }}
                onSubmit={handleSubmit}
            >
                {({errors, touched}) => (
                    <Form>
                        <div className="flex flex-grow gap-8">
                            <div className="w-1/5">
                                <AvatarGroup size="2xl" mb="4" mt="8" ml="12">
                                    <div
                                        style={{
                                            position: "relative",
                                            display: "inline-block",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.firstChild.style.opacity = 0.8;
                                            e.currentTarget.lastChild.style.opacity = 0.8;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.firstChild.style.opacity = 1;
                                            e.currentTarget.lastChild.style.opacity = 0;
                                        }}
                                        onClick={handleAvatarClick}
                                    >
                                        <Avatar
                                            src={image ? `data:image/jpeg;base64,${image}` : undefined}
                                            size="2xl"
                                            bg={theme.purple}
                                            icon={<AiOutlineUser fontSize='2rem'/>}
                                            cursor="pointer"
                                            id="pro-pic"
                                            onMouseEnter={(e) => e.currentTarget.style.opacity = 0.5}
                                            onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                opacity: 0,
                                                transition: "opacity 0.8s ease",
                                            }}
                                        >
                                            <AiOutlineCamera size={26} onMouseEnter={() => {
                                                document.getElementById("pro-pic").style.opacity = 0.5;
                                            }}/>
                                        </div>
                                    </div>
                                </AvatarGroup>

                                <Input
                                    ref={fileInputRef}
                                    id="profilePicture"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{display: 'none'}}
                                />
                                {image && (
                                    <div className="flex justify-right">
                                        <Button
                                            mt="2"
                                            ml="6"
                                            size="sm"
                                            color={theme.purple}
                                            variant='link'
                                            w="180px"
                                            onClick={handleRemoveImage}
                                        >
                                            Remove Profile Image
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="w-4/5 flex flex-col">
                                <div className="flex gap-16 mt-6">
                                    <div className="w-2/5">
                                        <div className="mb-10">
                                            <p style={{marginBottom: "0.5rem"}}>First Name</p>
                                            <Field name="FirstName" validate={(value) => {
                                                let error;
                                                if (!value) {
                                                    error = "FirstName is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <div>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            variant="filled"
                                                            borderRadius="md"
                                                            px={3}
                                                            py={2}
                                                            mt={1}
                                                            width="320px"
                                                            size="sm"
                                                            id="FirstName"
                                                            placeholder="First Name"
                                                        />
                                                        {errors.FirstName && touched.FirstName && (
                                                            <div className="text-red-500">{errors.FirstName}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="mb-10">
                                            <p style={{marginBottom: "0.5rem"}}>Date of Birth</p>
                                            <Field style={{margintop: "0.5rem"}} name="DateOfBirth"
                                                   validate={(value) => {
                                                       let error;
                                                       if (!value) {
                                                           error = "Date of Birth is required.";
                                                       }
                                                       return error;
                                                   }}>
                                                {({field}) => (
                                                    <div>
                                                        <Input
                                                            {...field}
                                                            type="date"
                                                            variant="filled"
                                                            borderRadius="md"
                                                            px={3}
                                                            py={2}
                                                            mt={1}
                                                            size="sm"
                                                            width="320px"
                                                            id="DateofBirth"
                                                            placeholder="Date of Birth"
                                                        />
                                                        {errors.DateOfBirth && touched.DateOfBirth && (
                                                            <div className="text-red-500">{errors.DateOfBirth}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="mb-10">
                                            <p style={{marginBottom: "0.5rem"}}>Phone Number</p>
                                            <Field name="PhoneNo" validate={(value) => {
                                                let error;
                                                if (!value) {
                                                    error = "Phone No is required.";
                                                } else if (!/^\d{10}$/.test(value)) {
                                                    error = "Phone No must be 10 digits.";
                                                }
                                                return error;
                                            }}
                                            >
                                                {({field, form}) => (
                                                    <div>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            variant="filled"
                                                            borderRadius="md"
                                                            px={3}
                                                            py={2}
                                                            mt={1}
                                                            size="sm"
                                                            width="320px"
                                                            id="PhoneNo"
                                                            placeholder="Phone No"
                                                            maxLength="10"
                                                            onInput={(e) => {
                                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                            }}
                                                        />
                                                        {form.errors.PhoneNo && form.touched.PhoneNo && (
                                                            <div className="text-red-500">{form.errors.PhoneNo}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="w-2/5">
                                        <div className="mb-10">
                                            <p style={{marginBottom: "0.5rem"}}>Last Name</p>
                                            <Field name="LastName" validate={(value) => {
                                                let error;
                                                if (!value) {
                                                    error = "Last Name is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <div>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            variant="filled"
                                                            borderRadius="md"
                                                            px={3}
                                                            py={2}
                                                            mt={1}
                                                            size="sm"
                                                            width="320px"
                                                            id="LastName"
                                                            placeholder="Last Name"
                                                        />
                                                        {errors.LastName && touched.LastName && (
                                                            <div className="text-red-500">{errors.LastName}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="mb-10">
                                            <p style={{marginBottom: "0.5rem"}}>Email Address</p>
                                            <Field name="EmailAddress" validate={(value) => {
                                                let error;
                                                if (!value) {
                                                    error = "Email Address is required.";
                                                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                                    error = "Invalid email address.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <div>
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                            variant="filled"
                                                            borderRadius="md"
                                                            px={3}
                                                            py={2}
                                                            mt={1}
                                                            size="sm"
                                                            width="320px"
                                                            id="EmailAddress"
                                                            placeholder="Email Address"
                                                        />
                                                        {errors.EmailAddress && touched.EmailAddress && (
                                                            <div className="text-red-500">{errors.EmailAddress}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="mb-10">
                                            <p style={{marginBottom: "0.5rem"}}>NIC</p>
                                            <Field name="NIC" validate={(value) => {
                                                let error;
                                                if (!value) {
                                                    error = "NIC is required.";
                                                } else if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(value)) {
                                                    error = "Invalid NIC format.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <div>
                                                        <Input
                                                            {...field}
                                                            type="text"
                                                            variant="filled"
                                                            borderRadius="md"
                                                            px={3}
                                                            py={2}
                                                            mt={1}
                                                            size="sm"
                                                            width="320px"
                                                            id="NIC"
                                                            placeholder="NIC"
                                                        />
                                                        {errors.NIC && touched.NIC && (
                                                            <div className="text-red-500">{errors.NIC}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-5/6 flex justify-end gap-4 mt-20 mb-10">
                                    <Button
                                        bg="gray.400"
                                        _hover={{bg: "gray.500"}}
                                        color="#ffffff"
                                        variant="solid"
                                        w="150px"
                                        size="sm"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        bg={theme.purple}
                                        _hover={{bg: theme.onHoverPurple}}
                                        color="#ffffff"
                                        variant="solid"
                                        w="150px"
                                        size="sm"
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay/>
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="35%"
                    transform="translate(-50%, -50%)">
                    <AlertDialogHeader>Error</AlertDialogHeader>
                    <AlertDialogBody>
                        {dialogMessage}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={onDialogClose}>Close</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog isOpen={isSuccessDialogOpen} onClose={onSuccessDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay/>
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="35%"
                    transform="translate(-50%, -50%)"
                >
                    <AlertDialogHeader>Success</AlertDialogHeader>
                    <AlertDialogBody>
                        {successDialogMessage}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={handleSuccessDialogClose}>Ok</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
