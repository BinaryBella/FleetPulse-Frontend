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
    Select
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
    console.log('tripId:', tripId); // Debugging statement

    const breadcrumbs = [
        { label: 'Trips', link: '/app/TripDetails' },
        { label: 'Trip Details', link: '/app/TripDetails' },
        { label: 'Edit Trip Details', link: `/app/EditTripDetails/${tripId}` }
    ];

    const fetchVehicleRegNos = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Vehicles");
            setVehicleRegNoDetails(response.data);
        } catch (error) {
            console.error("Error fetching vehicle registration numbers:", error);
        }
    };

    const fetchDriverNICs = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Auth/drivers/nics");
            setNICs(response.data);
        } catch (error) {
            console.error("Error fetching driver NICs:", error);
        }
    };

    const fetchTripDetails = async () => {
        if (!tripId) {
            console.error('tripId is undefined');
            return;
        }
        try {
            const response = await axiosApi.get(`https://localhost:7265/api/Trip/${tripId}`);
            setTripDetails(response.data);
        } catch (error) {
            console.error("Error fetching trip details:", error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const response = await axiosApi.put(`https://localhost:7265/api/Trip/${tripId}`, {
                vehicleRegistrationNo: values.vehicleRegistrationNo,
                nic: values.nic,
                Date: values.Date,
                StartTime: values.StartTime,
                EndTime: values.EndTime,
                StartMeterValue: values.StartMeterValue,
                EndMeterValue: values.EndMeterValue,
                IsActive: values.IsActive
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setSuccessDialogMessage('Trip record updated successfully.');
                onSuccessDialogOpen();
            } else {
                throw new Error('Failed to update trip record.');
            }
        } catch (error) {
            console.error('Error updating trip record:', error);
            if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.vehicleId) {
                setDialogMessage(error.response.data.errors.vehicleId[0]);
            } else if (error instanceof TypeError) {
                setDialogMessage('Failed to connect to the server.');
            } else {
                setDialogMessage(error.message || 'Failed to update trip record.');
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



    useEffect(() => {
        console.log('tripId:', tripId); // Debugging statement
        if (tripId) {
            fetchDriverNICs();
            fetchTripDetails();
        } else {
            console.error('tripId is undefined');
        }
    }, [tripId]);


    if (!tripDetails) {
        return <div>Loading...</div>; // Show a loading indicator while fetching trip details
    }

    return (
        <>
            <PageHeader title="Edit Trip Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={{
                    vehicleRegistrationNo: tripDetails.vehicleRegistrationNo || "",
                    nic: tripDetails.nic || "",
                    Date: tripDetails.Date || "",
                    StartTime: tripDetails.StartTime || "",
                    EndTime: tripDetails.EndTime || "",
                    StartMeterValue: tripDetails.StartMeterValue || 0,
                    EndMeterValue: tripDetails.EndMeterValue || 0,
                    IsActive: tripDetails.IsActive || true
                }}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="grid grid-cols-2 gap-10 mt-8">
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Registration No</p>
                            <Field name="vehicleRegistrationNo" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "Vehicle Registration No is required.";
                                }
                                return error;
                            }}>
                                {({ field }) => (
                                    <div>
                                        <Select
                                            {...field}
                                            placeholder='Vehicle Registration No'
                                            size='md'
                                            variant='filled'
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                        >
                                            {vehicleRegNoDetails.map((option, index) => (
                                                <option key={index} value={option.id}>
                                                    {option.vehicleRegistrationNo}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.vehicleRegistrationNo && touched.vehicleRegistrationNo && (
                                            <div className="text-red-500">{errors.vehicleRegistrationNo}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <Field name="nic">
                            {({ field }) => (
                                <div className="flex flex-col gap-3">
                                    <p>Driver NIC</p>
                                    <Select
                                        {...field}
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                        placeholder="NIC"
                                    >
                                        {NICs.map((nic) => (
                                            <option key={nic} value={nic}>
                                                {nic}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            )}
                        </Field>
                        <div className="flex flex-col gap-3">
                            <p>Date</p>
                            <Field name="Date" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "Date is required.";
                                }
                                return error;
                            }}>
                                {({ field }) => (
                                    <div>
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
                                        {errors.Date && touched.Date && (
                                            <div className="text-red-500">{errors.Date}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Start Time</p>
                            <Field name="StartTime" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "Start time is required.";
                                }
                                return error;
                            }}>
                                {({ field }) => (
                                    <div>
                                        <Input
                                            {...field}
                                            type="time"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                            placeholder="Start Time"
                                        />
                                        {errors.StartTime && touched.StartTime && (
                                            <div className="text-red-500">{errors.StartTime}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>End Time</p>
                            <Field name="EndTime" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "End time is required.";
                                }
                                return error;
                            }}>
                                {({ field }) => (
                                    <div>
                                        <Input
                                            {...field}
                                            type="time"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                            placeholder="End Time"
                                        />
                                        {errors.EndTime && touched.EndTime && (
                                            <div className="text-red-500">{errors.EndTime}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Start Meter Value</p>
                            <Field name="StartMeterValue" validate={(value) => {
                                let error;
                                if (value < 0) {
                                    error = "Start meter value must be 0 or greater.";
                                }
                                return error;
                            }}>
                                {({ field }) => (
                                    <NumberInput
                                        {...field}
                                        variant="filled"
                                        defaultValue={0}
                                        min={0}
                                        width="400px"
                                        mt={1}
                                    >
                                        <NumberInputField
                                            {...field}
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            placeholder="00.00"
                                            step={0.01}
                                        />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>End Meter Value</p>
                            <Field name="EndMeterValue" validate={(value) => {
                                let error;
                                if (value < 0) {
                                    error = "End meter value must be 0 or greater.";
                                }
                                return error;
                            }}>
                                {({ field }) => (
                                    <NumberInput
                                        {...field}
                                        variant="filled"
                                        defaultValue={0}
                                        min={0}
                                        width="400px"
                                        mt={1}
                                    >
                                        <NumberInputField
                                            {...field}
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            placeholder="00.00"
                                            step={0.01}
                                        />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Field name="IsActive" type="checkbox">
                                {({ field }) => (
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

            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay />
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                >
                    <AlertDialogHeader>Error</AlertDialogHeader>
                    <AlertDialogBody>
                        {dialogMessage}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={onDialogClose}>Close</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog isOpen={isSuccessDialogOpen} onClose={handleSuccessDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay />
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="50%"
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