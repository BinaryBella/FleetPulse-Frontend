import {useEffect, useState} from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
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
import {axiosApi} from "../interceptor.js";

export default function AddTripDetails() {
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [vehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [NICs, setNICs] = useState([]); // State to store NICs

    const breadcrumbs = [
        { label: 'Trips', link: '/app/TripDetails' },
        { label: 'Trip Details', link: '/app/TripDetails' },
        { label: 'Add Trip Details', link: '/app/AddTripDetails' }
    ];

    const fetchVehicleRegNos = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Vehicles");
            setVehicleRegNoDetails(response.data);
            console.log("Vehicle registration numbers fetched:", response.data); // Detailed logging
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.error("Server responded with an error:", error.response.data);
                console.error("Status code:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error setting up request:", error.message);
            }
        }
    };

    const fetchDriverNICs = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Auth/drivers/nics");
            setNICs(response.data);
            console.log("Driver NICs fetched:", response.data);
        } catch (error) {
            console.error("Error fetching driver NICs:", error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const response = await axiosApi.post('https://localhost:7265/api/Trip', {
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
                setSuccessDialogMessage('Trip record added successfully.');
                onSuccessDialogOpen();
            } else {
                throw new Error('Failed to add trip record.');
            }
        } catch (error) {
            console.error('Error adding trip record:', error);
            if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.vehicleId) {
                setDialogMessage(error.response.data.errors.vehicleId[0]);
            } else if (error instanceof TypeError) {
                setDialogMessage('Failed to connect to the server.');
            } else {
                setDialogMessage(error.message || 'Failed to add trip record.');
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
        fetchVehicleRegNos();
        fetchDriverNICs();
    }, []);

    return (
        <>
            <PageHeader title="Add Trip Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={{
                    vehicleRegistrationNo: "",
                    nic: "",
                    Date: "",
                    StartTime: "",
                    EndTime: "",
                    StartMeterValue: 0,
                    EndMeterValue: 0,
                    IsActive: true
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
                                {({field}) => (
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
                                            width="400px"
                                            placeholder="Date"
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
                                {({field}) => (
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
                                {({field}) => (
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
                                {({field}) => (
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
                                            <NumberIncrementStepper/>
                                            <NumberDecrementStepper/>
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
                                {({field}) => (
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
                                            <NumberIncrementStepper/>
                                            <NumberDecrementStepper/>
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Field name="IsActive" type="checkbox">
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

            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay/>
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
                <AlertDialogOverlay/>
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
