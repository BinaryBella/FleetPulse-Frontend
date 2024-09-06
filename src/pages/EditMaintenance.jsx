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
import { axiosApi } from "../interceptor.js";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

export default function EditMaintenance() {
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
        VehicleMaintenanceTypeId: "",
        typeName: "",
        vehicleId: "",
        cost: "",
        serviceProvider: "",
        replacedParts: "",
        specialNotes: "",
        isActive: false,
    });

    // Format date to yyyy-MM-dd
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    // Fetch vehicle registration numbers
    const fetchVehicleRegNos = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265api/Vehicles");
            const mappedData = response.data.map(vehicle => ({
                id: vehicle.vehicleId,
                vehicleRegistrationNo: vehicle.vehicleRegistrationNo
            }));
            setVehicleRegNoDetails(mappedData);
        } catch (error) {
            console.error("Error fetching vehicle registration numbers:", error);
        }
    };

    // Fetch vehicle maintenance details
    const fetchVehicleMaintenanceDetails = async () => {
        if (id) {
            try {
                const response = await axiosApi.get(`https://localhost:7265api/VehicleMaintenance/${id}`);
                const maintenance = response.data;
                console.log("maintenance data", maintenance);
                const selectedVehicle = vehicleRegNoDetails.find(v => v.id === maintenance.vehicleId);

                setInitialValues({
                    vehicleRegistrationNo: selectedVehicle ? selectedVehicle.vehicleRegistrationNo : "",
                    maintenanceDate: formatDate(maintenance.maintenanceDate) || "",
                    VehicleMaintenanceTypeId: maintenance.vehicleMaintenanceTypeId || "",
                    cost: maintenance.cost || "",
                    serviceProvider: maintenance.serviceProvider || "",
                    replacedParts: maintenance.partsReplaced || "",
                    specialNotes: maintenance.specialNotes || "",
                    isActive: Boolean(maintenance.status),
                    vehicleId: maintenance.vehicleId || ""
                });
            } catch (error) {
                console.error("Error fetching vehicle maintenance details:", error);
            }
        }
    };

    // Fetch vehicle maintenance types
    const fetchVehicleMaintenanceTypes = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265api/VehicleMaintenanceType");
            setMaintenanceTypeDetails(response.data);
        } catch (error) {
            console.error("Error fetching vehicle maintenance types:", error);
        }
    };

    useEffect(() => {
        fetchVehicleMaintenanceTypes();
        fetchVehicleRegNos();
    }, []);

    useEffect(() => {
        fetchVehicleMaintenanceDetails();
    }, [id, vehicleRegNoDetails]);

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/VehicleDetails" },
        { label: "Vehicle Maintenance Details", link: "/app/VehicleMaintenanceDetails" },
        { label: "Edit Vehicle Maintenance Details", link: `/app/EditVehicleMaintenanceDetails/${id}` },
    ];

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const dataToSend = {
                cost: parseFloat(values.cost),
                maintenanceDate: values.maintenanceDate,
                partsReplaced: values.replacedParts,
                serviceProvider: values.serviceProvider,
                specialNotes: values.specialNotes,
                status: values.isActive,
                vehicleId: values.vehicleId,
                vehicleMaintenanceTypeId: parseInt(values.VehicleMaintenanceTypeId),
                vehicleRegistrationNo: values.vehicleRegistrationNo
            };

            const response = await axiosApi.put(`https://localhost:7265api/VehicleMaintenance/${id}`, dataToSend);

            if (response.status === 200) {
                setSuccessDialogMessage('Maintenance details updated successfully.');
                onSuccessDialogOpen();
            } else {
                throw new Error('Unexpected response from server.');
            }
        } catch (error) {
            setDialogMessage(error.message);
            onDialogOpen();
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/app/VehicleMaintenanceDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/VehicleMaintenanceDetails');
    };

    return (
        <>
            <PageHeader title="Edit Vehicle Maintenance Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="grid grid-cols-2 gap-10 mt-8">
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Registration No</p>
                            <Field name="vehicleRegistrationNo">
                                {({ field, form }) => (
                                    <Select
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            const selectedVehicle = vehicleRegNoDetails.find(v => v.vehicleRegistrationNo === e.target.value);
                                            if (selectedVehicle) {
                                                form.setFieldValue('vehicleRegistrationNo', selectedVehicle.vehicleRegistrationNo);
                                                form.setFieldValue('vehicleId', selectedVehicle.id);
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
                            <p>Vehicle Maintenance Type</p>
                            <Field name="VehicleMaintenanceTypeId">
                                {({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder='Vehicle Maintenance Type'
                                        size='md'
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                    >
                                        {maintenanceTypeDetails.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.typeName}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </Field>
                            {errors.VehicleMaintenanceTypeId && touched.VehicleMaintenanceTypeId && (
                                <div className="text-red-500">{errors.VehicleMaintenanceTypeId}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Maintenance Date</p>
                            <Field name="maintenanceDate">
                                {({ field }) => (
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
                            {errors.maintenanceDate && touched.maintenanceDate && (
                                <div className="text-red-500">{errors.maintenanceDate}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Cost</p>
                            <Field name="cost">
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
                            <Field name="serviceProvider">
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
                                        width="400px"
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
                                        width="400px"
                                        placeholder="Special Notes"
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Status</p>
                            <Field name="isActive" type="checkbox">
                                {({ field, form }) => (
                                    <Checkbox
                                        {...field}
                                        isChecked={field.value}  // Add this line
                                        onChange={(e) => form.setFieldValue('isActive', e.target.checked)}  // Add this line
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
                        <div className="flex flex-row gap-10">
                            <Button
                                bg="gray.400"
                                _hover={{ bg: "gray.500" }}
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
                                _hover={{ bg: theme.onHoverPurple }}
                                color="#ffffff"
                                variant="solid"
                                w="180px"
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

            {isSuccessDialogOpen && <AlertDialog isOpen={isSuccessDialogOpen} onClose={onSuccessDialogClose} motionPreset="slideInBottom">
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
