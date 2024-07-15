import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { Button, Checkbox, Input, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useDisclosure } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";

export default function AddVehicleMaintenanceTypeDetails() {
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");

    const breadcrumbs = [
        {label: 'Vehicle', link: '/app/Vehicle'}, //yashmi
        {label: 'Vehicle Maintenance type Details', link: '/app/VehicleMaintenanceTypeDetails'},
        {label: 'Add Vehicle Maintenance Type Details', link: '/app/AddVehicleMaintenanceTypeDetails'}
    ];

    const handleSubmit = async (values) => {
        try {
            console.log(values.TypeName, values.isActive);
            const status = values.isActive || false; // Ensure it defaults to false if not set

            const response = await fetch('https://localhost:7265/api/VehicleMaintenanceType', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    TypeName: values.TypeName,
                    status: status
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add maintenance type.');
            }

            if (data.message && data.message.toLowerCase().includes('exist')) {
                setDialogMessage('Vehicle Maintenance Type already exists');
                onDialogOpen();
            } else {
                setSuccessDialogMessage('Maintenance type added successfully.');
                onSuccessDialogOpen();
            }
        } catch (error) {
            if (error instanceof TypeError) {
                setDialogMessage('Failed to connect to the server.');
            } else {
                setDialogMessage(error.message || 'Failed to add maintenance type.');
            }
            onDialogOpen();
        }
    };

    const handleCancel = () => {
        // Redirect to the vehicle maintenance type table page
        navigate('/app/VehicleMaintenanceTypeDetails');
    };

    const handleSuccessDialogClose = () => {
        // Close the success dialog
        onSuccessDialogClose();
        // Redirect to the vehicle maintenance type table page
        navigate('/app/VehicleMaintenanceTypeDetails');
    };

    return (
        <>
            <PageHeader title="Add Vehicle Maintenance Type Details" breadcrumbs={breadcrumbs}/>
            <Formik
                initialValues={{
                    TypeName: "",
                    isActive: false
                }}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="grid grid-cols-2 gap-10 mt-8">
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Maintenance Type</p>
                            <Field name="TypeName" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "Maintenance type is required.";
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
                                            id="TypeName"
                                            placeholder="Vehicle Maintenance Type"
                                        />
                                        {errors.TypeName && touched.TypeName && (
                                            <div className="text-red-500">{errors.TypeName}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <Field name="isActive">
                                {({ field, form }) => (
                                    <div>
                                        <Checkbox
                                            {...field}
                                            size='lg'
                                            defaultChecked={field.value}
                                            className="mt-8"
                                            onChange={e => form.setFieldValue(field.name, e.target.checked)}
                                        >
                                            Is Active
                                        </Checkbox>
                                        {form.errors.isActive && form.touched.isActive && (
                                            <div className="text-red-500">{form.errors.isActive}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <div className="flex gap-10">
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
