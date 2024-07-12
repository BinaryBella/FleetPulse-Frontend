import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { Button, Checkbox, Input, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useDisclosure } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import axios from 'axios';

export default function AddVehicleDetails() {
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");

    const breadcrumbs = [
        { label: "Vehicle", link: "/" },
        { label: "Vehicle DetailsTable", link: "/app/VehicleDetailsTable" },
        { label: "Add Vehicle Details", link: "/app/AddvehicleDetails" },
    ];

    const [Manufacture, setManufacture] = useState();
    const [VehicleType, setVehicleType] = useState();
    // const [FuelType, setFuelType] = useState();


    useEffect(() => {
        axios.get('https://localhost:7265/api/Manufacture')
            .then(response => {
                console.log('Manufacture data fetched:', response.data);
                setManufacture(response.data);
            })
            .catch(error => {
                console.error('Error fetching manufacture data:', error);
            });

        axios.get('https://localhost:7265/api/VehicleType')
            .then(response => {
                console.log('type  data fetched:', response.data);
                setVehicleType(response.data);
            })
            .catch(error => {
                console.error('Error fetching manufacture data:', error);
            });


    }, []);

    const handleSubmit = async (values) => {
        try {

            console.log(values)

            const vehicleTypeMap = {};
            VehicleType.forEach(type => {
                vehicleTypeMap[type.type] = type.vehicleTypeId;
            });


            const manufactureMap = {};
            Manufacture.forEach(manufacture => {
                manufactureMap[manufacture.manufacturer] = manufacture.manufactureId;
            });


            const fuelRefillMap = {
                'Diesel': 1,
                'Petrol': 2,

            };

            values = {
                vehicleRegistrationNo: values.vehicleRegistrationNo,
                licenseNo: values.licenseNo,
                licenseExpireDate: values.licenseExpireDate,
                vehicleColor: values.vehicleColor,
                vehicleTypeId: vehicleTypeMap[values.vehicleTypeId], // use map to convert to integer
                manufactureId: manufactureMap[values.manufactureId], // use map to convert to integer
                fuelRefillId: fuelRefillMap[values.fuelRefillId], // use map to convert to integer
                isActive: values.isActive
            };
            console.log('this is values whch sub',values)
            axios.post('https://localhost:7265/api/Vehicle', values)
                .then(response => {
                    setSuccessDialogMessage('Vehicle details added successfully.');
                    onSuccessDialogOpen();
                    console.log('Data added', response.data);
                })
                .catch(error => {
                    console.error('There was an error adding the data!', error);
                });


            const data = await response.json();

            if (!response.ok) {
                throw new Error('Failed to add vehicle details.');
            }

        } catch (error) {
            setDialogMessage( 'Failed to add vehicle details.');
            onDialogOpen();
        }
    };

    const handleCancel = () => {
        navigate('/app/VehicleDetailsTable');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/VehicleDetailsTable');
    };


    return (
        <>
            <PageHeader title="Add Vehicle Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={{
                    vehicleRegistrationNo: "",
                    licenseNo: "",
                    licenseExpireDate: "",
                    vehicleColor: "",
                    vehicleTypeId: "",
                    manufactureId: "",
                    fuelRefillId: "",
                    isActive: false,
                }}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="grid grid-cols-2 gap-10 mt-8">
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Registration No</p>
                            <Field name="vehicleRegistrationNo" validate={(value) => {
                                let error;
                                if (!value) {
                                    error = "Vehicle registration number is required.";
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
                                            id="vehicleRegistrationNo"
                                            placeholder="Enter Vehicle Registration No"
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
                                            width="500px"
                                            id="licenseNo"
                                            placeholder="Enter License No"
                                        />
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
                                            width="500px"
                                            id="licenseExpireDate"
                                        />
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
                                            width="500px"
                                            id="vehicleColor"
                                            placeholder="Enter Vehicle Color"
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Type</p>
                            <Field name="vehicleTypeId">
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
                                            id="vehicleTypeId"
                                            placeholder="Enter Vehicle Type"
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p>Manufacture</p>
                            <Field name="manufactureId">
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
                                            id="manufactureId"
                                            placeholder="Enter Manufacture"
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p>Fuel Type</p>
                            <Field name="fuelRefillId">
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
                                            id="fuelRefillId"
                                            placeholder="Enter Fuel Type"
                                        />
                                    </div>
                                )}
                            </Field>
                        </div>

                        <Field name="isActive">
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
                                    {form.errors.isActive && form.touched.isActive && (
                                        <div className="text-red-500">{form.errors.isActive}</div>
                                    )}
                                </div>
                            )}
                        </Field>
                        <div className="flex w-5/6 justify-end gap-10">
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
