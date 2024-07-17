import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
  Box,
  Button,
  Checkbox,
  HStack,
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
  Select,
} from "@chakra-ui/react";
import { FaImage } from "react-icons/fa6";
import theme from "../config/ThemeConfig.jsx";
import {axiosApi} from "../interceptor.js";


export default function AddAccidentDetails() {
  const navigate = useNavigate();
  const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
  const { isOpen: isSuccessDialogOpen, onOpen: onSuccessDialogOpen, onClose: onSuccessDialogClose } = useDisclosure();
  const [dialogMessage, setDialogMessage] = useState("");
  const [successDialogMessage, setSuccessDialogMessage] = useState("");
  const [vehicleRegistrationNos, setVehicleRegistrationNos] = useState([]);
  const [driversNICs, setDriversNICs] = useState([]);
  const [helpersNICs, setHelpersNICs] = useState([]);

  const breadcrumbs = [
    { label: 'Accident', link: '/app/AccidentDetails' },
    { label: 'Accident Details', link: '/app/AccidentDetails' },
    { label: 'Add Accident Details', link: '/app/AddAccidentDetails' },
  ];

  useEffect(() => {
    // Fetch vehicle registration numbers
    axiosApi.get('https://localhost:7265/api/VehicleRegistrationNumbers')
      .then(response => {
        console.log('Vehicle Registration Numbers data fetched:', response.data);
        setVehicleRegistrationNos(response.data); // Assuming data is an array of vehicle registration numbers
      })
      .catch(error => {
        console.error('Error fetching vehicle registration numbers:', error);
      });

    // Fetch drivers' NICs
    axios.get('https://localhost:7265/api/DriversNICs')
      .then(response => {
        console.log('Drivers NICs data fetched:', response.data);
        setDriversNICs(response.data); // Assuming data is an array of drivers' NICs
      })
      .catch(error => {
        console.error('Error fetching drivers NICs:', error);
      });

    // Fetch helpers' NICs
    axios.get('https://localhost:7265/api/HelpersNICs')
      .then(response => {
        console.log('Helpers NICs data fetched:', response.data);
        setHelpersNICs(response.data); // Assuming data is an array of helpers' NICs
      })
      .catch(error => {
        console.error('Error fetching helpers NICs:', error);
      });
  }, []);

  const handleSubmit = async (values) => {
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

  return (
    <>
      <PageHeader title="Add Accident Details" breadcrumbs={breadcrumbs} />
      <Formik
        initialValues={{
          dateTime: "",
          venue: "",
          vehicleRegistrationNo: "",
          driversNIC: "",
          helpersNIC: "",
          loss: 0,
          specialNotes: "",
          photos: "",
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
                        // Compare selectedDate with currentDate
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
                            type="datetime-local" // Use datetime-local for combined date and time input
                            variant="filled"
                            borderRadius="md"
                            px={3}
                            py={2}
                            mt={1}
                            width="400px"
                            placeholder="Date & Time"
                            max={new Date().toISOString().split('T')[0] + "T23:59"} // Maximum date is today (end of day)
                          />
                          {form.errors.dateTime && form.touched.dateTime && (
                            <div className="text-red-500">{form.errors.dateTime}</div>
                          )}
                        </div>
                      )}
                    </Field>
                    <Field name="venue">
                      {({ field }) => (
                        <div className="flex flex-col gap-3">
                          <p>Venue</p>
                          <Input
                            {...field}
                            type="text"
                            variant="filled"
                            borderRadius="md"
                            px={3}
                            py={2}
                            mt={1}
                            width="400px"
                            placeholder="Venue"
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="vehicleRegistrationNo">
                      {({ field }) => (
                        <div className="flex flex-col gap-3">
                          <p>Vehicle Registration No</p>
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
                            {vehicleRegistrationNos.map((regNo) => (
                              <option key={regNo} value={regNo}>
                                {regNo}
                              </option>
                            ))}
                          </Select>
                        </div>
                      )}
                    </Field>
                    <Field name="driversNIC">
                      {({ field }) => (
                        <div className="flex flex-col gap-3">
                          <p>Driver's NIC</p>
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
                            {driversNICs.map((nic) => (
                              <option key={nic} value={nic}>
                                {nic}
                              </option>
                            ))}
                          </Select>
                        </div>
                      )}
                    </Field>
                    <Field name="helpersNIC">
                      {({ field }) => (
                        <div className="flex flex-col gap-3">
                          <p>Helper's NIC</p>
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
                            {helpersNICs.map((nic) => (
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
                  <div className="flex flex-row items-start space-x-4 w-full">
                    <Box
                      bg="#F3F5FA"
                      borderRadius="md"
                      width="900px"
                      height="400px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      marginTop="25px"
                    >
                      <HStack spacing={7}>
                        <FaImage size={80} color="#393970" />
                        <FaImage size={80} color="#393970" />
                        <FaImage size={80} color="#393970" />
                        <FaImage size={80} color="#393970" />
                        <FaImage size={80} color="#393970" />
                      </HStack>
                      <Link className="mt-7" to="#">
                        Upload Maximum 5 Photos
                      </Link>
                    </Box>
                  </div>
                  <div className="flex justify-end gap-10 mr-12">
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
      <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Error</AlertDialogHeader>
            <AlertDialogBody>{dialogMessage}</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDialogClose}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog isOpen={isSuccessDialogOpen} onClose={handleSuccessDialogClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Success</AlertDialogHeader>
            <AlertDialogBody>{successDialogMessage}</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleSuccessDialogClose}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
