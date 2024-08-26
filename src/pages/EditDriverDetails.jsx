import { useRef, useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
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
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    useDisclosure,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { axiosApi } from "../interceptor.js";
import './AddDriverDetails.css';
import emailsend from "../assets/images/emailsend.png";

export default function EditDriverDetails() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        status: true,
    });

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const response = await axiosApi.get(`https://localhost:7265/api/Driver/${userId}`);
                if (response.status === 200) {
                    const driverData = response.data;
                    // Format the date fields
                    driverData.dateOfBirth = driverData.dateOfBirth ? new Date(driverData.dateOfBirth).toISOString().split('T')[0] : '';
                    driverData.licenseExpiryDate = driverData.licenseExpiryDate ? new Date(driverData.licenseExpiryDate).toISOString().split('T')[0] : '';
                    setInitialValues(driverData);
                }
            } catch (error) {
                console.error("Failed to fetch driver data:", error);
                setModalMessage(`Failed to fetch driver data: ${error.message}`);
                onOpen();
            }
        };

        if (userId) {
            fetchDriverData();
        }
    }, [userId]);

    const validateForm = (values) => {
        const errors = {};
        const requiredFields = [
            'firstName',
            'lastName',
            'dateOfBirth',
            'nic',
            'driverLicenseNo',
            'licenseExpiryDate',
            'emailAddress',
            'phoneNo',
            'emergencyContact',
        ];

        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`;
            }
        });

        if (values.emailAddress && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.emailAddress)) {
            errors.emailAddress = 'Invalid email address';
        }

        return errors;
    };

    const breadcrumbs = [
        {label: "Driver", link: "/app/DriverDetails"},
        {label: "Driver Details", link: "/app/DriverDetails"},
        {label: "Edit Driver Details", link: `/app/EditDriverDetails/${userId}`},
    ];

    const handleSuccessModalClose = () => {
        setIsModalOpen(false);
        navigate("/app/DriverDetails");
    };

    const handleErrorModalClose = () => {
        onClose();
        setIsSubmitting(false);
    };

    const handleSubmit = async (values, actions) => {
        setIsSubmitting(true);
        try {
            const response = await axiosApi.put(`https://localhost:7265/api/Driver/${userId}`, values);
            if (response.status === 200) {
                setModalMessage('Driver updated successfully.');
                setIsModalOpen(true);
            } else {
                setModalMessage(response.data.error || 'Failed to update driver.');
                onOpen();
            }
        } catch (error) {
            setModalMessage(`Failed to update driver: ${error.message}`);
            onOpen();
        }
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        navigate("/app/DriverDetails");
    };

    return (
        <>
            <PageHeader title="Edit Driver Details" breadcrumbs={breadcrumbs}/>
            <Box className="mr-14">
                <Formik
                    initialValues={initialValues}
                    validate={validateForm}
                    onSubmit={handleSubmit}
                    enableReinitialize // Ensure Formik resets initial values when they change
                >
                    {({ errors, touched, isValid }) => (
                        <Form className="grid grid-cols-2 gap-x-12 gap-y-10 mt-8">
                            <div className="flex flex-col gap-3">
                                <p>First Name</p>
                                <FormControl isInvalid={errors.firstName && touched.firstName}>
                                    <Field
                                        as={Input}
                                        name="firstName"
                                        type="text"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
                                        placeholder="First Name"
                                    />
                                    <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Last Name</p>
                                <FormControl isInvalid={errors.lastName && touched.lastName}>
                                    <Field
                                        as={Input}
                                        name="lastName"
                                        type="text"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
                                        placeholder="Last Name"
                                    />
                                    <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Date of Birth</p>
                                <FormControl isInvalid={errors.dateOfBirth && touched.dateOfBirth}>
                                    <Field
                                        as={Input}
                                        name="dateOfBirth"
                                        type="date"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>National Identity Card No</p>
                                <FormControl isInvalid={errors.nic && touched.nic}>
                                    <Field
                                        as={Input}
                                        name="nic"
                                        type="text"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
                                        placeholder="NIC No"
                                    />
                                    <FormErrorMessage>{errors.nic}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Driver License No</p>
                                <FormControl isInvalid={errors.driverLicenseNo && touched.driverLicenseNo}>
                                    <Field
                                        as={Input}
                                        name="driverLicenseNo"
                                        type="text"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
                                        placeholder="Driver License No"
                                    />
                                    <FormErrorMessage>{errors.driverLicenseNo}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>License Expiry Date</p>
                                <FormControl isInvalid={errors.licenseExpiryDate && touched.licenseExpiryDate}>
                                    <Field
                                        as={Input}
                                        name="licenseExpiryDate"
                                        type="date"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <FormErrorMessage>{errors.licenseExpiryDate}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Contact Number</p>
                                <FormControl isInvalid={errors.phoneNo && touched.phoneNo}>
                                    <Field
                                        as={Input}
                                        name="phoneNo"
                                        type="tel"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
                                        placeholder="Contact Number"
                                    />
                                    <FormErrorMessage>{errors.phoneNo}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Blood Group</p>
                                <FormControl isInvalid={errors.bloodGroup && touched.bloodGroup}>
                                    <Field
                                        as={Select}
                                        name="bloodGroup"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
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
                                    </Field>
                                    <FormErrorMessage>{errors.bloodGroup}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Emergency Contact Number</p>
                                <FormControl isInvalid={errors.emergencyContact && touched.emergencyContact}>
                                    <Field
                                        as={Input}
                                        name="emergencyContact"
                                        type="tel"
                                        variant="filled"
                                        borderRadius="md"
                                        width="400px"
                                        placeholder="Emergency Contact Number"
                                    />
                                    <FormErrorMessage>{errors.emergencyContact}</FormErrorMessage>
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Email Address</p>
                                <FormControl isInvalid={errors.emailAddress && touched.emailAddress}>
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
                                <Field name="status">
                                    {({ field }) => (
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
                            <div className="flex justify-end gap-10 mr-10 mb-5 col-span-2">
                                <Button
                                    bg="gray.400"
                                    _hover={{ bg: "gray.500" }}
                                    color="#ffffff"
                                    variant="solid"
                                    w="180px"
                                    marginTop="0"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    bg={theme.purple}
                                    _hover={{ bg: theme.onHoverPurple }}
                                    color="#ffffff"
                                    variant="solid"
                                    w="180px"
                                    marginTop="0"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    isDisabled={!isValid}
                                >
                                    Save
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Box>

            <Modal isOpen={isModalOpen} onClose={handleSuccessModalClose} isCentered size='lg'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Success</ModalHeader>
                    <ModalBody className="text-center">
                        <img src={emailsend} className='m-auto' alt="email send" width="200" />
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
