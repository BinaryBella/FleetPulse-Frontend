import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import {
    Button,
    Checkbox,
    Input,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { axiosApi } from "../interceptor.js";
import PageHeader from "../components/PageHeader.jsx";

export default function EditManufactureDetails() {
    const { id } = useParams(); // Get the manufacturer ID from the URL
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [initialValues, setInitialValues] = useState({
        manufacturer: "",
        status: false,
    });

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/VehicleDetails" },
        { label: 'Manufacturer', link: '/app/ManufacturerDetails' },
        { label: 'Edit Manufacturer Details', link: `/app/EditManufactureDetails/${id}` }
    ];

    useEffect(() => {
        const fetchManufacturerDetails = async () => {
            try {
                const response = await axiosApi.get(`https://localhost:7265/api/Manufacture/${id}`);
                const { manufacturer, status } = response.data;
                setInitialValues({
                    manufacturer,
                    status
                });
            } catch (error) {
                console.error("Error fetching manufacturer details:", error);
                setDialogMessage('Failed to fetch manufacturer details.');
                onDialogOpen();
            }
        };

        fetchManufacturerDetails();
    }, [id]);

    const handleSubmit = async (values) => {
        try {
            const response = await axiosApi.put(`https://localhost:7265/api/Manufacture/UpdateManufacture/${id}`, {
                manufacturer: values.manufacturer,
                status: values.status
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setSuccessDialogMessage('Manufacturer details updated successfully.');
                onSuccessDialogOpen();
            } else {
                throw new Error('Failed to update manufacturer details.');
            }
        } catch (error) {
            console.error('Error updating manufacturer details:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setDialogMessage(error.response.data.message);
            } else {
                setDialogMessage('Failed to update manufacturer details.');
            }
            onDialogOpen();
        }
    };


    const handleCancel = () => {
        navigate('/app/ManufacturerDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/ManufacturerDetails');
    };

    return (
        <>
            <PageHeader title="Edit Manufacturer Details" breadcrumbs={breadcrumbs} />
            <div className="flex justify-between vertical-container">
                <div className="flex flex-col gap-6 mt-0">
                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form className="grid grid-cols-2 gap-10 mt-8">
                                <div className="flex flex-col gap-3">
                                    <p>Manufacturer</p>
                                    <Field name="manufacturer" validate={(value) => {
                                        let error;
                                        if (!value) {
                                            error = "Manufacturer is required.";
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
                                                    id="manufacturer"
                                                    placeholder="Manufacturer"
                                                />
                                                {errors.manufacturer && touched.manufacturer && (
                                                    <div className="text-red-500">{errors.manufacturer}</div>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                    <Field name="status">
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
                </div>
            </div>

            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay />
                <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
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
                <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
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
