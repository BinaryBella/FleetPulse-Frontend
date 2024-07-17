// import { useState, useEffect } from "react";
// import { Formik, Form, Field } from "formik";
// import { useNavigate } from "react-router-dom";
// import PageHeader from "../components/PageHeader.jsx";
// import {
//     Button,
//     Checkbox,
//     Input,
//     Select,
//     useDisclosure,
//     AlertDialog,
//     AlertDialogOverlay,
//     AlertDialogContent,
//     AlertDialogHeader,
//     AlertDialogBody,
//     AlertDialogFooter
// } from "@chakra-ui/react";
// import theme from "../config/ThemeConfig.jsx";

// export default function AddTripDetails() {
//     const navigate = useNavigate();
//     const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
//     const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
//     const [dialogMessage, setDialogMessage] = useState("");
//     const [successDialogMessage, setSuccessDialogMessage] = useState("");

//     const [vehicleRegNos, setVehicleRegNos] = useState([]);
//     const [driverNICs, setDriverNICs] = useState([]);
//     const [helperNICs, setHelperNICs] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [vehicleResponse, driverResponse, helperResponse] = await Promise.all([
//                     fetch('https://localhost:7265/api/Vehicle'),
//                     fetch('https://localhost:7265/api/Driver'),
//                     fetch('https://localhost:7265/api/Helper')
//                 ]);

//                 const vehicleData = await vehicleResponse.json();
//                 console.log(vehicleData);
//                 const driverData = await driverResponse.json();
//                 const helperData = await helperResponse.json();

//                 setVehicleRegNos(vehicleData);
//                 setDriverNICs(driverData);
//                 setHelperNICs(helperData);
//             } catch (error) {
//                 setDialogMessage('Failed to fetch data from server.');
//                 onDialogOpen();
//             }
//         };

//         fetchData();
//     }, []);

//     const breadcrumbs = [
//         { label: 'Trip', link: '/app/TripDetails' },
//         { label: 'Trip Details', link: '/app/TripDetails' },
//         { label: 'Add Trip Details', link: '/app/AddTripDetails' }
//     ];

//     const handleSubmit = async (values) => {
//         try {
//             const response = await fetch('https://localhost:7265/api/Trip', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     VehicleRegNo: values.VehicleRegNo,
//                     DriverNIC: values.DriverNIC,
//                     HelperNIC: values.HelperNIC,
//                     Date: values.Date,
//                     StartTime: values.StartTime,
//                     EndTime: values.EndTime,
//                     StartMeterValue: values.StartMeterValue,
//                     EndMeterValue: values.EndMeterValue,
//                     IsActive: values.IsActive
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to add trip details.');
//             }

//             setSuccessDialogMessage('Trip details added successfully.');
//             onSuccessDialogOpen();
//         } catch (error) {
//             setDialogMessage(error.message || 'Failed to add trip details.');
//             onDialogOpen();
//         }
//     };

//     const handleCancel = () => {
//         navigate('/app/TripDetails');
//     };

//     const handleSuccessDialogClose = () => {
//         onSuccessDialogClose();
//         navigate('/app/TripDetails');
//     };

