import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Input,
  IconButton,
  Select,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { MdArrowDropDown } from "react-icons/md";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import PasswordStrengthBar from 'react-password-strength-bar';
import $ from "jquery";
import PageHeader from "../components/PageHeader.jsx";
import theme from "../config/ThemeConfig.jsx";
import {axiosApi} from "../interceptor.js";

export default function AddHelperDetails() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [successDialogMessage, setSuccessDialogMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const breadcrumbs = [
    { label: 'Helper', link: '/app/HelperDetails' },
    { label: 'Helper Details', link: '/app/HelperDetails' },
    { label: 'Add Helper Details', link: '/app/AddHelperDetails' },
  ];

  const handleSubmit = async (values) => {
    try {
      const errors = {};
      if (!values.firstName) {
        errors.firstName = "First Name is required";
      } else if (values.firstName.length < 2) {
        errors.firstName = "First Name must be at least 2 characters";
      }

      if (!values.lastName) {
        errors.lastName = "Last Name is required";
      } else if (values.lastName.length < 2) {
        errors.lastName = "Last Name must be at least 2 characters";
      }

      if (!values.dob) {
        errors.dob = "Date of Birth is required";
      } else if (new Date(values.dob) > new Date()) {
        errors.dob = "Date of Birth cannot be in the future";
      }

      if (!values.nic) {
        errors.nic = "NIC is required";
      } else if (values.nic.length < 10 || values.nic.length > 12) {
        errors.nic = "NIC must be between 10 to 12 characters";
      }

      if (!values.emailAddress) {
        errors.emailAddress = "Email Address is required";
      } else if (!/^\S+@\S+\.\S+$/.test(values.emailAddress)) {
        errors.emailAddress = "Invalid email address";
      }

      if (!values.phoneNo) {
        errors.phoneNo = "Contact No is required";
      } else if (!/^[0-9]{10}$/.test(values.phoneNo)) {
        errors.phoneNo = "Contact No must be exactly 10 digits";
      }

      if (!values.emergencyContact) {
        errors.emergencyContact = "Emergency Contact No is required";
      } else if (!/^[0-9]{10}$/.test(values.emergencyContact)) {
        errors.emergencyContact = "Emergency Contact No must be exactly 10 digits";
      }

      if (!values.bloodGroup) {
        errors.bloodGroup = "Blood Group is required";
      }

      if (!values.userName) {
        errors.userName = "User Name is required";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords must match";
      }

      if (Object.keys(errors).length > 0) {
        throw new Error("Validation failed.");
      }

      const status = values.isActive ? true : false;

      const response = await axiosApi.post('https://localhost:7265/api/Helper', {
        FirstName: values.firstName,
        LastName: values.lastName,
        DateOfBirth: values.dob,
        NIC: values.nic,
        EmailAddress: values.emailAddress,
        PhoneNo: values.phoneNo,
        EmergencyContact: values.emergencyContact,
        BloodGroup: values.bloodGroup,
        UserName: values.userName,
        Password: values.password,
        Status: values.isActive,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add helper.');
      }

      if (data.message && data.message.toLowerCase().includes('exist')) {
        setDialogMessage('Helper already exists');
        setIsDialogOpen(true);
      } else {
        setSuccessDialogMessage('Helper added successfully.');
        setIsSuccessDialogOpen(true);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        setDialogMessage('Failed to connect to the server.');
      } else {
        setDialogMessage(error.message || 'Failed to add helper.');
      }
      setIsDialogOpen(true);
    }
  };

  const handleCancel = () => {
    navigate('/app/HelperDetails');
  };

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false);
    navigate('/app/HelperDetails');
  };

  const stylePasswordStrengthBar = () => {
    // Example of styling children of .pwd-meter
    $(".pwd-meter > div").children().each(function () {
      $(this).css({ "height": "3px", "border-radius": "5px" });
    });
  };

  return (
    <>
      <PageHeader title="Add Helper Details" breadcrumbs={breadcrumbs} />
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          dob: "",
          nic: "",
          emailAddress: "",
          phoneNo: "",
          emergencyContact: "",
          bloodGroup: "",
          userName: "",
          password: "",
          confirmPassword: "",
          isActive: false,
        }}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values }) => (
          <Form>
            <Tabs>
              <TabList>
                <Tab>Contact Info</Tab>
                <Tab>Account Info</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="grid grid-cols-2 gap-10 mt-8">
                    <div className="flex flex-col gap-3">
                      <p>First Name</p>
                      <Field name="firstName">
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
                              id="firstName"
                              placeholder="First Name"
                            />
                            {errors.firstName && touched.firstName ? (
                              <div className="text-red-500">{errors.firstName}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>Last Name</p>
                      <Field name="lastName">
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
                              id="lastName"
                              placeholder="Last Name"
                            />
                            {errors.lastName && touched.lastName ? (
                              <div className="text-red-500">{errors.lastName}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>Date of Birth</p>
                      <Field name="dob">
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
                              id="dob"
                              placeholder="Date of Birth"
                            />
                            {errors.dob && touched.dob ? (
                              <div className="text-red-500">{errors.dob}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>NIC</p>
                      <Field name="nic">
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
                              id="nic"
                              placeholder="NIC No"
                            />
                            {errors.nic && touched.nic ? (
                              <div className="text-red-500">{errors.nic}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>Email Address</p>
                      <Field name="emailAddress">
                        {({ field }) => (
                          <div>
                            <Input
                              {...field}
                              type="email"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              id="emailAddress"
                              placeholder="Email Address"
                            />
                            {errors.emailAddress && touched.emailAddress ? (
                              <div className="text-red-500">{errors.emailAddress}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>Contact No</p>
                      <Field name="phoneNo">
                        {({ field }) => (
                          <div>
                            <Input
                              {...field}
                              type="tel"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              id="phoneNo"
                              placeholder="Contact No"
                            />
                            {errors.phoneNo && touched.phoneNo ? (
                              <div className="text-red-500">{errors.phoneNo}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>Emergency Contact No</p>
                      <Field name="emergencyContact">
                        {({ field }) => (
                          <div>
                            <Input
                              {...field}
                              type="tel"
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              id="emergencyContact"
                              placeholder="Emergency Contact No"
                            />
                            {errors.emergencyContact && touched.emergencyContact ? (
                              <div className="text-red-500">{errors.emergencyContact}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>Blood Group</p>
                      <Field name="bloodGroup">
                        {({ field }) => (
                          <div>
                            <Select
                              {...field}
                              icon={<MdArrowDropDown />}
                              variant="filled"
                              borderRadius="md"
                              px={3}
                              py={2}
                              mt={1}
                              width="400px"
                              id="bloodGroup"
                              placeholder="Blood Group"
                            >
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </Select>
                            {errors.bloodGroup && touched.bloodGroup ? (
                              <div className="text-red-500">{errors.bloodGroup}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="grid grid-cols-2 gap-10 mt-8">
                    <div className="flex flex-col gap-3">
                      <p>User Name</p>
                      <Field name="userName">
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
                              id="userName"
                              placeholder="User Name"
                            />
                            {errors.userName && touched.userName ? (
                              <div className="text-red-500">{errors.userName}</div>
                            ) : null}
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p>Password</p>
                      <Field name="password">
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
                              id="password"
                              placeholder="Password"
                              pr="4.5rem"
                            />
                            <div className="css-1e7f4z6" style={{ marginRight: '60px', marginTop: '3px' }}>
                            <IconButton
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                              onClick={() => setShowPassword(!showPassword)}
                              position="absolute"
                              right="5px"
                              top="50%"
                              transform="translateY(-50%)"
                              size="sm"
                            />
                            </div>
                          </div>
                        )}
                      </Field>
                      <PasswordStrengthBar password={values.password} />
                      {errors.password && touched.password && (
                        <div className="text-red-500">{errors.password}</div>
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
                            <div className="css-1e7f4z6" style={{ marginRight: '60px', marginTop: '3px' }}>
                            <IconButton
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                              onClick={() => setShowPassword(!showPassword)}
                              position="absolute"
                              right="5px"
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
                      <Field name="isActive">
                        {({ field }) => (
                          <Checkbox
                            {...field}
                            borderRadius="md"
                            px={3}
                            py={2}
                            mt={1}
                            id="isActive"
                            colorScheme="green"
                            isChecked={field.value}
                          >
                            Active
                          </Checkbox>
                        )}
                      </Field>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
            <div className="flex justify-end gap-10 mr-16 mt-8">
              <Button
                bg="gray.400"
                _hover={{ bg: "gray.500" }}
                color="#ffffff"
                variant="solid"
                w="180px"
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
                type="submit"
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <AlertDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Error</AlertDialogHeader>
            <AlertDialogBody>{dialogMessage}</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
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
