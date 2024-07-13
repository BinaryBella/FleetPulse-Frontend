import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";

export default function AddStaffDetails() {
  const navigate = useNavigate();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const [dialogMessage, setDialogMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    { label: "Staff", link: "/" },
    { label: "Staff Details", link: "/app/StaffDetails" },
    { label: "Add Staff Details", link: "/app/AddStaffDetails" },
  ];

  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://localhost:7265/api/Staff");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
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
        const response = await fetch("https://localhost:7265/api/Staff", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
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

  return (
    <>
      <PageHeader title="Add Staff Details" breadcrumbs={breadcrumbs} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ errors, touched }) => (
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
                            <Input
                              {...field}
                              type="password"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              placeholder="Password"
                            />
                          )}
                        </Field>
                        {errors.Password && touched.Password && (
                          <div className="text-red-500">{errors.Password}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Confirm Password</p>
                        <Field name="confirmPassword">
                          {({ field }) => (
                            <Input
                              {...field}
                              type="password"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              placeholder="Confirm Password"
                            />
                          )}
                        </Field>
                        {errors.confirmPassword && touched.confirmPassword && (
                          <div className="text-red-500">{errors.confirmPassword}</div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p>Status</p>
                        <Field name="Status" type="checkbox">
                          {({ field }) => (
                            <Checkbox
                              {...field}
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              isChecked={field.value}
                            >
                              Active
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
              <div className="flex justify-end gap-10 mr-16">
                <Button
                  bg="gray.400"
                  _hover={{ bg: "gray.500" }}
                  color="#ffffff"
                  variant="solid"
                  w="180px"
                  mt="10"
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
                  mt="10"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
      <AlertDialog isOpen={isDialogOpen} leastDestructiveRef={undefined} onClose={onDialogClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Success
            </AlertDialogHeader>
            <AlertDialogBody>{dialogMessage}</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDialogClose}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}