import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Formik, Form, Field} from 'formik';
import {
    Select,
    Button,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Checkbox
} from '@chakra-ui/react';
import {axiosApi} from "../interceptor.js";
import PageHeader from '../components/PageHeader.jsx';
import theme from '../config/ThemeConfig.jsx';
import Maintenance from "../assets/images/maintenance.png";

const EditVehicleMaintenanceConfiguration = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose} = useDisclosure();
    const {isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose} = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState('');
    const [successDialogMessage, setSuccessDialogMessage] = useState('');
    const [maintenanceTypeDetails, setMaintenanceTypeDetails] = useState([]);
    const [vehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [initialValues, setInitialValues] = useState({
        vehicleRegistrationNo: '',
        maintenanceType: '',
        duration: '',
        isActive: false,
    });

    const fetchVehicleRegNos = async () => {
        try {
            const response = await axiosApi.get('https://localhost:7265api/Vehicles');
            setVehicleRegNoDetails(response.data);
        } catch (error) {
            console.error('Error fetching vehicle registration numbers:', error);
            setVehicleRegNoDetails([]);
        }
    };

    const fetchVehicleMaintenanceTypes = async () => {
        try {
            const response = await axiosApi.get('https://localhost:7265api/VehicleMaintenanceType');
            setMaintenanceTypeDetails(response.data);
        } catch (error) {
            console.error('Error fetching vehicle maintenance types:', error);
        }
    };

    const fetchMaintenanceConfiguration = async () => {
        try {
            const response = await axiosApi.get(`https://localhost:7265api/VehicleMaintenanceConfiguration/${id}`);
            setInitialValues({
                vehicleRegistrationNo: response.data.vehicleId.toString(),
                maintenanceType: response.data.vehicleMaintenanceTypeId.toString(),
                duration: response.data.duration,
                isActive: response.data.status,
            });
        } catch (error) {
            console.error('Error fetching maintenance configuration:', error);
            setDialogMessage('Failed to fetch maintenance configuration.');
            onDialogOpen();
        }
    };

    useEffect(() => {
        fetchVehicleMaintenanceTypes();
        fetchVehicleRegNos();
        fetchMaintenanceConfiguration();
    }, [id]);

    const breadcrumbs = [
        {label: 'Vehicle', link: '/app/Vehicle'},
        {label: 'Vehicle Maintenance Configuration', link: '/app/VehicleMaintenanceConfigurationTable'},
        {label: 'Edit Vehicle Maintenance Configuration', link: `/app/VehicleMaintenanceConfiguration/edit/${id}`}
    ];

    const handleSubmit = async (values) => {
        try {
            const selectedVehicle = vehicleRegNoDetails.find(vehicle => vehicle.vehicleId === parseInt(values.vehicleRegistrationNo));
            const selectedMaintenanceType = maintenanceTypeDetails.find(type => type.id === parseInt(values.maintenanceType));

            const payload = {
                id: parseInt(id),
                vehicleId: selectedVehicle ? selectedVehicle.vehicleId : null,
                vehicleRegistrationNo: selectedVehicle ? selectedVehicle.vehicleRegistrationNo : '',
                vehicleMaintenanceTypeId: selectedMaintenanceType ? selectedMaintenanceType.id : null,
                typeName: selectedMaintenanceType ? selectedMaintenanceType.typeName : '',
                duration: values.duration,
                status: values.isActive
            };

            console.log('Update Payload:', payload);

            const response = await axiosApi.put(`https://localhost:7265api/VehicleMaintenanceConfiguration/${id}`, payload);

            console.log('Update Response:', response);

            // If we reach this point, it means the request was successful
            setSuccessDialogMessage('Maintenance configuration updated successfully');
            onSuccessDialogOpen();
        } catch (error) {
            console.error('Update Error:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 400) {
                    setDialogMessage('Invalid data submitted. Please check your inputs.');
                } else if (error.response.status === 404) {
                    setDialogMessage('Maintenance configuration not found. It may have been deleted.');
                } else {
                    setDialogMessage(error.response.data.message || 'An error occurred while updating the configuration.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                setDialogMessage('No response received from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setDialogMessage('An error occurred while sending the update request.');
            }
            onDialogOpen();
        }
    };

    const handleCancel = () => {
        navigate('/app/VehicleMaintenanceConfigurationTable');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/VehicleMaintenanceConfigurationTable');
    };

    return (
        <>
            <PageHeader title="Edit Vehicle Maintenance Configuration" breadcrumbs={breadcrumbs}/>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validate={(values) => {
                    const errors = {};
                    if (!values.vehicleRegistrationNo) {
                        errors.vehicleRegistrationNo = 'Vehicle registration number is required';
                    }
                    if (!values.maintenanceType) {
                        errors.maintenanceType = 'Maintenance type is required';
                    }
                    if (!values.duration) {
                        errors.duration = 'Duration is required';
                    }
                    return errors;
                }}
            >
                {({errors, touched}) => (
                    <Form className="flex justify-between vertical-container">
                        <div className="flex flex-col gap-6 mt-5 w-1/4">
                            <p>Vehicle Registration No</p>
                            <Field name="vehicleRegistrationNo">
                                {({field}) => (
                                    <div>
                                        <Select
                                            {...field}
                                            placeholder="Vehicle Registration No"
                                            variant="filled"
                                            borderRadius="md"
                                            size="md"
                                            width="100%"
                                            value={field.value}
                                        >
                                            {vehicleRegNoDetails.map((option, index) => (
                                                <option key={index}
                                                        value={option.vehicleId}>
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
                            <p>Vehicle Maintenance Type</p>
                            <Field name="maintenanceType">
                                {({field}) => (
                                    <div>
                                        <Select
                                            {...field}
                                            placeholder="Vehicle Maintenance Type"
                                            variant="filled"
                                            borderRadius="md"
                                            size="md"
                                            width="100%"
                                        >
                                            {maintenanceTypeDetails.map((option, index) => (
                                                <option key={index} value={option.id}>
                                                    {option.typeName}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.maintenanceType && touched.maintenanceType && (
                                            <div className="text-red-500">{errors.maintenanceType}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <p>Duration</p>
                            <Field name="duration">
                                {({field}) => (
                                    <div>
                                        <Select
                                            {...field}
                                            placeholder="Duration"
                                            variant="filled"
                                            borderRadius="md"
                                            size="md"
                                            width="100%"
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="3months">Every 3 Months</option>
                                            <option value="6months">Every 6 Months</option>
                                            <option value="yearly">Yearly</option>
                                        </Select>
                                        {errors.duration && touched.duration && (
                                            <div className="text-red-500">{errors.duration}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <Field name="isActive">
                                {({field, form}) => (
                                    <div>
                                        <Checkbox
                                            {...field}
                                            size='lg'
                                            isChecked={field.value}
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
                            <div className="flex gap-4 mt-10">
                                <Button
                                    bg="gray.400"
                                    _hover={{bg: 'gray.500'}}
                                    color="#ffffff"
                                    variant="solid"
                                    size="md"
                                    width="50%"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    bg={theme.purple}
                                    _hover={{bg: theme.onHoverPurple}}
                                    color="#ffffff"
                                    variant="solid"
                                    size="md"
                                    width="50%"
                                    type="submit"
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <img src={Maintenance} alt="Change Password" width="400" height="400" className="mr-14"/>
                        </div>
                    </Form>
                )}
            </Formik>

            {isDialogOpen && <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay/>
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="35%"
                    transform="translate(-50%, -50%)"
                >
                    <AlertDialogHeader>Error</AlertDialogHeader>
                    <AlertDialogBody>{dialogMessage}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={onDialogClose}>
                            Close
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>}

            {isSuccessDialogOpen && <AlertDialog isOpen={isSuccessDialogOpen} onClose={onSuccessDialogClose} motionPreset="slideInBottom">
                <AlertDialogOverlay/>
                <AlertDialogContent
                    position="absolute"
                    top="30%"
                    left="35%"
                    transform="translate(-50%, -50%)"
                >
                    <AlertDialogHeader>Success</AlertDialogHeader>
                    <AlertDialogBody>{successDialogMessage}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button bg={theme.purple} color="#FFFFFF" onClick={handleSuccessDialogClose}>
                            Ok
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>}
        </>
    );
};

export default EditVehicleMaintenanceConfiguration;
