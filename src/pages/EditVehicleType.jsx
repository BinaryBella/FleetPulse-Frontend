import { useEffect, useState } from "react";
import { Formik, Field } from "formik";
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
import editVehicleTypeImage from "../assets/images/addVehicleType.png";

export default function EditVehicleType() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [vehicleTypeData, setVehicleTypeData] = useState(null);

    const breadcrumbs = [
        { label: 'Vehicle', link: '/app/VehicleDetails' },
        { label: 'Vehicle Type Details', link: '/app/VehicleTypeDetails' },
        { label: "Edit Vehicle Type Details", link:  `/app/EditVehicleType/${id}` },
    ];

    useEffect(() => {
        axiosApi.get(`https://localhost:7265/api/VehicleType/${id}`)
            .then(response => {
                if (response.data) {
                    setVehicleTypeData(response.data);
                } else {
                    setDialogMessage('Vehicle Type with Id not found.');
                    onDialogOpen();
                }
            })
            .catch(error => {
                console.error('Error fetching vehicle type data:', error);
                setDialogMessage('Error fetching vehicle type data.');
                onDialogOpen();
            });
    }, [id]);


    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axiosApi.put(`https://localhost:7265/api/VehicleType/UpdateVehicleType`, {
                VehicleTypeId: vehicleTypeData.vehicleTypeId, // Ensure correct ID is used
                Type: values.type,
                Status: values.isActive ? "true" : "false"
            });

            if (response.status === 200) {
                setSuccessDialogMessage('Vehicle type updated successfully.');
                onSuccessDialogOpen();
            } else {
                throw new Error('Failed to update vehicle type.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setDialogMessage(error.response.data.message);
            } else {
                setDialogMessage('Failed to update vehicle type.');
            }
            onDialogOpen();
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/app/VehicleTypeDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/VehicleTypeDetails');
    };

    if (!vehicleTypeData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <PageHeader title="Edit Vehicle Type Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={{
                    type: vehicleTypeData.type || "",
                    isActive: vehicleTypeData.status === "true"
                }}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between vertical-container">
                            <div className="flex flex-col gap-6 mt-5">
                                <div className="flex flex-col gap-3">
                                    <p>Vehicle Type</p>
                                    <Field name="type" validate={(value) => {
                                        let error;
                                        if (!value) {
                                            error = "Vehicle type is required.";
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
                                                    id="type"
                                                    placeholder="Vehicle Type"
                                                />
                                                {errors.type && touched.type && (
                                                    <div className="text-red-500">{errors.type}</div>
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
                                            isLoading={isSubmitting}
                                            disabled={isSubmitting}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <img src={editVehicleTypeImage} alt="Edit Vehicle Type" width="400" height="400"
                                     className="mr-14" />
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay />
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="35%"
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
