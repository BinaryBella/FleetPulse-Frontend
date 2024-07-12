import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
    Button,
    Checkbox,
    Input,
    Select,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import theme from "../config/ThemeConfig.jsx";


export default function AddDriverDetails() {
    const navigate = useNavigate();
    const {
        isOpen: isDialogOpen,
        onOpen: onDialogOpen,
        onClose: onDialogClose,
    } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
        { label: "Driver", link: "/" },
        { label: "Driver Details", link: "/app/DriverDetails" },
        { label: "Add Driver Details", link: "/app/AddDriverDetails" },
    ];

    useEffect(() => {
        // Simulated fetch function; replace with actual API call
        const fetchDriverData = async () => {
            setIsLoading(true);
            try {
                // Replace with your API endpoint
                const response = await fetch("https://localhost:7265/api/Driver");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();

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
            } finally {
                setIsLoading(false);
            }
        };

        // Call fetch function when component mounts
        fetchDriverData();
    }, []);

    const validationSchema = Yup.object().shape({
        FirstName: Yup.string().required("First Name is required"),
        LastName: Yup.string().required("Last Name is required"),
        DateOfBirth: Yup.date().required("Date of Birth is required"),
        NIC: Yup.string().required("NIC is required"),
        DriverLicenseNo: Yup.string().required("Driver License No is required"),
        LicenseExpiryDate: Yup.date().required("License Expiry Date is required"),
        EmailAddress: Yup.string()
            .email("Invalid email")
            .required("Email Address is required"),
        PhoneNo: Yup.string().required("Contact Number is required"),
        EmergencyContact: Yup.string().required("Emergency Contact No is required"),
        BloodGroup: Yup.string().required("Blood Group is required"),
        UserName: Yup.string().required("Username is required"),
        Password: Yup.string()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("Password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleSubmit = async (values, actions) => {
        try {
            console.log(values);

            const response = await fetch("https://localhost:7265/api/Driver", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                setDialogMessage("Driver details saved successfully.");
                onDialogOpen();

                // Reset form after successful submission
                actions.resetForm();
            } else {
                setDialogMessage("Failed to save driver details.");
                onDialogOpen();
            }
        } catch (error) {
            // Handle errors (simulated with dialog for demo)
            setDialogMessage("Failed to save driver details.");
            onDialogOpen();
        }
    };

    const handleCancel = () => {
        navigate("/app/DriverDetails");
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate("/app/DriverDetails");
    };

    return (
        <>
            <PageHeader title="Add Driver Details" breadcrumbs={breadcrumbs} />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="grid grid-cols-2 gap-10 mt-8">
                            <div className="flex flex-col gap-3">
                                <p>First Name</p>
                                <Field name="FirstName">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="date"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
                                            id="DateOfBirth"
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
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="date"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
                                            id="LicenseExpiryDate"
                                            placeholder="License Expiry Date"
                                        />
                                    )}
                                </Field>
                                {errors.LicenseExpiryDate && touched.LicenseExpiryDate && (
                                    <div className="text-red-500">{errors.LicenseExpiryDate}</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Email Address</p>
                                <Field name="EmailAddress">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                <p>Contact Number</p>
                                <Field name="PhoneNo">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="tel"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                <p>Emergency Contact No</p>
                                <Field name="EmergencyContact">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="tel"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
                                            id="EmergencyContact"
                                            placeholder="Emergency Contact No"
                                        />
                                    )}
                                </Field>
                                {errors.EmergencyContact && touched.EmergencyContact && (
                                    <div className="text-red-500">{errors.EmergencyContact}</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Blood Group</p>
                                <Field name="BloodGroup">
                                    {({ field }) => (
                                        <Select
                                            {...field}
                                            variant="filled"
                                            borderRadius="md"
                                            width="500px"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            icon={<MdArrowDropDown />}
                                        >
                                            <option value="A+">A+</option>
                                            <option value="B+">B+</option>
                                            <option value="AB+">AB+</option>
                                            <option value="O+">O+</option>
                                            <option value="A-">A-</option>
                                            <option value="B-">B-</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O-">O-</option>
                                        </Select>
                                    )}
                                </Field>
                                {errors.BloodGroup && touched.BloodGroup && (
                                    <div className="text-red-500">{errors.BloodGroup}</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Username</p>
                                <Field name="UserName">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                <p>Password</p>
                                <Field name="Password">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="password"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
                                            id="Password"
                                            placeholder="Password"
                                        />
                                    )}
                                </Field>
                                {errors.Password && touched.Password && (
                                    <div className="text-red-500">{errors.Password}</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Confirm Password</p>
                                <Field name="confirmPassword">
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            type="password"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
                                            id="confirmPassword"
                                            placeholder="Confirm Password"
                                        />
                                    )}
                                </Field>
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <div className="text-red-500">{errors.confirmPassword}</div>
                                )}
                            </div>
                            {/* Checkbox for Is Active */}
                            <div className="flex flex-col gap-3">
                                <Checkbox name="Status" size="lg" defaultChecked>
                                    Is Active
                                </Checkbox>
                            </div>
                            <div className="flex w-5/6 justify-end gap-10">
                                <Button
                                    bg="gray.400"
                                    _hover={{ bg: "gray.500" }}
                                    color="#ffffff"
                                    variant="solid"
                                    w="230px"
                                    marginTop="10"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    bg={theme.purple}
                                    _hover={{ bg: theme.onHoverPurple }}
                                    color="#ffffff"
                                    variant="solid"
                                    w="230px"
                                    marginTop="10"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}

            {/* Dialog for showing error message */}
            <AlertDialog
                isOpen={isDialogOpen}
                onClose={onDialogClose}
                motionPreset="slideInBottom"
            >
                <AlertDialogOverlay />
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="35%"
                    transform="translate(-50%, -50%)"
                >
                    <AlertDialogHeader>Success</AlertDialogHeader>
                    <AlertDialogBody>{dialogMessage}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={onDialogClose}>
                            Ok
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
