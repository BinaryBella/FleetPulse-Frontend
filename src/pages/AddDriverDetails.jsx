import React, {useRef, useState} from "react";
import {Field, Form, Formik} from "formik";
import {useNavigate} from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, useDisclosure,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import PasswordStrengthBar from 'react-password-strength-bar';
import {axiosApi} from "../interceptor.js";
import './AddDriverDetails.css'
import emailsend from "../assets/images/emailsend.png";
import PropTypes from "prop-types";

const PasswordField = ({fieldId, label, showPassword, handleShowPassword, placeholder, error}) => (
    <FormControl isInvalid={!!error} width="400px">
        <FormLabel htmlFor={fieldId}>{label}</FormLabel>
        <InputGroup>
            <Field
                as={Input}
                id={fieldId}
                name={fieldId}
                type={showPassword ? "text" : "password"}
                variant="filled"
                placeholder={placeholder}
                borderRadius="md"
            />
            <InputRightElement>
                <IconButton
                    variant="ghost"
                    onClick={handleShowPassword}
                    icon={showPassword ? <ViewOffIcon/> : <ViewIcon/>}
                    aria-label="password-icon"
                />
            </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
);

PasswordField.propTypes = {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    showPassword: PropTypes.bool.isRequired,
    handleShowPassword: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string
};

