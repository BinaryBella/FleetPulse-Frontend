import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import {useNavigate} from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Checkbox,
    Input,
    Image as ChakraImage,
    Select,
    SimpleGrid,
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import {axiosApi} from "../interceptor.js";

export default function AddAccidentDetails() {
    const toLocalISOString = (date) => {
        const localDate = new Date(date - date.getTimezoneOffset() * 60000); //offset in milliseconds. Credit https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset

        // Optionally remove second/millisecond if needed
        localDate.setSeconds(null);
        localDate.setMilliseconds(null);
        return localDate.toISOString().slice(0, -1);
    };
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        isOpen: isDialogOpen,
        onOpen: onDialogOpen,
        onClose: onDialogClose,
    } = useDisclosure();
    const {
        isOpen: isSuccessDialogOpen,
        onOpen: onSuccessDialogOpen,
        onClose: onSuccessDialogClose,
    } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");
    const [vehicleRegNoDetails, setVehicleRegNoDetails] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [NICs, setNICs] = useState([]); // State to store NICs
    const [initialValues, setInitialValues] = useState({
        dateTime: toLocalISOString(new Date()),
        venue: "",
        vehicleRegistrationNumber: "",
        driverNIC: "",
        loss: 56,
        specialNotes: "",
        photos: [],
        driverInjuredStatus: false,
        helperInjuredStatus: false,
        vehicleDamagedStatus: false,
    });

    const breadcrumbs = [
        {label: "Accident", link: "/app/AccidentDetails"},
        {label: "Accident Details", link: "/app/AccidentDetails"},
        {label: "Add Accident Details", link: "/app/AddAccidentDetails"},
    ];

    const handleFileChange = (event, setFieldValue) => {
        const files = Array.from(event.target.files);
        if (files.length > 5) {
            setDialogMessage("You can only upload a maximum of 5 images.");
            onDialogOpen();
            return;
        }

        const imageFiles = files.filter((file) => file.type.startsWith("image/"));
        if (imageFiles.length !== files.length) {
            setDialogMessage("Only image files are allowed.");
            onDialogOpen();
            return;
        }

        setSelectedFiles(imageFiles);
        setFieldValue("photos", imageFiles);
    };

    const validateAccidentInfo = (values) => {
        const errors = {};
        const requiredFields = [
            "vehicleRegistrationNumber",
            "venue",
            "dateTime",
            "driverNIC",
        ];
        requiredFields.forEach((field) => {
            if (!values[field]) {
                errors[field] = `${
                    field.charAt(0).toUpperCase() +
                    field
                        .slice(1)
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                } is required`;
            }
        });

        if (
            errors["dateTime"] !== undefined &&
            !errors["dateTime"].includes("required")
        ) {
            const selectedDate = new Date(values["dateTime"]);
            const currentDate = new Date();
            if (selectedDate > currentDate) {
                errors["dateTime"] = "Please select today or a past date & time.";
            }
        }

        return errors;
    };

    // Function to fetch vehicle registration numbers
    const fetchVehicleRegNos = async () => {
        try {
            const response = await axiosApi.get(
                "https://localhost:7265/api/Vehicles"
            );
            setVehicleRegNoDetails(response.data);
            console.log("Vehicle registration numbers fetched:", response.data);
        } catch (error) {
            console.error("Error fetching vehicle registration numbers:", error);
        }
    };

    // Function to fetch driver NICs
    const fetchDriverNICs = async () => {
        try {
            const response = await axiosApi.get(
                "https://localhost:7265/api/Auth/drivers/nics"
            );
            // Remove duplicates
            const uniqueNICs = [...new Set(response.data)];
            setNICs(uniqueNICs);
            console.log("Driver NICs fetched:", uniqueNICs);
        } catch (error) {
            console.error("Error fetching driver NICs:", error);
        }
    };

    const handleSubmit = async (values) => {
        console.log("Form values before submission:", formData);
        try {
            setIsSubmitting(true);
            // Create a FormData object
            const data = new FormData();

            // Append the JSON stringified accidentData to formData
            data.append("dateTime", formData.dateTime);
            data.append("venue", formData.venue);
            data.append("vehicleRegistrationNumber", formData.vehicleRegistrationNumber);
            data.append("driverNIC", formData.driverNIC);
            data.append("loss", formData.loss);
            data.append("specialNotes", formData.specialNotes);
            data.append("driverInjuredStatus", formData.driverInjuredStatus);
            data.append("helperInjuredStatus", formData.helperInjuredStatus);
            data.append("vehicleDamagedStatus", formData.vehicleDamagedStatus);

            // Append each photo file
            if (values.photos && values.photos.length > 0) {
                for (let i = 0; i < values.photos.length; i++) {
                    data.append("photos", values.photos[i]);
                }
            }

            try {
                const response = await axiosApi.post(
                    "https://localhost:7265/api/Accidents",
                    data,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                console.log("Response:", response.data);
                setSuccessDialogMessage("Accident details added successfully.");
                onSuccessDialogOpen();
                // Handle successful response
            } catch (error) {
                console.error("Error:", error);

                // Handle error
            }

            //   setIsSubmitting(true);
            //   formData.photos = values.photos;

            //   console.log(formData);

            //   const response = await axiosApi.post(
            //     "https://localhost:7265/api/Accidents",
            //     formData,
            //     {
            //       headers: {
            //         "Content-Type": "multipart/form-data",
            //       },
            //     }
            //   );

            //   debugger;
            //   if (!response.data.status) {
            //     throw new Error(
            //       response.data.message || "Failed to add accident details."
            //     );
            //   }

            setSuccessDialogMessage("Accident details added successfully.");
            onSuccessDialogOpen();
        } catch (error) {
            setDialogMessage(error.message || "Failed to add accident details.");
            onDialogOpen();
        }
    };

    const handleCancel = () => {
        navigate("/app/AccidentDetails");
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate("/app/AccidentDetails");
    };

    const handleTabsChange = (index) => {
        if (index > activeTab) {
            // Only allow moving forward if the form is valid
            validateForm().then((errors) => {
                if (Object.keys(errors).length === 0) {
                    setActiveTab(index);
                }
            });
        } else {
            // Allow moving backward freely
            setActiveTab(index);
        }
    };

    useEffect(() => {
        fetchVehicleRegNos();
        fetchDriverNICs(); // Fetch NICs when the component mounts
    }, []);

    return (
        <>
            <PageHeader title="Add Accident Details" breadcrumbs={breadcrumbs}/>
            <Box>
                <Tabs index={activeTab} onChange={handleTabsChange}>
                    <TabList>
                        <Tab _selected={{color: "white", bg: theme.purple}}>
                            Accident Details
                        </Tab>
                        <Tab _selected={{color: "white", bg: theme.purple}}>
                            Upload Photos
                        </Tab>
                    </TabList>
                    <TabIndicator
                        mt="-1.5px"
                        height="2px"
                        bg="#5858af"
                        borderRadius="1px"
                    />
                    <TabPanels>
                        <TabPanel>
                            <Formik
                                initialValues={initialValues}
                                onSubmit={(values) => {
                                    setFormData((prevData) => ({...prevData, ...values}));
                                    console.log(formData);
                                    setActiveTab(1);
                                }}
                                validate={validateAccidentInfo}
                            >
                                {({errors, touched, isValid}) => (
                                    <Form>
                                        <div className="grid grid-cols-2 gap-10 mt-8">
                                            <Field
                                                name="dateTime"
                                                validate={(value) => {
                                                    let error;
                                                    if (!value) {
                                                        error = "Date & Time is required.";
                                                    } else {
                                                        const selectedDate = new Date(value);
                                                        const currentDate = new Date();
                                                        if (selectedDate > currentDate) {
                                                            error =
                                                                "Please select today or a past date & time.";
                                                        }
                                                    }
                                                    return error;
                                                }}
                                            >
                                                {({field, form}) => (
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
                                                            max={
                                                                new Date().toISOString().split("T")[0] +
                                                                "T23:59"
                                                            }
                                                        />
                                                        {form.errors.dateTime && form.touched.dateTime && (
                                                            <div className="text-red-500">
                                                                {form.errors.dateTime}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                            <Field name="venue">
                                                {({field, form}) => (
                                                    <div className="flex flex-col gap-3">
                                                        <p>Venue</p>
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
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
                                                            <div className="text-red-500">
                                                                {form.errors.venue}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                            <Field
                                                name="vehicleRegistrationNumber"
                                                validate={(value) => {
                                                    let error;
                                                    if (!value) {
                                                        error = "Vehicle Registration No is required.";
                                                    }
                                                    return error;
                                                }}
                                            >
                                                {({field}) => (
                                                    <div className="flex flex-col gap-3">
                                                        <p>Vehicle Registration No</p>
                                                        <Select
                                                            {...field}
                                                            placeholder="Vehicle Registration No"
                                                            size="md"
                                                            variant="filled"
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
                                                        {errors.vehicleRegistrationNumber &&
                                                            touched.vehicleRegistrationNumber && (
                                                                <div className="text-red-500">
                                                                    {errors.vehicleRegistrationNumber}
                                                                </div>
                                                            )}
                                                    </div>
                                                )}
                                            </Field>
                                            <Field
                                                name="driverNIC"
                                                validate={(value) => {
                                                    let error;
                                                    if (!value || value === "") {
                                                        error = "Driver NIC is required.";
                                                    }
                                                    return error;
                                                }}
                                            >
                                                {({field}) => (
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
                                                        {errors.driverNIC && touched.driverNIC && (
                                                            <div className="text-red-500">
                                                                Driver NIC is required.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Field>
                                            <Field name="loss">
                                                {({field}) => (
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
                                                {({field}) => (
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
                                                <Field name="driverInjuredStatus">
                                                    {({field}) => (
                                                        <Checkbox
                                                            {...field}
                                                            size="lg"
                                                            isChecked={field.value}
                                                        >
                                                            Driver Injured
                                                        </Checkbox>
                                                    )}
                                                </Field>
                                                <Field name="helperInjuredStatus">
                                                    {({field}) => (
                                                        <Checkbox
                                                            {...field}
                                                            size="lg"
                                                            isChecked={field.value}
                                                        >
                                                            Helper Injured
                                                        </Checkbox>
                                                    )}
                                                </Field>
                                                <Field name="vehicleDamagedStatus">
                                                    {({field}) => (
                                                        <Checkbox
                                                            {...field}
                                                            size="lg"
                                                            isChecked={field.value}
                                                        >
                                                            Vehicle Damaged
                                                        </Checkbox>
                                                    )}
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-10 mr-14">
                                            <Button
                                                bg="gray.400"
                                                _hover={{bg: "gray.500"}}
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
                                                _hover={{bg: theme.onHoverPurple}}
                                                color="#ffffff"
                                                variant="solid"
                                                w="180px"
                                                marginTop="10"
                                                type="submit"
                                                isDisabled={!isValid}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </TabPanel>
                        <TabPanel>
                            <Formik
                                initialValues={{...initialValues, ...formData}}
                                onSubmit={handleSubmit}
                            >
                                {({errors, touched, setFieldValue}) => (
                                    <Form>
                                        <div className="w-full">
                                            <Field
                                                name="photos"
                                                validate={(value) => {
                                                    let error;
                                                    if (value && value.length > 5) {
                                                        error = "You can upload a maximum of 5 photos.";
                                                    }
                                                    return error;
                                                }}
                                            >
                                                {({field, form}) => (
                                                    <div
                                                        className="flex flex-col gap-3 p-10"
                                                        style={{background: "#E2E8F0"}}
                                                    >
                                                        <label
                                                            form="img-upload"
                                                            style={{
                                                                cursor: "pointer",
                                                                width: "100%",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            Click Here To Add Photos (Maximum 5 Photos)
                                                            <Input
                                                                id="img-upload"
                                                                type="file"
                                                                variant="filled"
                                                                style={{display: "none"}}
                                                                accept="image/*"
                                                                multiple
                                                                onChange={(event) =>
                                                                    handleFileChange(event, form.setFieldValue)
                                                                }
                                                            />
                                                            {form.errors.photos && form.touched.photos && (
                                                                <div className="text-red-500">
                                                                    {form.errors.photos}
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                )}
                                            </Field>
                                        </div>
                                        <div className="mt-10 flex gap-4">
                                            {selectedFiles.map((file, index) => (
                                                <Box
                                                    key={index}
                                                    borderWidth={1}
                                                    borderRadius="lg"
                                                    overflow="hidden"
                                                >
                                                    <ChakraImage
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        objectFit="cover"
                                                        boxSize="200px"
                                                    />
                                                </Box>
                                            ))}
                                        </div>
                                        <div className="flex justify-end gap-10 mr-14">
                                            <Button
                                                bg="gray.400"
                                                _hover={{bg: "gray.500"}}
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
                                                _hover={{bg: theme.onHoverPurple}}
                                                color="#ffffff"
                                                variant="solid"
                                                w="180px"
                                                marginTop="10"
                                                type="submit"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

            {isDialogOpen && <AlertDialog
                isOpen={isDialogOpen}
                leastDestructiveRef={undefined}
                onClose={onDialogClose}
                isCentered={true}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Error</AlertDialogHeader>
                        <AlertDialogBody>{dialogMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onDialogClose} colorScheme="red">
                                OK
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>}

            {isSuccessDialogOpen && <AlertDialog
                isOpen={isSuccessDialogOpen}
                leastDestructiveRef={undefined}
                onClose={handleSuccessDialogClose}
                isCentered={true}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader>Success</AlertDialogHeader>
                        <AlertDialogBody>{successDialogMessage}</AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                onClick={handleSuccessDialogClose}
                                bg={theme.purple}
                                _hover={{bg: theme.onHoverPurple}}
                                color="white"
                                variant="solid" mr={3}>
                                Ok
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>}
        </>
    );
}
