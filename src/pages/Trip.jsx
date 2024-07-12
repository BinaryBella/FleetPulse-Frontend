import PageHeader from "../components/PageHeader.jsx";
import {
    Button, Checkbox,
    Input, NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";

export default function Trip() {
    const breadcrumbs = [
        {label: 'Trip', link: '/'},
        {label: 'Trip Details', link: '/'},
        {label: 'Add Trip Details', link: '/'}
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
        console.log("Cancelled");
    };

    return (
        <>

            <PageHeader title="Add Trip Details" breadcrumbs={breadcrumbs}/>
            <div className="grid grid-cols-2 gap-10 mt-8">
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
                    <p>Start Time</p>
                    <Input
                        type="time"
                        variant="filled"
                        borderRadius="md"
                        px={3}
                        py={2}
                        mt={1}
                        width="500px"
                        name="Start Time"
                        placeholder="Start Time"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <p>End Time</p>
                    <Input
                        type="time"
                        variant="filled"
                        borderRadius="md"
                        px={3}
                        py={2}
                        mt={1}
                        width="500px"
                        name="End Time"
                        placeholder="End Time"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <p>Start Location</p>
                    <Input
                        type="text"
                        variant="filled"
                        borderRadius="md"
                        px={3}
                        py={2}
                        mt={1}
                        width="500px"
                        name="Start Location"
                        placeholder="Start Location"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <p>End Location</p>
                    <Input
                        type="text"
                        variant="filled"
                        borderRadius="md"
                        px={3}
                        py={2}
                        mt={1}
                        width="500px"
                        name="End Location"
                        placeholder="End Location"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <p>Start Meter Value</p>
                    <NumberInput
                        variant="filled"
                        defaultValue={0} // Set defaultValue to 0
                        min={0}
                        width="500px"
                        mt={1}
                    >
                        <NumberInputField
                            variant="filled"
                            borderRadius="md"
                            px={3}
                            py={2}
                            mt={1}
                            name="Start Meter Value"
                            placeholder="00.00"
                            step={0.01}
                            value="00.00"
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                </div>
                <div className="flex flex-col gap-3">
                    <p>End Meter Value</p>
                    <NumberInput
                        variant="filled"
                        defaultValue={0} // Set defaultValue to 0
                        min={0}
                        width="500px"
                        mt={1}
                    >
                        <NumberInputField
                            variant="filled"
                            borderRadius="md"
                            px={3}
                            py={2}
                            mt={1}
                            name="End Meter Value"
                            placeholder="00.00"
                            step={0.01}
                            value="00.00"
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                        </NumberInputStepper>
                    </NumberInput>
                </div>
                <div className="flex flex-col gap-3">
                    <Checkbox size='lg' defaultChecked>
                        Is Active
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
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </div>
        </>
    );
}
