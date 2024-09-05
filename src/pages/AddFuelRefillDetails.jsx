import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Checkbox,
    Input,
    useDisclosure,
    Select
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { axiosApi } from "../interceptor.js";

export default function AddFuelRefillDetails() {
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [vehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    const validateTime = (value) => {
        let error;
        if (!value) {
            error = "Time is required.";
        } else if (value > currentTime) {
            error = "Please select a time not in the future.";
        }
        return error;
    };

    const handleTimeChange = (e, setFieldValue) => {
        const selectedTime = e.target.value;
        setFieldValue("time", selectedTime);

        if (selectedTime > currentTime) {
            setCurrentTime(selectedTime);
        }
    };

    const fetchVehicleRegNos = async () => {
        try {
            const response = await axiosApi.get("https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Vehicles");
            console.log("vehicle data", response); // Debugging line

            // Map the data to use 'vehicleId' instead of 'id'
            const mappedData = response.data.map(vehicle => ({
                id: vehicle.vehicleId, // Use 'vehicleId' from the API response
                vehicleRegistrationNo: vehicle.vehicleRegistrationNo
            }));

            console.log('Mapped vehicle registration numbers:', mappedData); // Debugging line
            setVehicleRegNoDetails(mappedData);
        } catch (error) {
            console.error("Error fetching vehicle registration numbers:", error);
        }
    };


    const handleSubmit = async (values, { setSubmitting }) => {
        console.log("Form Values:", values); // Debugging log
        console.log("Vehicle Registration Details:", vehicleRegNoDetails); // Debugging log

        if (vehicleRegNoDetails.length === 0) {
            setDialogMessage("Vehicle registration details are not loaded.");
            onDialogOpen();
            setSubmitting(false);
            return;
        }

        // Find the selected vehicle using vehicleRegistrationNo
        const selectedVehicle = vehicleRegNoDetails.find(
            (vehicle) => vehicle.vehicleRegistrationNo === values.vehicleRegistrationNo // Match by registration number
        );

        if (!selectedVehicle) {
            setDialogMessage("Invalid vehicle selected.");
            onDialogOpen();
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                id: selectedVehicle.id, // Use 'id' from the found vehicle
                vehicleRegistrationNo: selectedVehicle.vehicleRegistrationNo,
                UserId: values.userId,
                NIC: values.nic,
                Cost: values.cost,
                LiterCount: values.literCount,
                Date: values.date,
                Time: values.time,
                FType: values.fType,
                Status: values.IsActive
            };

            // Make sure to handle response correctly
            const response = await axiosApi.post('https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/FuelRefill', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check for response status
            if (response.status >= 200 && response.status < 300) {
                const data = response.data;

                if (data.message && data.message.toLowerCase().includes('exist')) {
                    setDialogMessage('Fuel Refill already exists');
                    onDialogOpen();
                } else {
                    setSuccessDialogMessage('Fuel Refill added successfully');
                    onSuccessDialogOpen();
                }
            } else {
                throw new Error(`Server responded with status ${response.status}`);
            }
        } catch (error) {
            if (error.response && error.response.status) {
                // Handle different response status codes here if needed
                setDialogMessage(`Error: ${error.response.statusText}`);
            } else if (error.request) {
                // Network error or no response received
                setDialogMessage('Failed to connect to the server');
            } else {
                // Other errors
                setDialogMessage(error.message || 'Failed to add Fuel Refill.');
            }
            onDialogOpen();
        }
        setSubmitting(false);
    };


    const fetchUser = async (setFieldValue) => {
        try {
            const username = sessionStorage.getItem("Username");
            if (username) {
                const response = await axiosApi.get(`https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Auth/userProfile?username=${username}`);
                const responseData = response.data;
                setFieldValue("nic", responseData.nic);
                setFieldValue("userId", responseData.userId); // Assuming the user profile response contains userId
            } else {
                console.error("Username not found in session storage.");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        fetchVehicleRegNos();
    }, []);

    const handleCancel = () => {
        navigate('/app/FuelRefillDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/FuelRefillDetails');
    };

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/VehicleDetails" },
        { label: "Fuel Refill Details", link: "/app/FuelRefillDetails" },
        { label: "Add Fuel Refill Details", link: "/app/AddFuelRefillDetails" },
    ];

    return (
        <>
            <PageHeader title="Add Fuel Refill Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={{
                    vehicleRegistrationNo: "",
                    userId: "",
                    nic: "",
                    literCount: "",
                    date: "",
                    time: "",
                    fType: "",
                    cost: "",
                    IsActive: false
                }}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting, setFieldValue }) => {
                    useEffect(() => {
                        fetchUser(setFieldValue);
                    }, [setFieldValue]);

                    return (
                        <Form className="grid grid-cols-2 gap-10 mt-8">
                            <div className="flex flex-col gap-3">
                                <p>User NIC</p>
                                <Field name="nic" validate={(value) => {
                                    let error;
                                    if (!value) {
                                        error = "NIC is required.";
                                    } else if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(value)) {
                                        error = "Invalid NIC format.";
                                    }
                                    return error;
                                }}>
                                    {({ field }) => (
                                        <div>
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
                                                placeholder="NIC"
                                            />
                                            {errors.nic && touched.nic && (
                                                <div className="text-red-500">{errors.nic}</div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Vehicle Registration No</p>
                                <Field name="vehicleRegistrationNo" validate={(value) => {
                                if (!value) return "Vehicle Registration No is required";
                                return undefined;
                            }}>
                                {({field, form}) => (
                                    <Select
                                        {...field}
                                        onChange={(e) => {
                                            const selectedVehicle = vehicleRegNoDetails.find(v => v.vehicleRegistrationNo === e.target.value);
                                            if (selectedVehicle) {
                                                form.setFieldValue('vehicleRegistrationNo', selectedVehicle.vehicleRegistrationNo);
                                                form.setFieldValue('vehicleId', selectedVehicle.id); // Ensure 'vehicleId' is set
                                                console.log('Selected vehicle:', selectedVehicle); // Debugging line
                                            } else {
                                                console.error('Selected vehicle not found');
                                            }
                                        }}
                                        placeholder='Vehicle Registration No'
                                        size='md'
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                    >
                                        {vehicleRegNoDetails.map((option) => (
                                            <option key={option.id} value={option.vehicleRegistrationNo}>
                                                {option.vehicleRegistrationNo}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </Field>

                                {errors.vehicleRegistrationNo && touched.vehicleRegistrationNo && (
                                    <div className="text-red-500">{errors.vehicleRegistrationNo}</div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Liter Count</p>
                                <Field name="literCount" validate={(value) => {
                                    let error;
                                    if (!value) {
                                        error = "Liter Count is required.";
                                    }
                                    return error;
                                }}>
                                    {({field}) => (
                                        <div>
                                            <Input
                                                {...field}
                                                type="number"
                                                variant="filled"
                                                borderRadius="md"
                                                px={3}
                                                py={2}
                                                mt={1}
                                                width="400px"
                                                id="literCount"
                                                placeholder="Liter Count"
                                            />
                                            {errors.literCount && touched.literCount && (
                                                <div className="text-red-500">{errors.literCount}</div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Date</p>
                                <Field name="date" validate={(value) => {
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
                                                id="date"
                                                max={new Date().toISOString().split('T')[0]}
                                                placeholder="Date"
                                            />
                                            {errors.date && touched.date && (
                                                <div className="text-red-500">{errors.date}</div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Time</p>
                                <div className="flex flex-col gap-3">
                                    <p>Time</p>
                                    <Field name="time" validate={validateTime}>
                                        {({field, form}) => (
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
                                                    id="time"
                                                    onChange={(e) => handleTimeChange(e, form.setFieldValue)}
                                                />
                                                {errors.time && touched.time && (
                                                    <div className="text-red-500">{errors.time}</div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Refill Type</p>
                                <Field name="fType" validate={(value) => {
                                    let error;
                                    if (!value) {
                                        error = "Refill Type is required.";
                                    }
                                    return error;
                                }}>
                                    {({field}) => (
                                        <div>
                                            <Select
                                                {...field}
                                                placeholder='Refill Type'
                                                size='md'
                                                variant='filled'
                                                borderRadius="md"
                                                px={3}
                                                py={2}
                                                mt={1}
                                                width="400px"
                                            >
                                                <option value="In station">In station</option>
                                                <option value="Out station">Out station</option>
                                            </Select>
                                            {errors.fType && touched.fType && (
                                                <div className="text-red-500">{errors.fType}</div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Cost</p>
                                <Field name="cost" validate={(value) => {
                                    let error;
                                    if (!value) {
                                        error = "Cost is required.";
                                    }
                                    return error;
                                }}>
                                    {({ field }) => (
                                        <div>
                                            <Input
                                                {...field}
                                                type="number"
                                                variant="filled"
                                                borderRadius="md"
                                                px={3}
                                                py={2}
                                                mt={1}
                                                width="400px"
                                                id="cost"
                                                placeholder="Cost"
                                            />
                                            {errors.cost && touched.cost && (
                                                <div className="text-red-500">{errors.cost}</div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p>Status</p>
                                <Field name="IsActive" type="checkbox">
                                    {({ field }) => (
                                        <Checkbox
                                            {...field}
                                            colorScheme={theme.colors.brand}
                                            size="lg"
                                            mt={1}
                                        >
                                            Active
                                        </Checkbox>
                                    )}
                                </Field>
                            </div>
                            <div></div>
                            <div className="flex gap-14">
                                <Button
                                    bg="gray.400"
                                    _hover={{ bg: "gray.500" }}
                                    color="#ffffff"
                                    variant="solid"
                                    w="180px"
                                    marginTop="10"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    bg={theme.purple}
                                    _hover={{ bg: theme.onHoverPurple }}
                                    color="#ffffff"
                                    variant="solid"
                                    w="180px"
                                    marginTop="10"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>

            {isDialogOpen && <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay />
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
            </AlertDialog>}

            {isSuccessDialogOpen && <AlertDialog isOpen={isSuccessDialogOpen} onClose={handleSuccessDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay />
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
            </AlertDialog>}
        </>
    );
}
