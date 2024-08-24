import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { Button, Checkbox, Input, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useDisclosure, Select } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { axiosApi } from "../interceptor.js";

export default function EditVehicleDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [vehicleData, setVehicleData] = useState(null);

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/VehicleDetails" },
        { label: "Vehicle Details", link: "/app/VehicleDetails" },
        { label: "Edit Vehicle Details", link: "/app/EditVehicleDetails" },
    ];

    useEffect(() => {
        // Fetch Vehicle Types
        axiosApi.get('https://localhost:7265/api/VehicleType')
            .then(response => {
                setVehicleTypes(response.data);
            })
            .catch(error => {
                console.error('Error fetching vehicle types:', error);
            });

        // Fetch Manufacturers
        axiosApi.get('https://localhost:7265/api/Manufacture')
            .then(response => {
                setManufacturers(response.data);
            })
            .catch(error => {
                console.error('Error fetching manufacturers:', error);
            });

        // Fetch Vehicle Data
        axiosApi.get(`https://localhost:7265/api/Vehicles/${id}`)
            .then(response => {
                setVehicleData(response.data);
            })
            .catch(error => {
                console.error('Error fetching vehicle data:', error);
            });
    }, [id]);

    const handleSubmit = async (values, { setFieldError }) => {
        try {
            const dataToSend = {
                vehicleRegistrationNo: values.vehicleRegistrationNo,
                licenseNo: values.licenseNo,
                licenseExpireDate: values.licenseExpireDate,
                vehicleColor: values.vehicleColor,
                vehicleType: values.vehicleType,
                manufacturer: values.manufacturer,
                fuelType: values.fuelType,
                status: values.status
            };

            await axiosApi.put(`https://localhost:7265/api/Vehicles/${id}`, dataToSend);

            setSuccessDialogMessage('Vehicle details updated successfully.');
            onSuccessDialogOpen();
        } catch (error) {
            console.error('There was an error updating the data!', error);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                if (errorMessage.includes('registration number')) {
                    setFieldError('vehicleRegistrationNo', 'Vehicle registration number must be unique.');
                } else if (errorMessage.includes('license number')) {
                    setFieldError('licenseNo', 'License number must be unique.');
                } else {
                    setDialogMessage('Failed to update vehicle details.');
                    onDialogOpen();
                }
            } else {
                setDialogMessage('Failed to update vehicle details.');
                onDialogOpen();
            }
        }
    };

    const handleCancel = () => {
        navigate('/app/VehicleDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/VehicleDetails');
    };

    if (!vehicleData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="Edit Vehicle Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={{
                    vehicleRegistrationNo: vehicleData.vehicleRegistrationNo || "",
                    licenseNo: vehicleData.licenseNo || "",
                    licenseExpireDate: vehicleData.licenseExpireDate || "",
                    vehicleColor: vehicleData.vehicleColor || "",
                    vehicleType: vehicleData.vehicleType || "",
                    manufacturer: vehicleData.manufacturer || "",
                    fuelType: vehicleData.fuelType || "",
                    status: vehicleData.status || false,
                }}
                onSubmit={handleSubmit}
                validate={(values) => {
                    const errors = {};
                    if (!values.vehicleRegistrationNo) {
                        errors.vehicleRegistrationNo = "Vehicle registration number is required.";
                    }
                    if (!values.vehicleType) {
                        errors.vehicleType = "Vehicle type is required.";
                    }
                    if (!values.manufacturer) {
                        errors.manufacturer = "Manufacturer is required.";
                    }
                    if (!values.licenseNo) {
                        errors.licenseNo = "License No is required.";
                    }
                    if (!values.licenseExpireDate) {
                        errors.licenseExpireDate = "License Expire Date is required.";
                    }
                    return errors;
                }}
            >
                {({ errors, touched }) => (
                    <Form className="grid grid-cols-2 gap-10 mt-8">
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Registration No</p>
                            <Field name="vehicleRegistrationNo">
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
                                            id="vehicleRegistrationNo"
                                            placeholder="Vehicle Registration No"
                                        />
                                        {errors.vehicleRegistrationNo && touched.vehicleRegistrationNo && (
                                            <div className="text-red-500">{errors.vehicleRegistrationNo}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>License No</p>
                            <Field name="licenseNo">
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
                                            id="licenseNo"
                                            placeholder="License No"
                                        />
                                        {errors.licenseNo && touched.licenseNo && (
                                            <div className="text-red-500">{errors.licenseNo}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>License Expire Date</p>
                            <Field name="licenseExpireDate">
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
                                            min={new Date().toISOString().split('T')[0]}
                                            id="licenseExpireDate"
                                        />
                                        {errors.licenseExpireDate && touched.licenseExpireDate && (
                                            <div className="text-red-500">{errors.licenseExpireDate}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Color</p>
                            <Field name="vehicleColor">
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
                                            id="vehicleColor"
                                            placeholder="Vehicle Color"
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Type</p>
                            <Field name="vehicleType">
                                {({ field }) => (
                                    <Select
                                        {...field}
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                        id="vehicleType"
                                        placeholder="Vehicle Type"
                                    >
                                        <option value="">Select Vehicle Type</option>
                                        {vehicleTypes.map(type => (
                                            <option key={type.vehicleTypeId} value={type.type}>
                                                {type.type}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </Field>
                            {errors.vehicleType && touched.vehicleType && (
                                <div className="text-red-500">{errors.vehicleType}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Manufacturer</p>
                            <Field name="manufacturer">
                                {({ field }) => (
                                    <Select
                                        {...field}
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                        id="manufacturer"
                                        placeholder="Manufacturer"
                                    >
                                        <option value="">Select Manufacturer</option>
                                        {manufacturers.map(manufacture => (
                                            <option key={manufacture.manufactureId} value={manufacture.manufacturer}>
                                                {manufacture.manufacturer}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </Field>
                            {errors.manufacturer && touched.manufacturer && (
                                <div className="text-red-500">{errors.manufacturer}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Fuel Type</p>
                            <Field name="fuelType">
                                {({ field }) => (
                                    <Select
                                        {...field}
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                        id="fuelType"
                                        placeholder="Fuel Type"
                                    >
                                        <option value="">Fuel Type</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                    </Select>
                                )}
                            </Field>
                            {errors.fuelType && touched.fuelType && (
                                <div className="text-red-500">{errors.fuelType}</div>
                            )}
                        </div>
                        <Field name="status">
                            {({ field, form }) => (
                                <div>
                                    <Checkbox
                                        {...field}
                                        size="lg"
                                        defaultChecked={field.value}
                                        className="mt-8"
                                        onChange={e => form.setFieldValue(field.name, e.target.checked)}
                                    >
                                        Is Active
                                    </Checkbox>
                                    {form.errors.status && form.touched.status && (
                                        <div className="text-red-500">{form.errors.status}</div>
                                    )}
                                </div>
                            )}
                        </Field>
                        <div></div>
                        <div className="flex w-5/6 justify-end gap-14">
                            <Button
                                bg="gray.400"
                                _hover={{ bg: "gray.500" }}
                                color="#ffffff"
                                variant="solid"
                                w="250px"
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
                                w="250px"
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
