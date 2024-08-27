import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
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

export default function EditMaintenanceType() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [initialValues, setInitialValues] = useState({ TypeName: "", isActive: false });

    useEffect(() => {
        fetchMaintenanceTypeData(id);
    }, [id]);

    const fetchMaintenanceTypeData = async (id) => {
        try {
            const response = await axiosApi.get(`https://localhost:7265/api/VehicleMaintenanceType/${id}`);
            const data = response.data;

            if (response.status !== 200) {
                throw new Error(data.message || 'Failed to fetch maintenance type data.');
            }

            setInitialValues({
                TypeName: data.typeName || "",
                isActive: data.status || false
            });
        } catch (error) {
            setDialogMessage(error.message || 'Failed to fetch maintenance type data.');
            onDialogOpen();
        }
    };

    const handleSubmit = async (values) => {
        try {
            const response = await axiosApi.put(`https://localhost:7265/api/VehicleMaintenanceType/UpdateVehicleMaintenanceType`, {
                Id: id,
                TypeName: values.TypeName,
                Status: values.isActive
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setSuccessDialogMessage('Maintenance type updated successfully.');
                onSuccessDialogOpen();
            } else {
                setDialogMessage(response.data.message || 'Failed to update maintenance type.');
                onDialogOpen();
            }
        } catch (error) {
            setDialogMessage(error.message || 'Failed to update maintenance type.');
            onDialogOpen();
        }
    };

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/VehicleDetails" },
        { label: "Vehicle Maintenance Type Details", link: "/app/VehicleMaintenanceTypeDetails" },
        { label: "Edit Vehicle Maintenance Type Details", link: `/app/EditMaintenanceType/${id}` },
    ];


    const handleCancel = () => {
        navigate('/app/VehicleMaintenanceTypeDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/VehicleMaintenanceTypeDetails');
    };

    return (
        <>
            <PageHeader title="Edit Vehicle Maintenance Type Details" breadcrumbs={breadcrumbs} />
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, values, setFieldValue }) => (
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
                                            width="500px"
                                            id="TypeName"
                                            placeholder="Enter Vehicle Maintenance Type"
                                        />
                                        {errors.TypeName && touched.TypeName && (
                                            <div className="text-red-500">{errors.TypeName}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <Field name="isActive">
                                {({ field }) => (
                                    <div>
                                        <Checkbox
                                            {...field}
                                            size='lg'
                                            isChecked={values.isActive}
                                            className="mt-8"
                                            onChange={e => setFieldValue('isActive', e.target.checked)}
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
                    transform="translate(-50%, -50%)">
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
