import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
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
  Select,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { axiosApi } from "../interceptor.js";

export default function EditAccidentDetails() {
  const { id } = useParams(); // Get the accident ID from the URL
  const navigate = useNavigate();
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
  const [NICs, setNICs] = useState([]);

  const breadcrumbs = [
    { label: "Accident", link: "/app/AccidentDetails" },
    { label: "Accident Details", link: "/app/AccidentDetails" },
    { label: "Edit Accident Details", link: `/app/EditAccidentDetails/${id}` },
  ];

  useEffect(() => {
    console.log("Accident ID:", id); // Debugging line

    if (id) {
      fetchVehicleRegNos();
      fetchDriverNICs();
      fetchAccidentDetails(); // This should be called after the dropdown data is fetched
    } else {
      setDialogMessage("Invalid accident ID.");
      onDialogOpen();
    }
  }, [id]);

  const validateAccidentInfo = (values) => {
    const errors = {};
    const requiredFields = [
      "vehicleRegistrationNo",
      "venue",
      "dateTime",
      "driverNIC",
    ];
    requiredFields.forEach((field) => {
      if (!values[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1").trim()} is required`;
      }
    });

    if (values.dateTime && !errors.dateTime) {
      const selectedDate = new Date(values.dateTime);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        errors.dateTime = "Please select today or a past date & time.";
      }
    }

    return errors;
  };

  const fetchAccidentDetails = async () => {
    try {
      const response = await axiosApi.get(`https://localhost:7265/api/Accidents/${id}`);
      setFormData(response.data);
      console.log("data in accident",response.data);
    } catch (error) {
      console.error("Error fetching accident details:", error);
      setDialogMessage("Failed to fetch accident details.");
      onDialogOpen();
    }
  };

  const fetchVehicleRegNos = async () => {
    try {
      const response = await axiosApi.get("https://localhost:7265/api/Vehicles");
      setVehicleRegNoDetails(response.data);
    } catch (error) {
      console.error("Error fetching vehicle registration numbers:", error);
    }
  };

  const fetchDriverNICs = async () => {
    try {
      const response = await axiosApi.get("https://localhost:7265/api/Auth/drivers/nics");
      const uniqueNICs = [...new Set(response.data)];
      setNICs(uniqueNICs);
    } catch (error) {
      console.error("Error fetching driver NICs:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const response = await axiosApi.put(`https://localhost:7265/api/Accidents/${id}`, values);

      if (!response.data.status) {
        throw new Error(response.data.message || "Failed to update accident details.");
      }

      setSuccessDialogMessage("Accident details updated successfully.");
      onSuccessDialogOpen();
    } catch (error) {
      setDialogMessage(error.message || "Failed to update accident details.");
      onDialogOpen();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/app/AccidentDetails");
  };

  const handleSuccessDialogClose = () => {
    onSuccessDialogClose();
    navigate("/app/AccidentDetails");
  };

  return (
      <>
        <PageHeader title="Edit Accident Details" breadcrumbs={breadcrumbs} />
        <Box>
          <Formik
              initialValues={formData}
              enableReinitialize
              onSubmit={handleSubmit}
              validate={validateAccidentInfo}
          >
            {({ errors, touched, isValid }) => (
                <Form>
                  <div className="grid grid-cols-2 gap-10 mt-8">
                    <Field name="dateTime">
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
                                max={new Date().toISOString().split("T")[0] + "T23:59"}
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
                    <Field name="vehicleRegistrationNo">
                      {({ field }) => (
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
                                value={formData.vehicleRegistrationNo} // Ensure the correct value is used
                            >
                              {vehicleRegNoDetails.map((option) => (
                                  <option key={option.id} value={option.vehicleRegistrationNo}>
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
                    <Field name="driverNIC">
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
                            {errors.driverNIC && touched.driverNIC && (
                                <div className="text-red-500">Driver NIC is required.</div>
                            )}
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
                      <Field name="driverInjuredStatus">
                        {({ field }) => (
                            <Checkbox {...field} size="lg" isChecked={field.value}>
                              Driver Injured
                            </Checkbox>
                        )}
                      </Field>
                      <Field name="helperInjuredStatus">
                        {({ field }) => (
                            <Checkbox {...field} size="lg" isChecked={field.value}>
                              Helper Injured
                            </Checkbox>
                        )}
                      </Field>
                      <Field name="vehicleDamagedStatus">
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
                        isDisabled={!isValid || isSubmitting}
                    >
                      Save
                    </Button>
                  </div>
                </Form>
            )}
          </Formik>
        </Box>

        <AlertDialog
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
        </AlertDialog>

        <AlertDialog
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
                    _hover={{ bg: theme.onHoverPurple }}
                    color="white"
                    variant="solid"
                    mr={3}
                >
                  Ok
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
  );
}
