import PageHeader from "../components/PageHeader.jsx";
import {
    Box,
    Button, Checkbox, HStack,
    Input,
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Textarea
} from "@chakra-ui/react";
import {FaImage} from "react-icons/fa6";
import theme from "../config/ThemeConfig.jsx";
import {Link} from "react-router-dom";

export default function AddAccidentDetails() {
    const breadcrumbs = [
        {label: 'Accident', link: '/'},
        {label: 'Accident Details', link: '/'},
        {label: 'Add Accident Details', link: '/'}
    ];
    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // You can submit the userData object to your backend here
        console.log();
    };

    // Function to handle cancel action
    const handleCancel = () => {
        // Reset form fields or redirect to another page
        console.log();
    };
    const handleNext = () => {
        // Reset form fields or redirect to another page
        console.log();
    };
    return (
        <>
            <PageHeader title="Add Accident Details" breadcrumbs={breadcrumbs}/>
            <div className="grid gap-10 mt-8">
                <Tabs position="relative" variant="unstyled">
                    <TabList>
                        <Tab>Accident Details</Tab>
                        <Tab>Upload Photos</Tab>
                    </TabList>
                    <TabIndicator
                        mt="-1.5px"
                        height="2px"
                        bg="#5858af"
                        borderRadius="1px"
                    />
                    <TabPanels>
                        <TabPanel>
                            <div className="grid grid-cols-2 gap-10 mt-8">
                                <div className="flex flex-col gap-3">
                                    <p>Date</p>
                                    <Input
                                        type="date"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                        name="Date"
                                        placeholder="Date"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>Location</p>
                                    <Input
                                        type="text"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                        name="Location"
                                        placeholder="Location"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>Vehicle Registration No</p>
                                    <Input
                                        type="text"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                        name="Vehicle Registration No"
                                        placeholder="Vehicle Registration No"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    <p>Driver's NIC</p>
                                    <Input
                                        type="text"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                        name="Driver's NIC"
                                        placeholder="Driver's NIC"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    <p>Helper's NIC</p>
                                    <Input
                                        type="text"
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                        name="Helper's NIC"
                                        placeholder="Helper's NIC"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>Loss</p>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Loss"
                                        variant="filled"
                                        borderRadius="md"
                                        width="500px"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        name="Loss"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>Special Notes</p>
                                    <Textarea
                                        variant="filled"
                                        borderRadius="md"
                                        px={3}
                                        py={2}
                                        mt={1}
                                        width="500px"
                                        name="Special Notes"
                                        placeholder="Special Notes"
                                    />
                                </div>
                                <div className="flex gap-7">
                                    <Checkbox size='lg' defaultChecked>
                                        Driver Injured
                                    </Checkbox>
                                    <Checkbox size='lg' defaultChecked>
                                        Helper Injured
                                    </Checkbox>
                                    <Checkbox size='lg' defaultChecked>
                                        Vehicle Damaged
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="flex w-5/6 justify-end gap-10">
                                <Button
                                    bg="gray.400"
                                    _hover={{bg: "gray.500"}}
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
                                    _hover={{bg: theme.onHoverPurple}}
                                    color="#ffffff"
                                    variant="solid"
                                    w="230px"
                                    marginTop="10"
                                    onClick={handleNext}
                                >
                                    Next
                                </Button>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="flex flex-row items-start space-x-4 w-full">
                                <Box bg="#F3F5FA" p={4} borderRadius="md" width="800px" height="400px" display="flex"
                                     flexDirection="column" justifyContent="center" alignItems="center">
                                    <HStack spacing={7}>
                                        <FaImage size={80} color="#393970"/>
                                        <FaImage size={80} color="#393970"/>
                                        <FaImage size={80} color="#393970"/>
                                        <FaImage size={80} color="#393970"/>
                                        <FaImage size={80} color="#393970"/>
                                    </HStack>
                                    <Link className="mt-7" href='#'>
                                        Upload Maximum 5 Photos
                                    </Link>
                                </Box>
                            </div>

                            <div className="flex w-4/5 justify-end gap-10">
                                <Button
                                    bg="gray.400"
                                    _hover={{bg: "gray.500"}}
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
                                    _hover={{bg: theme.onHoverPurple}}
                                    color="#ffffff"
                                    variant="solid"
                                    w="230px"
                                    marginTop="10"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </>
    );
}