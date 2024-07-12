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
    Textarea,
    useDisclosure,
    Select
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

export default function AddVehicleMaintenanceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [maintenanceTypeDetails, setMaintenanceTypeDetails] = useState([]);
    const [vehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [initialValues, setInitialValues] = useState({
        vehicleRegistrationNo: "",
        maintenanceDate: "",
        VehicleMaintenanceTypeId: 0,
        cost: "",
        serviceProvider: "",
        replacedParts: "",
        specialNotes: "",
        isActive: false,
    });

    const fetchVehicleRegNos = async () => {
        try {
            const response = await axios.get("https://localhost:7265/api/Vehicle");
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


    const fetchVehicleMaintenanceDetails = async () => {
        if (id) {
            try {
                const response = await axios.get(`https://localhost:7265/api/VehicleMaintenance/${id}`);
                const maintenance = response.data;
                setInitialValues({
                    vehicleRegistrationNo: maintenance.id?.toString() || "", // Convert to string if not null
                    maintenanceDate: maintenance.MaintenanceDate,
                    VehicleMaintenanceTypeId: maintenance.VehicleMaintenanceTypeId,
                    cost: maintenance.Cost.toString(), // Convert to string if needed
                    serviceProvider: maintenance.ServiceProvider,
                    replacedParts: maintenance.PartsReplaced,
                    specialNotes: maintenance.SpecialNotes,
                    isActive: maintenance.Status,
                });
            } catch (error) {
                console.error("Error fetching vehicle maintenance details:", error);
            }
        }
    };


    const fetchVehicleMaintenanceTypes = async () => {
        try {
            const response = await axios.get("https://localhost:7265/api/VehicleMaintenanceType");
            setMaintenanceTypeDetails(response.data);
        } catch (error) {
            console.error("Error fetching vehicle maintenance types:", error);
        }
    };

    useEffect(() => {
        fetchVehicleMaintenanceTypes();
        fetchVehicleRegNos();
        fetchVehicleMaintenanceDetails();
    }, []);

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/Vehicle" },
        { label: "Vehicle Maintenance", link: "/app/MaintenanceTable" },
        { label: id ? "Edit Vehicle Maintenance Details" : "Add Vehicle Maintenance Details", link: id ? `/app/EditVehicleMaintenanceDetails/${id}` : "/app/AddVehicleMaintenanceDetails" },
    ];

    const handleSubmit = async (values) => {
        try {
            const payload = {
                id: parseInt(values.vehicleRegistrationNo),  // Assuming this is vehicleId
                vehicleRegistrationNo: values.vehicleRegistrationNo,
                MaintenanceDate: values.maintenanceDate,
                VehicleMaintenanceTypeId: parseInt(values.VehicleMaintenanceTypeId),
                Cost: parseFloat(values.cost),
                PartsReplaced: values.replacedParts,
                ServiceProvider: values.serviceProvider,
                SpecialNotes: values.specialNotes,
                Status: values.isActive,
                vehicleId: parseInt(values.vehicleRegistrationNo) // Assuming vehicleId is the same as vehicleRegistrationNo for now
            };

            let response;
            if (id) {
                response = await axios.put(`https://localhost:7265/api/VehicleMaintenance/${id}`, payload);
            } else {
                response = await axios.post('https://localhost:7265/api/VehicleMaintenance', payload);
            }

            const data = response.data;

            if (data.message && data.message.toLowerCase().includes('exist')) {
                setDialogMessage('Vehicle Maintenance already exists');
                onDialogOpen();
            } else {
                setSuccessDialogMessage(id ? 'Maintenance updated successfully' : 'Maintenance added successfully');
                onSuccessDialogOpen();
                navigate('/app/MaintenanceTable');
            }
        } catch (error) {
            console.error("Error submitting vehicle maintenance details:", error);

            if (error.response) {
                setDialogMessage(`Server Error: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                setDialogMessage("Network Error: Failed to connect to the server");
            } else {
                setDialogMessage(`Error: ${error.message}`);
            }
            onDialogOpen();
        }
    };

    const handleCancel = () => {
        navigate('/app/MaintenanceTable');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/MaintenanceTable');
    };

    return (
        <>
            <PageHeader title={id ? "Edit Vehicle Maintenance Details" : "Add Vehicle Maintenance Details"} breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={initialValues}
                enableReinitialize
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
                                            width="500px"
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
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Maintenance Type</p>
                            <Field name="VehicleMaintenanceTypeId" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "Maintenance type is required.";
                                }
                                return error;
                            }}>
                                {({ field }) => (
                                    <div>
                                        <Select
                                            {...field}
                                            placeholder='Vehicle Maintenance Type'
                                            size='md'
                                            variant='filled'
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
                                        >
                                            {maintenanceTypeDetails.map((option, index) => (
                                                <option key={index} value={option.id}>
                                                    {option.typeName}
                                                </option>
                                            ))}
                                        </Select>

                                        {errors.VehicleMaintenanceTypeId && touched.VehicleMaintenanceTypeId && (
                                            <div className="text-red-500">{errors.VehicleMaintenanceTypeId}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Maintenance Date</p>
                            <Field name="maintenanceDate" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "Maintenance Date is required.";
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
                                            width="500px"
                                            name="maintenanceDate"
                                            placeholder="Maintenance Date"
                                        />
                                        {errors.maintenanceDate && touched.maintenanceDate && (
                                            <div className="text-red-500">{errors.maintenanceDate}</div>
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
                                } else if (isNaN(value)) {
                                    error = "Cost must be a number.";
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
                                            width="500px"
                                            name="cost"
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
                            <p>Service Provider</p>
                            <Field name="serviceProvider" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "Service Provider is required.";
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
                                            width="500px"
                                            name="serviceProvider"
                                            placeholder="Service Provider"
                                        />
                                        {errors.serviceProvider && touched.serviceProvider && (
                                            <div className="text-red-500">{errors.serviceProvider}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Parts Replaced</p>
                            <Field name="replacedParts">
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
                                        name="replacedParts"
                                        placeholder="Parts Replaced"
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Special Notes</p>
                            <Field name="specialNotes">
                                {({ field }) => (
                                    <Textarea
                                        {...field}
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                        name="specialNotes"
                                        placeholder="Special Notes"
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Status</p>
                            <Field name="isActive" type="checkbox">
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
                        <div className="flex flex-row gap-14">
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
            </AlertDialog>

            <AlertDialog isOpen={isSuccessDialogOpen} onClose={onSuccessDialogClose} motionPreset="slideInBottom">
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
            </AlertDialog>
        </>
    );
}
