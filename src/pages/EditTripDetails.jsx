import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
    Button,
    Checkbox,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Select,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { axiosApi } from "../interceptor.js";

export default function EditTripDetails() {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [vehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [NICs, setNICs] = useState([]);
    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        if (tripId) {
            fetchDriverNICs();
            fetchTripDetails();
            fetchVehicleRegNos();
        }
    }, [tripId]);


    const fetchVehicleRegNos = async () => {
        try {
            const response = await axiosApi.get("https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Vehicles");
            setVehicleRegNoDetails(response.data);
        } catch (error) {
            console.error("Error fetching vehicle registration numbers:", error);
        }
    };

    const fetchDriverNICs = async () => {
        try {
            const response = await axiosApi.get("https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Driver");
            console.log("Driver NICs fetched:", response.data); // Debugging line
            setNICs(response.data);
        } catch (error) {
            console.error("Error fetching driver NICs:", error);
        }
    };

    const fetchTripDetails = async () => {
        try {
            const response = await axiosApi.get(`https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Trip/${tripId}`);
            const data = response.data;
            data.date = data.date.split('T')[0];
            setTripDetails(data);
            console.log("Trip details fetched:", data); // Debugging line
        } catch (error) {
            console.error("Error fetching trip details:", error);
            setDialogMessage("Failed to fetch trip details.");
            onDialogOpen();
        }
    };

    const handleSubmit = async (values, { setFieldError }) => {
        try {
            const response = await axiosApi.put(`https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Trip/${tripId}`, values);

            if (response.status === 200) {
                setSuccessDialogMessage('Trip record updated successfully.');
                onSuccessDialogOpen();
            } else {
                throw new Error('Failed to update trip record.');
            }
        } catch (error) {
            console.error('Error updating trip record:', error);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setDialogMessage(errorMessage);
            } else {
                setDialogMessage('Failed to update trip record.');
            }
            onDialogOpen();
        }
    };

    const handleCancel = () => {
        navigate('/app/TripDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/TripDetails');
    };

    const breadcrumbs = [
        { label: "Trip", link: "/app/TripDetails" },
        { label: "Trip Details", link: "/app/TripDetails" },
        { label: "Edit Trip Details", link:  `/app/EditTripDetails/${tripId}` },
    ];

    if (!tripDetails) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="Edit Trip Details" breadcrumbs={breadcrumbs} />

            <Formik
                initialValues={{
                    vehicleId: tripDetails.vehicleId || "",
                    userId: tripDetails.userId || "",
                    date: tripDetails.date || "",
                    startTime: tripDetails.startTime || "",
                    endTime: tripDetails.endTime || "",
                    startMeterValue: tripDetails.startMeterValue || 0,
                    endMeterValue: tripDetails.endMeterValue || 0,
                    status: tripDetails.status || true,
                }}
                onSubmit={handleSubmit}
                validate={(values) => {
                    const errors = {};
                    if (!values.vehicleId) {
                        errors.vehicleId = "Vehicle is required.";
                    }
                    if (!values.userId) {
                        errors.userId = "Driver is required.";
                    }
                    if (!values.date) {
                        errors.date = "Date is required.";
                    }
                    return errors;
                }}
            >
                {({ errors, touched }) => (
                    <Form className="grid grid-cols-2 gap-10 mt-8">
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Registration No</p>
                            <Field name="vehicleId">
                                {({field}) => (
                                    <Select
                                        {...field}
                                        placeholder="Vehicle Registration No"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                    >
                                        {vehicleRegNoDetails.map((option, index) => (
                                            <option key={`${option.vehicleId}-${index}`} value={option.vehicleId}>
                                                {option.vehicleRegistrationNo}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </Field>
                            {errors.vehicleId && touched.vehicleId && (
                                <div className="text-red-500">{errors.vehicleId}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Driver NIC</p>
                            <Field name="userId">
                                {({field}) => (
                                    <Select
                                        {...field}
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                        placeholder="Driver NIC"
                                    >
                                        {NICs.map((nic, index) => (
                                            <option key={`${nic.userId}-${index}`} value={nic.userId}>
                                                {nic.nic}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </Field>
                            {errors.userId && touched.userId && (
                                <div className="text-red-500">{errors.userId}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Date</p>
                            <Field name="date">
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
                                    />
                                )}
                            </Field>
                            {errors.date && touched.date && (
                                <div className="text-red-500">{errors.date}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Start Time</p>
                            <Field name="startTime">
                                {({field}) => (
                                    <Input
                                        {...field}
                                        type="time"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                    />
                                )}
                            </Field>
                            {errors.startTime && touched.startTime && (
                                <div className="text-red-500">{errors.startTime}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>End Time</p>
                            <Field name="endTime">
                                {({field}) => (
                                    <Input
                                        {...field}
                                        type="time"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                    />
                                )}
                            </Field>
                            {errors.endTime && touched.endTime && (
                                <div className="text-red-500">{errors.endTime}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Start Meter Value</p>
                            <Field name="startMeterValue">
                                {({field}) => (
                                    <NumberInput
                                        {...field}
                                        variant="filled"
                                        min={0}
                                        width="400px"
                                        mt={1}
                                    >
                                        <NumberInputField
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            placeholder="00.00"
                                            step={0.01}
                                        />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper/>
                                            <NumberDecrementStepper/>
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>End Meter Value</p>
                            <Field name="endMeterValue">
                                {({field}) => (
                                    <NumberInput
                                        {...field}
                                        variant="filled"
                                        min={0}
                                        width="400px"
                                        mt={1}
                                    >
                                        <NumberInputField
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            placeholder="00.00"
                                            step={0.01}
                                        />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper/>
                                            <NumberDecrementStepper/>
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Field name="status">
                                {({field}) => (
                                    <Checkbox
                                        {...field}
                                        size="lg"
                                        defaultChecked={field.value}
                                        className="mt-8"
                                    >
                                        Is Active
                                    </Checkbox>
                                )}
                            </Field>
                        </div>
                        <div></div>
                        <div className="flex w-5/6 justify-end gap-10">
                            <Button
                                bg="gray.400"
                                _hover={{bg: "gray.500"}}
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
                                _hover={{bg: theme.onHoverPurple}}
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

            {isDialogOpen && <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay/>
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                >
                    <AlertDialogHeader>Error</AlertDialogHeader>
                    <AlertDialogBody>{dialogMessage}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={onDialogClose}>
                            Close
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>}

            {isSuccessDialogOpen && <AlertDialog isOpen={isSuccessDialogOpen} onClose={handleSuccessDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay />
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                >
                    <AlertDialogHeader>Success</AlertDialogHeader>
                    <AlertDialogBody>{successDialogMessage}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={handleSuccessDialogClose}>
                            Ok
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>}
        </>
    );
}
