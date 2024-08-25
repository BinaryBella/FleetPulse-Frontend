import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
    Button,
    Checkbox,
    Input,
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Textarea,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Select
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { axiosApi } from "../interceptor.js";

export default function AddAccidentDetails() {
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [vehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [NICs, setNICs] = useState([]); // State to store NICs

    const breadcrumbs = [
        { label: 'Accident', link: '/app/AccidentDetails' },
        { label: 'Accident Details', link: '/app/AccidentDetails' },
        { label: 'Add Accident Details', link: '/app/AddAccidentDetails' },
    ];

    // Function to fetch vehicle registration numbers
    const fetchVehicleRegNos = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Vehicles");
            setVehicleRegNoDetails(response.data);
            console.log("Vehicle registration numbers fetched:", response.data);
        } catch (error) {
            console.error("Error fetching vehicle registration numbers:", error);
        }
    };

    // Function to fetch driver NICs
    const fetchDriverNICs = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Auth/drivers/nics");
            // Remove duplicates
            const uniqueNICs = [...new Set(response.data)];
            setNICs(uniqueNICs);
            console.log("Driver NICs fetched:", uniqueNICs);
        } catch (error) {
            console.error("Error fetching driver NICs:", error);
        }
    };


    const handleSubmit = async (values) => {
        console.log("Form values before submission:", values);
        try {
            const response = await axiosApi.post('https://localhost:7265/api/Accidents', values);

            if (!response.data.ok) {
                throw new Error(response.data.message || 'Failed to add accident details.');
            }

            setSuccessDialogMessage('Accident details added successfully.');
            onSuccessDialogOpen();
        } catch (error) {
            setDialogMessage(error.message || 'Failed to add accident details.');
            onDialogOpen();
        }
    };


    const handleCancel = () => {
        navigate('/app/AccidentDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/AccidentDetails');
    };

    useEffect(() => {
        fetchVehicleRegNos();
        fetchDriverNICs(); // Fetch NICs when the component mounts
    }, []);

    return (
        <>
            <PageHeader title="Add Accident Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={{
                    dateTime: "",
                    venue: "",
                    vehicleRegistrationNo: "",
                    nic: "",
                    loss: 0,
                    specialNotes: "",
                    photos: [],
                    driverInjured: false,
                    helperInjured: false,
                    vehicleDamaged: false,

                }}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="grid gap-10 mt-8">
                        <Tabs position="relative" variant="unstyled">
                            <TabList>
                                <Tab>Accident Details</Tab>
                                <Tab>Upload Photos</Tab>
                            </TabList>
                            <TabIndicator mt="-1.5px" height="2px" bg="#5858af" borderRadius="1px" />
                            <TabPanels>
                                <TabPanel>
                                    <div className="grid grid-cols-2 gap-10 mt-8">
                                        <Field name="dateTime" validate={(value) => {
                                            let error;
                                            if (!value) {
                                                error = "Date & Time is required.";
                                            } else {
                                                const selectedDate = new Date(value);
                                                const currentDate = new Date();
                                                if (selectedDate > currentDate) {
                                                    error = "Please select today or a past date & time.";
                                                }
                                            }
                                            return error;
                                        }}>
                                            {({ field, form }) => (
                                                <div className="flex flex-col gap-3">
                                                    <p>Date & Time</p>
                                                    <Input
                                                        {...field}
                                                        type="datetime-local"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        placeholder="Date & Time"
                                                        max={new Date().toISOString().split('T')[0] + "T23:59"}
                                                    />
                                                    {form.errors.dateTime && form.touched.dateTime && (
                                                        <div className="text-red-500">{form.errors.dateTime}</div>
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                        <Field name="venue">
                                            {({ field, form }) => (
                                                <div className="flex flex-col gap-3">
                                                    <p>Venue</p>
                                                    <Input
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={field.onChange}
                                                        type="text"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        placeholder="Venue"
                                                    />
                                                    {form.errors.venue && form.touched.venue && (
                                                        <div className="text-red-500">{form.errors.venue}</div>
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                        <Field name="vehicleRegistrationNo" validate={(value) => {
                                            let error;
                                            if (!value) {
                                                error = "Vehicle Registration No is required.";
                                            }
                                            return error;
                                        }}>
                                            {({ field }) => (
                                                <div>
                                                    <p>Vehicle Registration No</p>
                                                    <Select
                                                        {...field}
                                                        placeholder='Vehicle Registration No'
                                                        size='md'
                                                        variant='filled'
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
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
                                        <Field name="nic">
                                            {({ field }) => (
                                                <div className="flex flex-col gap-3">
                                                    <p>Driver NIC</p>
                                                    <Select
                                                        {...field}
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        placeholder="NIC"
                                                    >
                                                        {NICs.map((nic) => (
                                                            <option key={nic} value={nic}>
                                                                {nic}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </div>
                                            )}
                                        </Field>
                                        <Field name="loss">
                                            {({ field }) => (
                                                <div className="flex flex-col gap-3">
                                                    <p>Loss</p>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        step="0.01"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        width="400px"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        placeholder="Loss"
                                                    />
                                                </div>
                                            )}
                                        </Field>
                                        <Field name="specialNotes">
                                            {({ field }) => (
                                                <div className="flex flex-col gap-3">
                                                    <p>Special Notes</p>
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
                                                </div>
                                            )}
                                        </Field>
                                        <div className="flex gap-7">
                                            <Field name="driverInjured">
                                                {({ field }) => (
                                                    <Checkbox {...field} size="lg" isChecked={field.value}>
                                                        Driver Injured
                                                    </Checkbox>
                                                )}
                                            </Field>
                                            <Field name="helperInjured">
                                                {({ field }) => (
                                                    <Checkbox {...field} size="lg" isChecked={field.value}>
                                                        Helper Injured
                                                    </Checkbox>
                                                )}
                                            </Field>
                                            <Field name="vehicleDamaged">
                                                {({ field }) => (
                                                    <Checkbox {...field} size="lg" isChecked={field.value}>
                                                        Vehicle Damaged
                                                    </Checkbox>
                                                )}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-10 mr-14">
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
                                            Next
                                        </Button>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="grid grid-cols-2 gap-10 mt-8">
                                        <Field name="photos" validate={(value) => {
                                            let error;
                                            if (value && value.length > 5) {
                                                error = "You can upload a maximum of 5 photos.";
                                            }
                                            return error;
                                        }}>
                                            {({ field, form }) => (
                                                <div className="flex flex-col gap-3">
                                                    <p>Photos</p>
                                                    <Input
                                                        {...field}
                                                        type="file"
                                                        variant="filled"
                                                        borderRadius="md"
                                                        px={3}
                                                        py={2}
                                                        mt={1}
                                                        width="400px"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(event) => {
                                                            const files = event.currentTarget.files;
                                                            const fileArray = Array.from(files);
                                                            if (fileArray.length > 5) {
                                                                form.setFieldError("photos", "You can upload a maximum of 5 photos.");
                                                            } else {
                                                                form.setFieldValue("photos", fileArray);
                                                            }
                                                        }}
                                                    />
                                                    {form.errors.photos && form.touched.photos && (
                                                        <div className="text-red-500">{form.errors.photos}</div>
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                    <div className="flex justify-end gap-10 mr-14">
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
                                            Submit
                                        </Button>
                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Form>
                )}
            </Formik>

            <AlertDialog
                isOpen={isDialogOpen}
                leastDestructiveRef={undefined}
                onClose={onDialogClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Error</AlertDialogHeader>
                        <AlertDialogBody>{dialogMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onDialogClose} colorScheme="red">OK</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <AlertDialog
                isOpen={isSuccessDialogOpen}
                leastDestructiveRef={undefined}
                onClose={handleSuccessDialogClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Success</AlertDialogHeader>
                        <AlertDialogBody>{successDialogMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={handleSuccessDialogClose} colorScheme="green">OK</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
