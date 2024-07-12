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
    Select,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import axios from "axios";
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
    const [VehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [initialValues, setInitialValues] = useState({
        vehicleId: "",
        vehicleRegistrationNo: "",
        maintenanceDate: "",
        VehicleMaintenanceTypeId: 0,
        cost: "",
        serviceProvider: "",
        replacedParts: "",
        specialNotes: "",
        isActive: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch vehicle registration numbers first
                const vehicleResponse = await axios.get("https://localhost:7265/api/Vehicle");
                setVehicleRegNoDetails(vehicleResponse.data);

                // Fetch maintenance types
                const maintenanceTypeResponse = await axios.get("https://localhost:7265/api/VehicleMaintenanceType");
                setMaintenanceTypeDetails(maintenanceTypeResponse.data);

                // If we're editing, fetch the maintenance details
                if (id) {
                    const maintenanceResponse = await axios.get(`https://localhost:7265/api/VehicleMaintenance/${id}`);
                    const maintenance = maintenanceResponse.data;

                    // Find the matching vehicle registration number
                    const vehicle = vehicleResponse.data.find(v => v.id === maintenance.vehicleId);
                    const vehicleRegistrationNo = vehicle ? vehicle.vehicleRegistrationNo : "";

                    setInitialValues({
                        vehicleId: maintenance.vehicleId,
                        vehicleRegistrationNo: vehicleRegistrationNo,
                        maintenanceDate: maintenance.maintenanceDate.split("T")[0],
                        VehicleMaintenanceTypeId: maintenance.vehicleMaintenanceTypeId,
                        cost: maintenance.cost,
                        serviceProvider: maintenance.serviceProvider,
                        replacedParts: maintenance.partsReplaced,
                        specialNotes: maintenance.specialNotes,
                        isActive: maintenance.status,
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/Vehicle" },
        { label: "Vehicle Maintenance", link: "/app/MaintenanceTable" },
        {
            label: id ? "Edit Vehicle Maintenance Details" : "Add Vehicle Maintenance Details",
            link: id ? `/app/EditMaintenance/${id}` : "/app/AddVehicleMaintenanceDetails",
        },
    ];

    const handleSubmit = async (values) => {
        try {
            const payload = {
                vehicleId: values.vehicleId, // Correctly map vehicleId
                maintenanceDate: values.maintenanceDate,
                vehicleMaintenanceTypeId: parseInt(values.VehicleMaintenanceTypeId),
                cost: parseFloat(values.cost),
                partsReplaced: values.replacedParts,
                serviceProvider: values.serviceProvider,
                specialNotes: values.specialNotes,
                status: values.isActive,
            };
            console.log(payload);

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
            }
        } catch (error) {
            if (error instanceof TypeError) {
                setDialogMessage('Failed to connect to the server');
            } else {
                setDialogMessage(error.message || 'Failed to add maintenance.');
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
            <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
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
                                {({field, form}) => (
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
                                            onChange={(e) => {
                                                const selectedVehicle = VehicleRegNoDetails.find(v => v.id === parseInt(e.target.value));
                                                form.setFieldValue('vehicleRegistrationNo', e.target.value);
                                                form.setFieldValue('vehicleId', selectedVehicle.id); // Set vehicleId correctly
                                            }}
                                        >
                                            {VehicleRegNoDetails.map((option, index) => (
                                                <option key={index} value={option.vehicleId}>
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
                                {({field}) => (
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
                                            type='date'
                                            size='md'
                                            variant='filled'
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                            placeholder='Cost'
                                            size='md'
                                            variant='filled'
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="500px"
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
                                    <Input
                                        {...field}
                                        placeholder='Service Provider'
                                        size='md'
                                        variant='filled'
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Replaced Parts</p>
                            <Field name="replacedParts">
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder='Replaced Parts'
                                        size='md'
                                        variant='filled'
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
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
                                        placeholder='Special Notes'
                                        size='md'
                                        variant='filled'
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Field name="isActive" type="checkbox">
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        colorScheme="blue"
                                        borderRadius="md"
                                        size="lg"
                                        isChecked={field.value}
                                    >
                                        Is Active
                                    </Checkbox>
                                )}
                            </Field>
                        </div>
                        <div></div>
                        <div className="flex gap-10">
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

            <AlertDialog isOpen={isDialogOpen} leastDestructiveRef={undefined} onClose={onDialogClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent
                        position="absolute"
                        top="30%"
                        left="35%"
                        transform="translate(-50%, -50%)"
                    >
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Alert
                        </AlertDialogHeader>
                        <AlertDialogBody>{dialogMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onDialogClose} ml={3}>
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <AlertDialog isOpen={isSuccessDialogOpen} leastDestructiveRef={undefined} onClose={handleSuccessDialogClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent
                        position="absolute"
                        top="30%"
                        left="35%"
                        transform="translate(-50%, -50%)"
                    >
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Success
                        </AlertDialogHeader>
                        <AlertDialogBody>{successDialogMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={handleSuccessDialogClose} ml={3}>
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