//     return (
//         <>
//             <PageHeader title="Add Trip Details" breadcrumbs={breadcrumbs} />
//             <Formik
//                 initialValues={{
//                     VehicleRegNo: "",
//                     DriverNIC: "",
//                     HelperNIC: "",
//                     Date: "",
//                     StartTime: "",
//                     EndTime: "",
//                     StartMeterValue: 0,
//                     EndMeterValue: 0,
//                     IsActive: true
//                 }}
//                 onSubmit={handleSubmit}
//             >
//                 {({ errors, touched }) => (
//                     <Form className="grid grid-cols-2 gap-10 mt-8">
//                         <div className="flex flex-col gap-3">
//                             <p>Vehicle Registration No</p>
//                             <Field name="vehicleRegistrationNo" validate={(value) => {
//                                 let error;
//                                 if (!value) {
//                                     error = "Vehicle registration number is required.";
//                                 }
//                                 return error;
//                             }}>
//                                 {({ field }) => (
//                                     <div>
//                                         <Select
//                                             {...field}
//                                             variant="filled"
//                                             borderRadius="md"
//                                             px={3}
//                                             py={2}
//                                             mt={1}
//                                             width="400px"
//                                             placeholder="Vehicle Registration No"
//                                         >
//                                             {vehicleRegNos.map((vehicle) => (
//                                                 <option key={vehicle.id} value={vehicle.vehicleRegistrationNo}>
//                                                     {vehicle.vehicleRegistrationNo}
//                                                 </option>
//                                             ))}
//                                         </Select>
//                                         {errors.VehicleRegNo && touched.VehicleRegNo && (
//                                             <div className="text-red-500">{errors.VehicleRegNo}</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <p>Driver's NIC</p>
//                             <Field name="DriverNIC" validate={(value) => {
//                                 let error;
//                                 if (!value) {
//                                     error = "Driver's NIC is required.";
//                                 }
//                                 return error;
//                             }}>
//                                 {({ field }) => (
//                                     <div>
//                                         <Select
//                                             {...field}
//                                             variant="filled"
//                                             borderRadius="md"
//                                             px={3}
//                                             py={2}
//                                             mt={1}
//                                             width="400px"
//                                             placeholder="Driver's NIC"
//                                         >
//                                             {driverNICs.map((driver) => (
//                                                 <option key={driver.id} value={driver.nic}>
//                                                     {driver.nic}
//                                                 </option>
//                                             ))}
//                                         </Select>
//                                         {errors.DriverNIC && touched.DriverNIC && (
//                                             <div className="text-red-500">{errors.DriverNIC}</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <p>Helper's NIC</p>
//                             <Field name="HelperNIC" validate={(value) => {
//                                 let error;
//                                 if (!value) {
//                                     error = "Helper's NIC is required.";
//                                 }
//                                 return error;
//                             }}>
//                                 {({ field }) => (
//                                     <div>
//                                         <Select
//                                             {...field}
//                                             variant="filled"
//                                             borderRadius="md"
//                                             px={3}
//                                             py={2}
//                                             mt={1}
//                                             width="400px"
//                                             placeholder="Helper's NIC"
//                                         >
//                                             {helperNICs.map((helper) => (
//                                                 <option key={helper.id} value={helper.nic}>
//                                                     {helper.nic}
//                                                 </option>
//                                             ))}
//                                         </Select>
//                                         {errors.HelperNIC && touched.HelperNIC && (
//                                             <div className="text-red-500">{errors.HelperNIC}</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <p>Date</p>
//                             <Field name="Date" validate={(value) => {
//                                 let error;
//                                 if (!value) {
//                                     error = "Date is required.";
//                                 }
//                                 return error;
//                             }}>
//                                 {({ field }) => (
//                                     <div>
//                                         <Input
//                                             {...field}
//                                             type="date"
//                                             variant="filled"
//                                             borderRadius="md"
//                                             px={3}
//                                             py={2}
//                                             mt={1}
//                                             width="400px"
//                                             max={new Date().toISOString().split("T")[0]}
//                                             placeholder="Date"
//                                         />
//                                         {errors.Date && touched.Date && (
//                                             <div className="text-red-500">{errors.Date}</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <p>Start Time</p>
//                             <Field name="StartTime" validate={(value) => {
//                                 let error;
//                                 if (!value) {
//                                     error = "Start time is required.";
//                                 }
//                                 return error;
//                             }}>
//                                 {({ field }) => (
//                                     <div>
//                                         <Input
//                                             {...field}
//                                             type="time"
//                                             variant="filled"
//                                             borderRadius="md"
//                                             px={3}
//                                             py={2}
//                                             mt={1}
//                                             width="400px"
//                                             placeholder="Start Time"
//                                         />
//                                         {errors.StartTime && touched.StartTime && (
//                                             <div className="text-red-500">{errors.StartTime}</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <p>End Time</p>
//                             <Field name="EndTime" validate={(value) => {
//                                 let error;
//                                 if (!value) {
//                                     error = "End time is required.";
//                                 }
//                                 return error;
//                             }}>
//                                 {({ field }) => (
//                                     <div>
//                                         <Input
//                                             {...field}
//                                             type="time"
//                                             variant="filled"
//                                             borderRadius="md"
//                                             px={3}
//                                             py={2}
//                                             mt={1}
//                                             width="400px"
//                                             placeholder="End Time"
//                                         />
//                                         {errors.EndTime && touched.EndTime && (
//                                             <div className="text-red-500">{errors.EndTime}</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <p>Start Meter Value</p>
//                             <Field name="StartMeterValue" validate={(value) => {
//                                 let error;
//                                 if (value < 0) {
//                                     error = "Start meter value must be 0 or greater.";
//                                 }
//                                 return error;
//                             }}>
//                                 {({ field }) => (
//                                     <Input
//                                         {...field}
//                                         type="number"
//                                         variant="filled"
//                                         borderRadius="md"
//                                         px={3}
//                                         py={2}
//                                         mt={1}
//                                         width="400px"
//                                         placeholder="00.00"
//                                         step={0.01}
//                                     />
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <p>End Meter Value</p>
//                             <Field name="EndMeterValue" validate={(value) => {
//                                 let error;
//                                 if (value < 0) {
//                                     error = "End meter value must be 0 or greater.";
//                                 }
//                                 return error;
//                             }}>
//                                 {({ field }) => (
//                                     <Input
//                                         {...field}
//                                         type="number"
//                                         variant="filled"
//                                         borderRadius="md"
//                                         px={3}
//                                         py={2}
//                                         mt={1}
//                                         width="400px"
//                                         placeholder="00.00"
//                                         step={0.01}
//                                     />
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex flex-col gap-3">
//                             <Field name="IsActive" type="checkbox">
//                                 {({ field }) => (
//                                     <Checkbox
//                                         {...field}
//                                         size="lg"
//                                         defaultChecked={field.value}
//                                         className="mt-8"
//                                     >
//                                         Is Active
//                                     </Checkbox>
//                                 )}
//                             </Field>
//                         </div>
//                         <div className="flex w-5/6 justify-end gap-10">
//                             <Button
//                                 bg="gray.400"
//                                 _hover={{ bg: "gray.500" }}
//                                 color="#ffffff"
//                                 variant="solid"
//                                 w="230px"
//                                 marginTop="10"
//                                 onClick={handleCancel}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 bg={theme.purple}
//                                 _hover={{ bg: theme.onHoverPurple }}
//                                 color="#ffffff"
//                                 variant="solid"
//                                 w="230px"
//                                 marginTop="10"
//                                 type="submit"
//                             >
//                                 Save
//                             </Button>
//                         </div>
//                     </Form>
//                 )}
//             </Formik>

