import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {useNavigate} from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
    Box,
    Button,
    Checkbox,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";
import PasswordStrengthBar from 'react-password-strength-bar';
import $ from "jquery";
import {axiosApi} from "../interceptor.js";
import './AddDriverDetails.css'
import emailsend from "../assets/images/emailsend.png";

export default function AddDriverDetails() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const onModalClose = () => setIsModalOpen(false);
    const [initialValues, setInitialValues] = useState({
        FirstName: "",
        LastName: "",
        DateOfBirth: "",
        NIC: "",
        DriverLicenseNo: "",
        LicenseExpiryDate: "",
        EmailAddress: "",
        PhoneNo: "",
        EmergencyContact: "",
        BloodGroup: "",
        UserName: "",
        Password: "",
        confirmPassword: "",
        Status: true,
    });

    const breadcrumbs = [
        {label: "Driver", link: "/app/DriverDetails"},
        {label: "Driver Details", link: "/app/DriverDetails"},
        {label: "Add Driver Details", link: "/app/AddDriverDetails"},
    ];

    useEffect(() => {
        // Simulated fetch function; replace with actual API call
        const fetchDriverData = async () => {
            try {
                // Replace with your API endpoint
                const response = await axiosApi.get("https://localhost:7265/api/Driver");
                if (response.status !== 200) {
                    throw new Error("Failed to fetch data");
                }
                const data = response.data;

                // Set initial form values from fetched data
                setInitialValues({
                    FirstName: data.firstName,
                    LastName: data.lastName,
                    DateOfBirth: data.dob,
                    NIC: data.nationalId,
                    DriverLicenseNo: data.driverLicenseNo,
                    LicenseExpiryDate: data.licenseExpiryDate,
                    EmailAddress: data.email,
                    PhoneNo: data.contactNo,
                    EmergencyContact: data.emergencyContactNo,
                    BloodGroup: data.bloodGroup,
                    UserName: data.username,
                    Password: data.password,
                    confirmPassword: data.confirmPassword,
                    Status: data.isActive,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error state or show an error message
            }
        };

        // Call fetch function when component mounts
        fetchDriverData();
    }, []);

    useEffect(() => {
        $(".pwd-meter > div").children().each(function () {
            $(this).css({"height": "2px", "border-radius": "5px"})
        });
    }, []);

    const handleSuccessModalClose = () => {
        setIsModalOpen(false);
        navigate("/app/DriverDetails");
    };
    const handleSubmit = async (values, actions) => {
        try {
            const response = await axiosApi.post("https://localhost:7265/api/Driver", values);

            if (response.status === 201) {
                setModalMessage(`Driver added successfully. User credentials have been sent!`);
                setIsModalOpen(true);
                actions.resetForm();
            } else {
                throw new Error('Failed to add driver');
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
                    <Tabs>
                        <TabList>
                            <Tab _selected={{color: 'white', bg: theme.purple}}>Contact Info</Tab>
                            <Tab _selected={{color: 'white', bg: theme.purple}}>Account Info</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                                    {({errors, touched}) => (
                                        <Form className="grid grid-cols-2 gap-x-12 gap-y-10 mt-8">
                                            <div className="flex flex-col gap-3">
                                                <p>First Name</p>
                                                <Field name="FirstName">
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
                                                            id="FirstName"
                                                            placeholder="First Name"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.FirstName && touched.FirstName && (
                                                    <div className="text-red-500">{errors.FirstName}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Last Name</p>
                                                <Field name="LastName">
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
                                                            id="LastName"
                                                            placeholder="Last Name"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.LastName && touched.LastName && (
                                                    <div className="text-red-500">{errors.LastName}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Date of Birth</p>
                                                <Field name="DateOfBirth">
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
                                                            id="DateOfBirth"
                                                            max={new Date().toISOString().split('T')[0]}
                                                            placeholder="Date of Birth"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.DateOfBirth && touched.DateOfBirth && (
                                                    <div className="text-red-500">{errors.DateOfBirth}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>National Identity Card No</p>
                                                <Field name="NIC">
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
                                                            id="NIC"
                                                            placeholder="NIC No"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.NIC && touched.NIC && (
                                                    <div className="text-red-500">{errors.NIC}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Driver License No</p>
                                                <Field name="DriverLicenseNo">
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
                                                            id="DriverLicenseNo"
                                                            placeholder="Driver License No"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.DriverLicenseNo && touched.DriverLicenseNo && (
                                                    <div className="text-red-500">{errors.DriverLicenseNo}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>License Expiry Date</p>
                                                <Field name="LicenseExpiryDate">
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
                                                            id="LicenseExpiryDate"
                                                            min={new Date().toISOString().split('T')[0]}
                                                            placeholder="License Expiry Date"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.LicenseExpiryDate && touched.LicenseExpiryDate && (
                                                    <div className="text-red-500">{errors.LicenseExpiryDate}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Contact Number</p>
                                                <Field name="PhoneNo">
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
                                                            id="PhoneNo"
                                                            placeholder="Contact Number"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.PhoneNo && touched.PhoneNo && (
                                                    <div className="text-red-500">{errors.PhoneNo}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Blood Group</p>
                                                <Field name="BloodGroup">
                                                    {({field}) => (
                                                        <Select
                                                            {...field}
                                                            variant="filled"
                                                            borderRadius="md"
                                                            px={3}
                                                            py={2}
                                                            mt={1}
                                                            width="400px"
                                                            id="BloodGroup"
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
                                                {errors.BloodGroup && touched.BloodGroup && (
                                                    <div className="text-red-500">{errors.BloodGroup}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Emergency Contact Number</p>
                                                <Field name="EmergencyContact">
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
                                                            id="EmergencyContact"
                                                            placeholder="Emergency Contact Number"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.EmergencyContact && touched.EmergencyContact && (
                                                    <div className="text-red-500">{errors.EmergencyContact}</div>
                                                )}
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </TabPanel>
                            <TabPanel>
                                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                                    {({errors, touched,values}) => (
                                        <Form className="grid grid-cols-2 gap-x-12 gap-y-10 mt-8">
                                            <div className="flex flex-col gap-3">
                                                <p>Username</p>
                                                <Field name="UserName">
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
                                                            id="UserName"
                                                            placeholder="Username"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.UserName && touched.UserName && (
                                                    <div className="text-red-500">{errors.UserName}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Email Address</p>
                                                <Field name="EmailAddress">
                                                    {({field}) => (
                                                        <Input
                                                            {...field}
                                                            type="email"
                                                            variant="filled"
                                                            borderRadius="md"
                                                            px={3}
                                                            py={2}
                                                            mt={1}
                                                            width="400px"
                                                            id="EmailAddress"
                                                            placeholder="Email Address"
                                                        />
                                                    )}
                                                </Field>
                                                {errors.EmailAddress && touched.EmailAddress && (
                                                    <div className="text-red-500">{errors.EmailAddress}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Password</p>
                                                <Field name="password">
                                                    {({field}) => (
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                type={showPassword ? "text" : "password"}
                                                                variant="filled"
                                                                borderRadius="md"
                                                                px={3}
                                                                py={2}
                                                                mt={1}
                                                                width="400px"
                                                                id="password"
                                                                placeholder="Password"
                                                                pr="4.5rem"
                                                            />

                                                                <IconButton
                                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                                    icon={showPassword ? <ViewOffIcon/> : <ViewIcon/>}
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    position="absolute"
                                                                    right="5px"
                                                                    top="50%"
                                                                    transform="translateY(-50%)"
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    marginRight="280px"
                                                                />

                                                        </div>
                                                    )}
                                                </Field>
                                                <PasswordStrengthBar className="pwd-meter w-7/12"  password={values.password}/>
                                                {errors.Password && touched.Password && (
                                                    <div className="text-red-500">{errors.Password}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <p>Confirm Password</p>
                                                <Field name="confirmPassword">
                                                    {({field}) => (
                                                        <div>
                                                            <InputGroup>
                                                                <Input
                                                                    {...field}
                                                                    type={showPassword ? "text" : "password"}
                                                                    variant="filled"
                                                                    borderRadius="md"
                                                                    width="400px"
                                                                    id="confirmPassword"
                                                                    placeholder="Confirm Password"
                                                                    pr={0}
                                                                />
                                                                <InputRightElement>
                                                                    <IconButton
                                                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                                                            icon={showPassword ? <ViewOffIcon/> :
                                                                                <ViewIcon/>}
                                                                            onClick={() => setShowPassword(!showPassword)}
                                                                            position="absolute"
                                                                            right="5px"
                                                                            top="50%"
                                                                            transform="translateY(-50%)"
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            marginRight="280px"
                                                                        />
                                                                </InputRightElement>
                                                            </InputGroup>
                                                        </div>
                                                    )}
                                                </Field>
                                                {errors.confirmPassword && touched.confirmPassword && (
                                                    <div className="text-red-500">{errors.confirmPassword}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <Field name="Status">
                                                    {({field}) => (
                                                        <Checkbox
                                                            {...field}
                                                            colorScheme="purple"
                                                            size="lg"
                                                            id="Status"
                                                            defaultChecked={initialValues.Status}
                                                        >
                                                            Active
                                                        </Checkbox>
                                                    )}
                                                </Field>
                                                {errors.Status && touched.Status && (
                                                    <div className="text-red-500">{errors.Status}</div>
                                                )}
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

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
                        >
                            Save
                        </Button>
                    </div>
                </Box>


            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Success</ModalHeader>
                    <ModalBody>
                        {/* eslint-disable-next-line react/jsx-no-undef */}
                        <img src={emailsend} alt="email send" width="300" height="300"/>
                        <p>{modalMessage}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={handleSuccessModalClose}>
                            Ok
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
