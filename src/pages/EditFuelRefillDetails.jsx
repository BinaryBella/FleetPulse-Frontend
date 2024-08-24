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
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { axiosApi } from "../interceptor.js";

export default function EditFuelRefillDetails() {
    const { id } = useParams(); // Fetch the ID from the URL
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [vehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [currentTime, setCurrentTime] = useState(getCurrentTime());
    const [initialValues, setInitialValues] = useState({
        vehicleRegistrationNo: "",
        userId: "",
        nic: "",
        literCount: "",
        date: "",
        time: "",
        fType: "",
        cost: "",
        IsActive: false
    });

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
            const response = await axiosApi.get("https://localhost:7265/api/Vehicles");

            const mappedData = response.data.map(vehicle => ({
                id: vehicle.vehicleId,
                vehicleRegistrationNo: vehicle.vehicleRegistrationNo
            }));
            setVehicleRegNoDetails(mappedData);
        } catch (error) {
            console.error("Error fetching vehicle registration numbers:", error);
        }
    };

    const fetchFuelRefillDetails = async () => {
        try {
            const response = await axiosApi.get(`https://localhost:7265/api/FuelRefill/${id}`);
            const data = response.data;
            console.log('Fetched Fuel Refill Data:', data); // Log the fetched data

            // Update initial values with the fetched data
            setInitialValues({
                vehicleRegistrationNo: data.vehicleRegistrationNo || "",
                userId: data.userId || "",
                nic: data.nic || "",
                literCount: data.literCount || "",
                date: data.date.split("T")[0], // Adjust date format
                time: data.time || "",
                fType: data.fType || "",
                cost: data.cost || "",
                IsActive: data.isActive || false,
            });
        } catch (error) {
            console.error("Error fetching fuel refill details:", error);
        }
    };


    const handleSubmit = async (values, { setSubmitting }) => {
        if (vehicleRegNoDetails.length === 0) {
            setDialogMessage("Vehicle registration details are not loaded.");
            onDialogOpen();
            setSubmitting(false);
            return;
        }

        const selectedVehicle = vehicleRegNoDetails.find(
            (vehicle) => vehicle.vehicleRegistrationNo === values.vehicleRegistrationNo
        );

        if (!selectedVehicle) {
            setDialogMessage("Invalid vehicle selected.");
            onDialogOpen();
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                id: id, // Use the current ID for update
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

            const response = await axiosApi.put(`https://localhost:7265/api/FuelRefill/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status >= 200 && response.status < 300) {
                const data = response.data;

                if (data.message && data.message.toLowerCase().includes('exist')) {
                    setDialogMessage('Fuel Refill already exists');
                    onDialogOpen();
                } else {
                    setSuccessDialogMessage('Fuel Refill updated successfully');
                    onSuccessDialogOpen();
                }
            } else {
                throw new Error(`Server responded with status ${response.status}`);
            }
        } catch (error) {
            if (error.response && error.response.status) {
                setDialogMessage(`Error: ${error.response.statusText}`);
            } else if (error.request) {
                setDialogMessage('Failed to connect to the server');
            } else {
                setDialogMessage(error.message || 'Failed to update Fuel Refill.');
            }
            onDialogOpen();
        }
        setSubmitting(false);
    };

    useEffect(() => {
        fetchVehicleRegNos();
        fetchFuelRefillDetails(); // Fetch the existing fuel refill details
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
        { label: "Edit Fuel Refill Details", link: `/app/EditFuelRefillDetails/${id}` },
    ];

    return (
        <>
            <PageHeader title="Edit Fuel Refill Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting, setFieldValue }) => {
                    return (
                        <Form className="grid grid-cols-2 gap-10 mt-8">
                            {/* Form fields (same as in AddFuelRefillDetails but pre-populated) */}
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
                                                }
                                            }}
                                            placeholder='Select Vehicle Registration No'
                                            size='md'
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                        >
                                            <option value="" disabled>Select Vehicle Registration No</option>
                                            {vehicleRegNoDetails.map((option) => (
                                                <option key={option.vehicleRegistrationNo}
                                                        value={option.vehicleRegistrationNo}>
                                                    {option.vehicleRegistrationNo}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                </Field>
                            </div>
                                <div className="flex flex-col gap-3">
                                    <p>Fuel Type</p>
                                    <Field name="fType">
                                        {({field}) => (
                                            <Select
                                                {...field}
                                                placeholder="Select fuel type"
                                                size="md"
                                                variant="filled"
                                                borderRadius="md"
                                                px={3}
                                                py={2}
                                                mt={1}
                                                width="400px"
                                            >
                                                <option value="Petrol">Petrol</option>
                                                <option value="Diesel">Diesel</option>
                                                <option value="Electric">Electric</option>
                                            </Select>
                                        )}
                                    </Field>
                                    {errors.fType && touched.fType && (
                                        <div className="text-red-500">{errors.fType}</div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>Liter Count</p>
                                    <Field name="literCount" validate={(value) => {
                                        if (!value) return "Liter count is required";
                                        if (!/^[0-9]+$/.test(value)) return "Liter count must be a number";
                                        return undefined;
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
                                        if (!value) return "Date is required";
                                        return undefined;
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
                                    <Field name="time" validate={validateTime}>
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
                                                    id="time"
                                                    placeholder="Time"
                                                    onChange={(e) => handleTimeChange(e, setFieldValue)}
                                                />
                                                {errors.time && touched.time && (
                                                    <div className="text-red-500">{errors.time}</div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>Cost</p>
                                    <Field name="cost" validate={(value) => {
                                        if (!value) return "Cost is required";
                                        if (!/^[0-9]+$/.test(value)) return "Cost must be a number";
                                        return undefined;
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
                                    <p>Active Status</p>
                                    <Field name="IsActive" type="checkbox">
                                        {({field}) => (
                                            <Checkbox {...field} colorScheme={theme.primaryColor} id="IsActive">
                                                Is Active
                                            </Checkbox>
                                        )}
                                    </Field>
                                </div>
                                <div className="flex col-span-2 mt-10 gap-4">
                                    <Button
                                        type="submit"
                                        colorScheme={theme.primaryColor}
                                        disabled={isSubmitting}
                                    >
                                        Update Fuel Refill
                                    </Button>
                                    <Button onClick={handleCancel} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                </div>
                        </Form>
                );
                }}
                </Formik>
                    <AlertDialog
                isOpen={isDialogOpen}
                leastDestructiveRef={undefined}
                onClose={onDialogClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Alert
                        </AlertDialogHeader>
                        <AlertDialogBody>{dialogMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onDialogClose} colorScheme={theme.primaryColor}>
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <AlertDialog
                isOpen={isSuccessDialogOpen}
                leastDestructiveRef={undefined}
                onClose={handleSuccessDialogClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Success
                        </AlertDialogHeader>
                        <AlertDialogBody>{successDialogMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={handleSuccessDialogClose} colorScheme={theme.primaryColor}>
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