//             <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
//                 <AlertDialogOverlay />
//                 <AlertDialogContent
//                     position="absolute"
//                     top="30%"
//                     left="50%"
//                     transform="translate(-50%, -50%)"
//                 >
//                     <AlertDialogHeader>Error</AlertDialogHeader>
//                     <AlertDialogBody>
//                         {dialogMessage}
//                     </AlertDialogBody>
//                     <AlertDialogFooter>
//                         <Button bg={theme.purple} color="#FFFFFF" onClick={onDialogClose}>Close</Button>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>

//             <AlertDialog isOpen={isSuccessDialogOpen} onClose={handleSuccessDialogClose} motionPreset="slideInBottom">
//                 <AlertDialogOverlay />
//                 <AlertDialogContent
//                     position="absolute"
//                     top="30%"
//                     left="50%"
//                     transform="translate(-50%, -50%)"
//                 >
//                     <AlertDialogHeader>Success</AlertDialogHeader>
//                     <AlertDialogBody>
//                         {successDialogMessage}
//                     </AlertDialogBody>
//                     <AlertDialogFooter>
//                         <Button bg={theme.purple} color="#FFFFFF" onClick={handleSuccessDialogClose}>Ok</Button>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </>
//     );
// }

import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
    Button,
    Checkbox,
    Input,
    Select,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import {axiosApi} from "../interceptor.js";

