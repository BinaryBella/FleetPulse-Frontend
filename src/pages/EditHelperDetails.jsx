import {useEffect, useRef, useState} from "react";
import {Field, Form, Formik} from "formik";
import {useNavigate, useParams} from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    Input,
    Select,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import {axiosApi} from "../interceptor.js";
import './AddDriverDetails.css';

export default function EditHelperDetails() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        nic: "",
        emailAddress: "",
        phoneNo: "",
        emergencyContact: "",
        bloodGroup: "",
        status: true,
    });

    useEffect(() => {
        const fetchHelperData = async () => {
            if (!userId) {
                setModalMessage("Invalid user ID. Please try again.");
                onOpen();
                return;
            }

            try {
                const response = await axiosApi.get(` http://localhost:5173/api/Helper/${userId}`);
                if (response.status === 200) {
                    const helperData = response.data;
                    // Format the date fields
                    helperData.dateOfBirth = helperData.dateOfBirth ? new Date(helperData.dateOfBirth).toISOString().split('T')[0] : '';
                    helperData.licenseExpiryDate = helperData.licenseExpiryDate ? new Date(helperData.licenseExpiryDate).toISOString().split('T')[0] : '';
                    setInitialValues(helperData);
                }
            } catch (error) {
                console.error("Failed to fetch driver data:", error);
                setModalMessage(`Failed to fetch driver data: ${error.message}`);
                onOpen();
            }
        };

        if (userId) {
            fetchHelperData();
        } else {
            setModalMessage("Invalid user ID. Please try again.");
            onOpen();
        }
    }, [userId, onOpen]);

    const validateForm = (values) => {
        const errors = {};
        const requiredFields = [
            'firstName',
            'lastName',
            'dateOfBirth',
            'nic',
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

    const handleSubmit = async (values, actions) => {
        setIsSubmitting(true);
        try {
            const response = await axiosApi.put(` http://localhost:5173/api/Helper/${userId}`, values);
            if (response.status === 200) {
                setModalMessage('Helper details updated successfully!');
                navigate("/app/HelperDetails");
            } else {
                setModalMessage('Failed to update helper details.');
                onOpen();
            }
        } catch (error) {
            setModalMessage(`Failed to update helper details: ${error.message}`);
            onOpen();
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleCancel = () => {
        navigate("/app/HelperDetails");
    };

    return (
        <>
            <PageHeader title="Edit Helper Details" breadcrumbs={[
                {label: "Helper", link: "/app/HelperDetails"},
                {label: "Helper Details", link: "/app/HelperDetails"},
                {label: "Edit Helper Details", link: "/app/EditHelperDetails"},
            ]}/>
            <Box className="mr-14">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true} // Allows the form to update with fetched data
                    validate={validateForm}
                    onSubmit={handleSubmit}
                >
                    {({errors, touched, isValid, values, setFieldValue}) => (
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
                                        placeholder="Date of Birth"
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
                                <FormControl>
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
                                    {({field}) => (
                                        <Checkbox
                                            {...field}
                                            colorScheme="purple"
                                            size="lg"
                                            isChecked={values.status}
                                            onChange={(e) => setFieldValue('status', e.target.checked)}
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
                                    isDisabled={!isValid}
                                >
                                    Save
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Box>

            {isOpen && <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay/>

                <AlertDialogContent>
                    <AlertDialogHeader>Error</AlertDialogHeader>
                    <AlertDialogCloseButton/>
                    <AlertDialogBody>
                        {modalMessage}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Close
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>}
        </>
    );
}
