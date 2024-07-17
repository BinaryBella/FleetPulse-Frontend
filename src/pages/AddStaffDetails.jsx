import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
  Button,
  Checkbox,
  Input,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import PasswordStrengthBar from 'react-password-strength-bar';
import $ from "jquery";
import {axiosApi} from "../interceptor.js";

export default function AddStaffDetails() {
  const navigate = useNavigate();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const [dialogMessage, setDialogMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [initialValues, setInitialValues] = useState({
    UserName: "",
    FirstName: "",
    LastName: "",
    NIC: "",
    DateOfBirth: "",
    PhoneNo: "",
    EmailAddress: "",
    ProfilePicture: "",
    EmergencyContact: "",
    JobTitle: "",
    Status: true,
    Password: "",
    confirmPassword: "",
  });

  const breadcrumbs = [
    { label: "Staff", link: "/app/StaffDetails" },
    { label: "Staff Details", link: "/app/StaffDetails" },
    { label: "Add Staff Details", link: "/app/AddStaffDetails" },
  ];

  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosApi.get("https://localhost:7265/api/Staff");
        const data = response.data;

        setInitialValues({
          FirstName: data.firstName,
          LastName: data.lastName,
          NIC: data.nic,
          DateOfBirth: data.dateOfBirth,
          PhoneNo: data.phoneNo,
          EmailAddress: data.emailAddress,
          UserName: data.userName,
          EmergencyContact: data.emergencyContact,
          JobTitle: data.jobTitle,
          Status: data.status,
          Password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const handleSubmit = async (values, actions) => {
    let errors = {};

    if (!values.FirstName) errors.FirstName = "First Name is required";
    if (!values.LastName) errors.LastName = "Last Name is required";
    if (!values.NIC) errors.NIC = "National Identity Card No is required";
    if (!values.DateOfBirth) errors.DateOfBirth = "Date of Birth is required";
    if (!values.PhoneNo) errors.PhoneNo = "Contact Number is required";
    if (!values.EmailAddress) {
      errors.EmailAddress = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.EmailAddress)) {
      errors.EmailAddress = "Invalid email address";
    }
    if (!values.UserName) errors.UserName = "Username is required";
    if (!values.EmergencyContact) errors.EmergencyContact = "Emergency Contact No is required";
    if (!values.JobTitle) errors.JobTitle = "Job Title is required";
    if (!values.Password) errors.Password = "Password is required";
    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.confirmPassword !== values.Password) {
      errors.confirmPassword = "Passwords must match";
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axiosApi.post("https://localhost:7265/api/Staff", values, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          setDialogMessage("Staff details saved successfully.");
          onDialogOpen();
          actions.resetForm();
        } else {
          setDialogMessage("Failed to save staff details.");
          onDialogOpen();
        }
      } catch (error) {
        setDialogMessage("Failed to save staff details.");
        onDialogOpen();
      }
    } else {
      setDialogMessage("Please fill in all required fields.");
      onDialogOpen();
    }
  };

  const handleCancel = () => {
    navigate("/app/StaffDetails");
  };

  const handleSuccessDialogClose = () => {
    onDialogClose();
    navigate("/app/StaffDetails");
  };

  const stylePasswordStrengthBar = () => {
    // Example of styling children of .pwd-meter
    $(".pwd-meter > div").children().each(function () {
      $(this).css({ "height": "3px", "border-radius": "5px" });
    });
  };

  return (
    <>
      <PageHeader title="Add Staff Details" breadcrumbs={breadcrumbs} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ values, errors, touched }) => (
            <Form className="grid gap-10 mt-8">
              <Tabs>
                <TabList>
                  <Tab>Contact Info</Tab>
                  <Tab>Account Info</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className="grid grid-cols-2 gap-10">
                      <div className="flex flex-col gap-3">
                        <p>First Name</p>
                        <Field name="FirstName">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              placeholder="First Name"
                            />
                          )}
                        </Field>
                        {errors.FirstName && touched.FirstName && (
                          <div className="text-red-500">{errors.FirstName}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Last Name</p>
                        <Field name="LastName">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              placeholder="Last Name"
                            />
                          )}
                        </Field>
                        {errors.LastName && touched.LastName && (
                          <div className="text-red-500">{errors.LastName}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Email Address</p>
                        <Field name="EmailAddress">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="email"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              placeholder="Email Address"
                            />
                          )}
                        </Field>
                        {errors.EmailAddress && touched.EmailAddress && (
                          <div className="text-red-500">{errors.EmailAddress}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Phone Number</p>
                        <Field name="PhoneNo">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="tel"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              placeholder="Contact Number"
                            />
                          )}
                        </Field>
                        {errors.PhoneNo && touched.PhoneNo && (
                          <div className="text-red-500">{errors.PhoneNo}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Emergency Contact</p>
                        <Field name="EmergencyContact">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="tel"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              placeholder="Emergency Contact No"
                            />
                          )}
                        </Field>
                        {errors.EmergencyContact && touched.EmergencyContact && (
                          <div className="text-red-500">{errors.EmergencyContact}</div>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="grid grid-cols-2 gap-10">
                      <div className="flex flex-col gap-3">
                        <p>Username</p>
                        <Field name="UserName">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="text"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              placeholder="Username"
                            />
                          )}
                        </Field>
                        {errors.UserName && touched.UserName && (
                          <div className="text-red-500">{errors.UserName}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Password</p>
                        <Field name="Password">
                          {({ field }) => (
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                variant="filled"
                                borderRadius="md"
                                px={3}
                                py={2}
                                mt={1}
                                width="400px"
                                id="Password"
                                placeholder="Password"
                                pr="4.5rem"
                              />
                              <div className="css-1e7f4z6" style={{ marginRight: '50px', marginTop: '3px' }}>
                              <IconButton
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={() => setShowPassword(!showPassword)}
                                position="absolute"
                                right="8px"
                                top="50%"
                                transform="translateY(-50%)"
                                size="sm"
                              />
                            </div>
                            </div>
                          )}
                        </Field>
                        <PasswordStrengthBar password={values.Password} />
                        {errors.Password && touched.Password && (
                          <div className="text-red-500">{errors.Password}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Confirm Password</p>
                        <Field name="confirmPassword">
                          {({ field }) => (
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                variant="filled"
                                borderRadius="md"
                                px={3}
                                py={2}
                                mt={1}
                                width="400px"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                pr="4.5rem"
                              />
                              <div className="css-1e7f4z6" style={{ marginRight: '50px', marginTop: '3px' }}>
                              <IconButton
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={() => setShowPassword(!showPassword)}
                                position="absolute"
                                right="8px"
                                top="50%"
                                transform="translateY(-50%)"
                                size="sm"
                              />
                            </div>
                            </div>
                          )}
                        </Field>
                        {errors.confirmPassword && touched.confirmPassword && (
                          <div className="text-red-500">{errors.confirmPassword}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Status</p>
                        <Field name="Status">
                          {({ field }) => (
                            <Checkbox
                              {...field}
                              colorScheme="purple"
                              size="lg"
                              id="Status"
                              isChecked={values.Status}
                            >
                              Status
                            </Checkbox>
                          )}
                        </Field>
                        {errors.Status && touched.Status && (
                          <div className="text-red-500">{errors.Status}</div>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <div className="flex justify-end gap-10 mr-10">
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
            </Form>
          )}
        </Formik>
      )}
      <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom">
        <AlertDialogOverlay />
        <AlertDialogContent position="absolute" top="30%" left="50%" transform="translate(-50%, -50%)">
          <AlertDialogHeader>Success</AlertDialogHeader>
          <AlertDialogBody>{dialogMessage}</AlertDialogBody>
          <AlertDialogFooter>
            <Button bg={theme.purple} color="#FFFFFF" onClick={handleSuccessDialogClose}>
              Ok
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