export default function AddDriverDetails() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onModalClose = () => setIsModalOpen(false);
    const cancelRef = useRef();
    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        nic: "",
        driverLicenseNo: "",
        licenseExpiryDate: "",
        emailAddress: "",
        phoneNo: "",
        emergencyContact: "",
        bloodGroup: "",
        username: "",
        password: "",
        confirmPassword: "",
        status: true,
    });

    const validateContactInfo = (values) => {
        const errors = {};
        const requiredFields = [
            'firstName',
            'lastName',
            'dateOfBirth',
            'nic',
            'driverLicenseNo',
            'licenseExpiryDate',
            'phoneNo',
            'emergencyContact',
        ];

        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`;
            }
        });

        return errors;
    };


    const validateAccountInfo = (values) => {
        const errors = {};
        if (!values.username) errors.username = 'Username is required';
        if (!values.emailAddress) errors.emailAddress = 'Email is required';
        if (!values.password) errors.password = 'Password is required';
        if (!values.confirmPassword) errors.confirmPassword = 'Confirm password is required';
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    };

    const breadcrumbs = [
        {label: "Driver", link: "/app/DriverDetails"},
        {label: "Driver Details", link: "/app/DriverDetails"},
        {label: "Add Driver Details", link: "/app/AddDriverDetails"},
    ];

    const handleSuccessModalClose = () => {
        setIsModalOpen(false);
        navigate("/app/DriverDetails");
    };

    const handleErrorModalClose = () => {
        setIsModalOpen(false);
        setIsSubmitting(false);
        onClose();
    }

    const handleTabsChange = (index) => {
        setActiveTab(index)
    }

    const handleShowPassword = (setter) => () => setter(prev => !prev);

    const handleSubmit = async (values, actions) => {
        setIsSubmitting(true);
        const allValues = Object.keys(values).reduce((merged, key) => {
            merged[key] = formData[key] || values[key];
            return merged;
        }, {});

        try {
            const response = await axiosApi.post('https://localhost:7265/api/Driver', allValues);
            console.log(response)
            if (response.status === 200) {
                if (response.data.status) {
                    setModalMessage('Driver added successfully. User credentials have been sent!');
                    setIsModalOpen(true);
                } else {
                    setModalMessage(response.data.error);
                    onOpen();
                    setIsErrorModalOpen(true);
                }
            }
        } catch (error) {
            setModalMessage(`Failed to add driver: ${error.message}`);
            setIsModalOpen(true);
        }
    };

    const handleCancel = () => {
        navigate("/app/DriverDetails");
    };

    return (
        <>
            <PageHeader title="Add Driver Details" breadcrumbs={breadcrumbs}/>
            <Box className="mr-14">
                <Tabs index={activeTab} onChange={handleTabsChange}>
                    <TabList>
                        <Tab _selected={{color: 'white', bg: theme.purple}}>Contact Info</Tab>
                        <Tab _selected={{color: 'white', bg: theme.purple}}>Account Info</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Formik
                                initialValues={initialValues}
                                validate={validateContactInfo}
                                onSubmit={(values) => {
                                    setFormData(prevData => ({ ...prevData, ...values }));
                                    console.log(formData);
                                    setActiveTab(1);
                                }}
                            >
                                {({errors, touched, isValid}) => (
                                    <Form className="grid grid-cols-2 gap-x-12 gap-y-10 mt-8">
                                        <div className="flex flex-col gap-3">
                                            <p>First Name</p>
                                            <Field name="firstName" validate={value => {
                                                let error;
                                                if (!value) {
                                                    error = "First Name is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="firstName"
                                                        placeholder="First Name"
                                                    />
                                                )}
                                            </Field>
                                            {errors.firstName && touched.firstName && (
                                                <div className="text-red-500">{errors.firstName}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p>Last Name</p>
                                            <Field name="lastName" validate={value => {
                                                let error;
                                                if (!value) {
                                                    error = "Last Name is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="lastName"
                                                        placeholder="Last Name"
                                                    />
                                                )}
                                            </Field>
                                            {errors.lastName && touched.lastName && (
                                                <div className="text-red-500">{errors.lastName}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p>Date of Birth</p>
                                            <Field name="dateOfBirth" validate={value => {
                                                let error;
                                                if (!value) {
                                                    error = "Date of Birth is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <Input
                                                        {...field}
                                                        type="date"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="dateOfBirth"
                                                        max={new Date().toISOString().split('T')[0]}
                                                        placeholder="Date of Birth"
                                                    />
                                                )}
                                            </Field>
                                            {errors.dateOfBirth && touched.dateOfBirth && (
                                                <div className="text-red-500">{errors.dateOfBirth}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p>National Identity Card No</p>
                                            <Field name="nic" validate={value => {
                                                let error;
                                                if (!value) {
                                                    error = "NIC is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="nic"
                                                        placeholder="NIC No"
                                                    />
                                                )}
                                            </Field>
                                            {errors.nic && touched.nic && (
                                                <div className="text-red-500">{errors.nic}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p>Driver License No</p>
                                            <Field name="driverLicenseNo" validate={value => {
                                                let error;
                                                if (!value) {
                                                    error = "License Number is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="driverLicenseNo"
                                                        placeholder="Driver License No"
                                                    />
                                                )}
                                            </Field>
                                            {errors.driverLicenseNo && touched.driverLicenseNo && (
                                                <div className="text-red-500">{errors.driverLicenseNo}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p>License Expiry Date</p>
                                            <Field name="licenseExpiryDate" validate={value => {
                                                let error;
                                                if (!value) {
                                                    error = "License Expiry Date is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <Input
                                                        {...field}
                                                        type="date"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="licenseExpiryDate"
                                                        min={new Date().toISOString().split('T')[0]}
                                                        placeholder="License Expiry Date"
                                                    />
                                                )}
                                            </Field>
                                            {errors.licenseExpiryDate && touched.licenseExpiryDate && (
                                                <div className="text-red-500">{errors.licenseExpiryDate}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p>Contact Number</p>
                                            <Field name="phoneNo" validate={value => {
                                                let error;
                                                if (!value) {
                                                    error = "Contact Number is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="phoneNo"
                                                        placeholder="Contact Number"
                                                    />
                                                )}
                                            </Field>
                                            {errors.phoneNo && touched.phoneNo && (
                                                <div className="text-red-500">{errors.phoneNo}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p>Blood Group</p>
                                            <Field name="bloodGroup">
                                                {({field}) => (
                                                    <Select
                                                        {...field}
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="bloodGroup"
                                                        placeholder="Select Blood Group"
                                                    >
                                                        <option value="A+">A+</option>
                                                        <option value="A-">A-</option>
                                                        <option value="B+">B+</option>
                                                        <option value="B-">B-</option>
                                                        <option value="O+">O+</option>
                                                        <option value="O-">O-</option>
                                                        <option value="AB+">AB+</option>
                                                        <option value="AB-">AB-</option>
                                                    </Select>
                                                )}
                                            </Field>
                                            {errors.bloodGroup && touched.bloodGroup && (
                                                <div className="text-red-500">{errors.bloodGroup}</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <p>Emergency Contact Number</p>
                                            <Field name="emergencyContact" validate={value => {
                                                let error;
                                                if (!value) {
                                                    error = "Emergency Contact is required.";
                                                }
                                                return error;
                                            }}>
                                                {({field}) => (
                                                    <Input
                                                        {...field}
                                                        type="tel"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        id="emergencyContact"
                                                        placeholder="Emergency Contact Number"
                                                    />
                                                )}
                                            </Field>
                                            {errors.emergencyContact && touched.emergencyContact && (
                                                <div className="text-red-500">{errors.emergencyContact}</div>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-10 mr-10 mb-10">
                                            <Button
                                                bg="gray.400"
                                                _hover={{bg: "gray.500"}}
                                                color="#ffffff"
                                                variant="solid"
                                                w="180px"
                                                marginTop="10"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                bg={theme.purple}
                                                _hover={{bg: theme.onHoverPurple}}
                                                color="#ffffff"
                                                variant="solid"
                                                w="180px"
                                                marginTop="10"
                                                type="submit"
                                                isDisabled={!isValid}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </TabPanel>
                        <TabPanel>
                            <Formik
                                initialValues={{...initialValues, ...formData}}
                                validate={validateAccountInfo}
                                onSubmit={handleSubmit}
                            >
                                {({errors, touched, values}) => (
                                    <Form className="grid grid-cols-2 gap-x-12 gap-y-10 mt-8">
                                        <div className="flex flex-col gap-3">
                                            <FormControl isInvalid={errors.username && touched.username}>
                                                <FormLabel>Username</FormLabel>
                                                <Field
                                                    as={Input}
                                                    name="username"
                                                    type="text"
                                                    variant="filled"
                                                    borderRadius="md"
                                                    width="400px"
                                                    placeholder="Username"
                                                />
                                                <FormErrorMessage>{errors.username}</FormErrorMessage>
                                            </FormControl>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <FormControl isInvalid={errors.emailAddress && touched.emailAddress}>
                                                <FormLabel>Email Address</FormLabel>
                                                <Field
                                                    as={Input}
                                                    name="emailAddress"
                                                    type="email"
                                                    variant="filled"
                                                    borderRadius="md"
                                                    width="400px"
                                                    placeholder="Email Address"
                                                />
                                                <FormErrorMessage>{errors.emailAddress}</FormErrorMessage>
                                            </FormControl>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <PasswordField
                                                fieldId="password"
                                                label="Password"
                                                showPassword={showPassword}
                                                handleShowPassword={handleShowPassword}
                                                placeholder="Password"
                                                error={errors.password}
                                            />
                                            <PasswordStrengthBar className='pwd-meter' password={values.password} />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <PasswordField
                                                fieldId="confirmPassword"
                                                label="Confirm Password"
                                                showPassword={showPassword}
                                                handleShowPassword={handleShowPassword}
                                                placeholder="Confirm Password"
                                                error={errors.confirmPassword}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Field name="status">
                                                {({field}) => (
                                                    <Checkbox
                                                        {...field}
                                                        colorScheme="purple"
                                                        size="lg"
                                                        defaultChecked={initialValues.status}
                                                    >
                                                        Active
                                                    </Checkbox>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="flex justify-end gap-10 mr-10 mb-10">
                                            <Button
                                                bg="gray.400"
                                                _hover={{bg: "gray.500"}}
                                                color="#ffffff"
                                                variant="solid"
                                                w="180px"
                                                marginTop="10"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                bg={theme.purple}
                                                _hover={{bg: theme.onHoverPurple}}
                                                color="#ffffff"
                                                variant="solid"
                                                w="180px"
                                                marginTop="10"
                                                type="submit"
                                                isLoading={isSubmitting}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>

                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>


            <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered size='lg'>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Success</ModalHeader>
                    <ModalBody className="text-center">
                        <img src={emailsend} className='m-auto' alt="email send" width="200"/>
                        <p>{modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg={theme.purple} width="100px" mt={10} color="#FFFFFF" onClick={handleSuccessModalClose}>
                            Ok
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent>
                    <AlertDialogHeader>Error</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {modalMessage}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} width="100px" color="#FFFFFF" onClick={handleErrorModalClose}>
                            Ok
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
