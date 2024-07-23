import {useEffect, useRef, useState} from "react";
import {axiosApi} from "../interceptor.js";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    chakra,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {TiArrowUnsorted} from "react-icons/ti";
import {IoSearchOutline, IoSettingsSharp} from "react-icons/io5";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';

export default function DriverDetails() {
    const [driverDetails, setDriverDetails] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedDriver, setSelectedDriver] = useState(null);
    const cancelRef = useRef();
    const {isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose} = useDisclosure();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const itemsPerPage = 10;
    const toast = useToast();

    useEffect(() => {
        fetchDriverDetails();
    }, []);

    const onClickDelete = (driver) => {
        setSelectedDriver(driver);
        onDialogOpen();
    };

    const onClickMoreDetails = (driver) => {
        setSelectedDriver(driver);
        onOpen();
    }

    const onConfirmDelete = async () => {
        try {
            const endpoint = `https://localhost:7265/api/Driver/${selectedDriver.userId}/${selectedDriver.status ? 'deactivate' : 'activate'}`;
            await axiosApi.put(endpoint);
            fetchDriverDetails();
            onDialogClose();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data === "Driver is active and associated with driver records. Cannot deactivate.") {
                toast({
                    title: "Error",
                    description: "Driver is active and associated with driver records. Cannot deactivate.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                console.error("Error updating driver status:", error);
            }
        }
    };

    const fetchDriverDetails = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Driver");
            setDriverDetails(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching driver details:", error);
        }
    };

    const columns = [
        {
            accessorKey: 'firstName',
            header: 'First Name',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
            meta: {isNumeric: false, filter: 'text'}
        },
        // {
        //     accessorKey: 'DoB',
        //     header: 'DoB',
        //     meta: { isNumeric: false, filter: 'text' }
        // },
        {
            accessorKey: 'lNIC',
            header: 'NIC',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'driverLicenseNo',
            header: 'License No',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'licenseExpiryDate',
            header: 'License Exp Date',
            meta: {isNumeric: false, filter: 'text'}
        },
        // {
        //     accessorKey: 'emailAddress',
        //     header: 'Email Address',
        //     meta: { isNumeric: false, filter: 'text' }
        // },
        {
            accessorKey: 'phoneNo',
            header: 'Phone No',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'emergencyContact',
            header: 'Emergency Contact',
            meta: {isNumeric: false, filter: 'text'}
        },
        // {
        //     accessorKey: 'bloodGroup',
        //     header: 'Blood Group',
        //     meta: { isNumeric: false, filter: 'text' }
        // },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (info.getValue() ? "Active" : "Inactive"),
            meta: {isNumeric: false, filter: 'boolean'}
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({row}) => (
                <Menu>
                    <MenuButton
                        color={theme.purple}
                        as={IconButton}
                        aria-label="profile-options"
                        fontSize="20px"
                        icon={<IoSettingsSharp/>}
                    />
                    <MenuList>
                        <MenuItem>
                            <Link to={`/app/EditDriverDetails/${row.original.id}`}>
                                Edit
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link to={`/app/ResetPassword/${row.original.id}`}>
                                Reset Password
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => onClickMoreDetails(row.original)}>
                            More Details
                        </MenuItem>
                        <MenuItem onClick={() => onClickDelete(row.original)}>
                            {row.original.status ? "Deactivate" : "Activate"}
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
            meta: {isNumeric: false, filter: null},
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: driverDetails,
        columns,
        state: {sorting, globalFilter: searchInput},
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const handleSearchInputChange = (event) => {
        const inputValue = event.target.value.toLowerCase();
        setSearchInput(inputValue);
        table.setGlobalFilter(inputValue);
        setCurrentPage(0);
    };

    const breadcrumbs = [
        {label: "Driver", link: "/app/DriverDetails"},
        {label: "Driver Details", link: "/app/DriverDetails"}
    ];

    const handlePageClick = ({selected}) => {
        setCurrentPage(selected);
    };

    const startOffset = currentPage * itemsPerPage;
    const endOffset = startOffset + itemsPerPage;
    const sortedData = table.getRowModel().rows.map(row => row.original);
    const currentData = sortedData.slice(startOffset, endOffset);
    const pageCount = Math.ceil(table.getFilteredRowModel().rows.length / itemsPerPage);
    const isEmpty = currentData.length === 0;
    const iconStyle = {display: "inline-block", verticalAlign: "middle", marginLeft: "5px"};

    return (
        <div className="main-content">
            <PageHeader title="Driver Details" breadcrumbs={breadcrumbs}/>
            <Box mb="20px" mt="50px" display="flex" alignItems="center" gap="20px" marginTop="60px" marginBottom="10px">
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <IoSearchOutline/>
                    </InputLeftElement>
                    <Input
                        placeholder="Search"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        variant="filled"
                        width="300px"
                    />
                </InputGroup>
                <Link to="/app/AddDriverDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{bg: theme.onHoverPurple}}
                        color="white"
                        variant="solid"
                        w="180px"
                        mr="50px"
                    >
                        Add New Driver
                    </Button>
                </Link>
            </Box>

            <Table className="custom-table">
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                const meta = header.column.columnDef.meta;
                                return (
                                    <Th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        isNumeric={meta?.isNumeric}
                                        className="custom-table-th"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        <chakra.span pl="4">
                                            {header.column.getIsSorted() ? (
                                                header.column.getIsSorted() === "desc" ? (
                                                    <TriangleDownIcon aria-label="sorted descending" style={iconStyle}/>
                                                ) : (
                                                    <TriangleUpIcon aria-label="sorted ascending" style={iconStyle}/>
                                                )
                                            ) : (
                                                <TiArrowUnsorted aria-label="unsorted" style={iconStyle}/>
                                            )}
                                        </chakra.span>
                                    </Th>
                                );
                            })}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {isEmpty ? (
                        <Tr>
                            <Td colSpan={columns.length} textAlign="center">
                                <Text>No results found for {searchInput}</Text>
                            </Td>
                        </Tr>
                    ) : (
                        currentData.map((driver, index) => (
                            <Tr key={index}>
                                <Td className="custom-table-td">{driver.firstName}</Td>
                                <Td className="custom-table-td">{driver.lastName}</Td>
                                {/*<Td className="custom-table-td">{driver.dateOfBirth.split("T")[0]}</Td>*/}
                                <Td className="custom-table-td">{driver.nic}</Td>
                                <Td className="custom-table-td">{driver.driverLicenseNo}</Td>
                                <Td className="custom-table-td">{driver.licenseExpiryDate?.split("T")[0]}</Td>
                                {/*<Td className="custom-table-td">{driver.emailAddress}</Td>*/}
                                <Td className="custom-table-td">{driver.phoneNo}</Td>
                                <Td className="custom-table-td">{driver.emergencyContact}</Td>
                                {/*<Td className="custom-table-td">{driver.bloodGroup}</Td>*/}
                                <Td className="custom-table-td">{driver.status ? "Active" : "Inactive"}</Td>
                                <Td className="custom-table-td">
                                    <Menu>
                                        <MenuButton
                                            color={theme.purple}
                                            as={IconButton}
                                            aria-label="profile-options"
                                            fontSize="20px"
                                            icon={<IoSettingsSharp/>}
                                        />
                                        <MenuList>
                                            <MenuItem>
                                                <Link to={`/app/EditDriverDetails/${driver.userId}`}>Edit</Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to={`/app/ResetPassword/${driver.userId}`}>Reset Password</Link>
                                            </MenuItem>
                                            <MenuItem onClick={() => onClickMoreDetails(driver)}>
                                                More Details
                                            </MenuItem>
                                            <MenuItem onClick={() => onClickDelete(driver)}>
                                                {driver.status ? "Deactivate" : "Activate"}
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                            </Tr>
                        ))
                    )}
                </Tbody>
            </Table>

            {!isEmpty && <Pagination pageCount={pageCount} onPageChange={handlePageClick}/>}

            <AlertDialog
                isOpen={isDialogOpen}
                onClose={onDialogClose}
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                isCentered
            >
                <AlertDialogOverlay/>
                <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                    <AlertDialogHeader>{selectedDriver?.status ? "Deactivate" : "Activate"} Driver</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want
                        to {selectedDriver?.status ? "deactivate" : "activate"} {selectedDriver?.firstName} {selectedDriver?.lastName}?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <div className="flex flex-row gap-8">
                            <Button
                                bg="gray.400"
                                _hover={{bg: "gray.500"}}
                                color="#ffffff"
                                variant="solid"
                                onClick={onDialogClose}
                                ref={cancelRef}
                            >
                                Cancel
                            </Button>
                            <Button colorScheme="red" color="#FFFFFF" onClick={onConfirmDelete}>
                                {selectedDriver?.status ? "Deactivate" : "Activate"}
                            </Button>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Driver Details</ModalHeader>

                    <ModalBody>
                        <Text as='b'>First Name</Text>
                        <Text className="mb-3">{selectedDriver?.firstName}</Text>
                        <Text as='b'>Last Name</Text>
                        <Text className="mb-3">{selectedDriver?.lastName}</Text>
                        <Text as='b'>Birthday</Text>
                        <Text className="mb-3">{selectedDriver?.dateOfBirth.split("T")[0]}</Text>
                        <Text as='b'>Blood Group</Text>
                        <Text className="mb-3">{selectedDriver?.bloodGroup}</Text>
                        <Text as='b'>Email</Text>
                        <Text className="mb-3">{selectedDriver?.emailAddress}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button bg={theme.purple}
                                _hover={{bg: theme.onHoverPurple}}
                                color="white"
                                variant="solid" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