export default function AddTripDetails() {
    const navigate = useNavigate();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
    const [dialogMessage, setDialogMessage] = useState("");
    const [successDialogMessage, setSuccessDialogMessage] = useState("");

    const [vehicleRegNos, setVehicleRegNos] = useState([]);
    const [driverNICs, setDriverNICs] = useState([]);
    const [helperNICs, setHelperNICs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehicleResponse, driverResponse, helperResponse] = await Promise.all([
                    fetch('https://localhost:7265/api/Vehicle'),
                    fetch('https://localhost:7265/api/Driver'),
                    fetch('https://localhost:7265/api/Helper')
                ]);

                const vehicleData = await vehicleResponse.json();
                console.log(vehicleData);
                const driverData = await driverResponse.json();
                const helperData = await helperResponse.json();

                setVehicleRegNos(vehicleData);
                setDriverNICs(driverData);
                setHelperNICs(helperData);
            } catch (error) {
                setDialogMessage('Failed to fetch data from server.');
                onDialogOpen();
            }
        };

        fetchData();
    }, []);

    const breadcrumbs = [
        { label: 'Trip', link: '/app/TripDetails' },
        { label: 'Trip Details', link: '/app/TripDetails' },
        { label: 'Add Trip Details', link: '/app/AddTripDetails' }
    ];

    const validate = (values) => {
        const errors = {};

        if (!values.VehicleRegNo) {
            errors.VehicleRegNo = "Vehicle registration number is required.";
        }

        if (!values.DriverNIC) {
            errors.DriverNIC = "Driver's NIC is required.";
        }

        if (!values.HelperNIC) {
            errors.HelperNIC = "Helper's NIC is required.";
        }

        if (!values.Date) {
            errors.Date = "Date is required.";
        }

        if (!values.StartTime) {
            errors.StartTime = "Start time is required.";
        }

        if (!values.EndTime) {
            errors.EndTime = "End time is required.";
        }

        if (values.StartTime && values.EndTime && values.StartTime >= values.EndTime) {
            errors.EndTime = "End time must be after start time.";
        }

        if (values.StartMeterValue < 0) {
            errors.StartMeterValue = "Start meter value must be 0 or greater.";
        }

        if (values.EndMeterValue < 0) {
            errors.EndMeterValue = "End meter value must be 0 or greater.";
        }

        if (values.StartMeterValue >= values.EndMeterValue) {
            errors.EndMeterValue = "End meter value must be greater than start meter value.";
        }

        return errors;
    };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        const errors = validate(values);
        if (Object.keys(errors).length) {
            setErrors(errors);
            setSubmitting(false);
            return;
        }

        try {
            const response = await axiosApi.post('https://localhost:7265/api/Trip', {
                VehicleRegNo: values.VehicleRegNo,
                DriverNIC: values.DriverNIC,
                HelperNIC: values.HelperNIC,
                Date: values.Date,
                StartTime: values.StartTime,
                EndTime: values.EndTime,
                StartMeterValue: values.StartMeterValue,
                EndMeterValue: values.EndMeterValue,
                IsActive: values.IsActive
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add trip details.');
            }

            setSuccessDialogMessage('Trip details added successfully.');
            onSuccessDialogOpen();
        } catch (error) {
            setDialogMessage(error.message || 'Failed to add trip details.');
            onDialogOpen();
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/app/TripDetails');
    };

    const handleSuccessDialogClose = () => {
        onSuccessDialogClose();
        navigate('/app/TripDetails');
    };

    return (
        <>
            <PageHeader title="Add Trip Details" breadcrumbs={breadcrumbs} />
            <Formik
                initialValues={{
                    VehicleRegNo: "",
                    DriverNIC: "",
                    HelperNIC: "",
                    Date: "",
                    StartTime: "",
                    EndTime: "",
                    StartMeterValue: 0,
                    EndMeterValue: 0,
                    IsActive: true
                }}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="grid grid-cols-2 gap-10 mt-8">
                        <div className="flex flex-col gap-3">
                            <p>Vehicle Registration No</p>
                            <Field name="VehicleRegNo">
                                {({ field }) => (
                                    <div>
                                        <Select
                                            {...field}
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                            placeholder="Vehicle Registration No"
                                        >
                                            {vehicleRegNos.map((vehicle) => (
                                                <option key={vehicle.id} value={vehicle.vehicleRegistrationNo}>
                                                    {vehicle.vehicleRegistrationNo}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.VehicleRegNo && touched.VehicleRegNo && (
                                            <div className="text-red-500">{errors.VehicleRegNo}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Driver's NIC</p>
                            <Field name="DriverNIC">
                                {({ field }) => (
                                    <div>
                                        <Select
                                            {...field}
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                            placeholder="Driver's NIC"
                                        >
                                            {driverNICs.map((driver) => (
                                                <option key={driver.id} value={driver.nic}>
                                                    {driver.nic}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.DriverNIC && touched.DriverNIC && (
                                            <div className="text-red-500">{errors.DriverNIC}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Helper's NIC</p>
                            <Field name="HelperNIC">
                                {({ field }) => (
                                    <div>
                                        <Select
                                            {...field}
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                            placeholder="Helper's NIC"
                                        >
                                            {helperNICs.map((helper) => (
                                                <option key={helper.id} value={helper.nic}>
                                                    {helper.nic}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.HelperNIC && touched.HelperNIC && (
                                            <div className="text-red-500">{errors.HelperNIC}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Date</p>
                            <Field name="Date">
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
                                            max={new Date().toISOString().split("T")[0]}
                                            placeholder="Date"
                                        />
                                        {errors.Date && touched.Date && (
                                            <div className="text-red-500">{errors.Date}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Start Time</p>
                            <Field name="StartTime">
                                {({ field }) => (
                                    <div>
                                        <Input
                                            {...field}
                                            type="time"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                            placeholder="Start Time"
                                        />
                                        {errors.StartTime && touched.StartTime && (
                                            <div className="text-red-500">{errors.StartTime}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>End Time</p>
                            <Field name="EndTime">
                                {({ field }) => (
                                    <div>
                                        <Input
                                            {...field}
                                            type="time"
                                            variant="filled"
                                            borderRadius="md"
                                            px={3}
                                            py={2}
                                            mt={1}
                                            width="400px"
                                            placeholder="End Time"
                                        />
                                        {errors.EndTime && touched.EndTime && (
                                            <div className="text-red-500">{errors.EndTime}</div>
                                        )}
                                    </div>
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>Start Meter Value</p>
                            <Field name="StartMeterValue">
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                        placeholder="00.00"
                                        step={0.01}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p>End Meter Value</p>
                            <Field name="EndMeterValue">
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="400px"
                                        placeholder="00.00"
                                        step={0.01}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Field name="IsActive" type="checkbox">
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        size="lg"
                                        defaultChecked={field.value}
                                        className="mt-8"
                                    >
                                        Is Active
                                    </Checkbox>
                                )}
                            </Field>
                        </div>
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
                    left="50%"
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
                    left="50%"
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
