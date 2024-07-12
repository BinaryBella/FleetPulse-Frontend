import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Button,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    Input,
    chakra,
    InputGroup,
    InputLeftElement,
    Text,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialog,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { TiArrowUnsorted } from "react-icons/ti";
import { IoSettingsSharp, IoSearchOutline } from "react-icons/io5";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel
} from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

export default function VehicleDetailsTable() {
    const [vehicleDetails, setVehicleDetails] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const cancelRef = useRef();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const itemsPerPage = 10;
    const toast = useToast();

    useEffect(() => {
        fetchVehicleDetails();
    }, []);

    const fetchVehicleDetails = async () => {
        try {
            const response = await axios.get('https://localhost:7265/api/Vehicle');
            setVehicleDetails(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching vehicle details:", error);
            toast({
                title: "Error",
                description: "Error fetching vehicle details",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const onClickDelete = (vehicle) => {
        setSelectedVehicle(vehicle);
        onDialogOpen();
    };

    const onConfirmDelete = async () => {
        try {
            const endpoint = `https://localhost:7265/api/Vehicle/${selectedVehicle.id}/${selectedVehicle.isActive ? 'deactivate' : 'activate'}`;
            await axios.put(endpoint);
            fetchVehicleDetails();
            onDialogClose();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data === "Vehicle is active and associated with vehicle records. Cannot deactivate.") {
            } else {
                console.error("Error updating vehicle status:", error);
            }
        }
    };

    const columns = [
        {
            accessorKey: 'registrationNo',
            header: 'Reg No',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'licenseNo',
            header: 'License No',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'licenseExpireDate',
            header: 'License Exp Date',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'manufacturerName',
            header: 'Manufacturer',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'type',
            header: 'Type',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'fType',
            header: 'Fuel Type',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'color',
            header: 'Color',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: info => (info.getValue() ? "Active" : "Inactive"),
            meta: { isNumeric: false, filter: 'boolean' }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <Menu>
                    <MenuButton
                        color={theme.purple}
                        as={IconButton}
                        aria-label='profile-options'
                        fontSize='20px'
                        icon={<IoSettingsSharp />}
                    />
                    <MenuList>
                        <Link to={`/app/EditVehicleDetails/${row.original.id}`}>
                            <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem>
                            <Link to="/app/VehicleMaintenanceConfigurationTable">
                                Vehicle Maintenance Configuration
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => onClickDelete(row.original)}>
                            {row.original.isActive ? "Deactivate" : "Activate"}
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
            meta: { isNumeric: false, filter: null },
            enableSorting: false,
        }
    ];

    const table = useReactTable({
        data: vehicleDetails,
        columns,
        state: { sorting, globalFilter: searchInput },
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
        { label: 'Vehicle', link: '/' },
        { label: 'Vehicle Details', link: '/app/VehicleDetails' }
    ];

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const startOffset = currentPage * itemsPerPage;
    const endOffset = startOffset + itemsPerPage;
    const sortedData = table.getRowModel().rows.map(row => row.original);
    const currentData = sortedData.slice(startOffset, endOffset);
    const pageCount = Math.ceil(table.getFilteredRowModel().rows.length / itemsPerPage);
    const isEmpty = currentData.length === 0;
    const iconStyle = { display: "inline-block", verticalAlign: "middle", marginLeft: "5px" };

    return (
        <div className="main-content">
            <PageHeader title="Vehicle Details" breadcrumbs={breadcrumbs} />
            <Box mb="20px" mt="50px" display="flex" alignItems="center" gap="20px">
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <IoSearchOutline />
                    </InputLeftElement>
                    <Input
                        placeholder="Search"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        variant="filled"
                        width="300px"
                    />
                </InputGroup>
                <Link to="/app/AddVehicleDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{ bg: theme.onHoverPurple }}
                        color="white"
                        variant="solid"
                        w="200px"
                        mr="50"
                    >
                        Add New Vehicle Details
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
                                                    <TriangleDownIcon aria-label="sorted descending" style={iconStyle} />
                                                ) : (
                                                    <TriangleUpIcon aria-label="sorted ascending" style={iconStyle} />
                                                )
                                            ) : (
                                                <TiArrowUnsorted aria-label="unsorted" style={iconStyle} />
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
                        currentData.map((vehicle, index) => (
                            <Tr key={index}>
                                <Td>{vehicle.vehicleRegistrationNo}</Td>
                                <Td>{vehicle.licenseNo}</Td>
                                <Td>{vehicle.licenseExpireDate}</Td>
                                <Td>{vehicle.manufacturerName}</Td>
                                <Td>{vehicle.typeOf}</Td>
                                <Td>{vehicle.fType}</Td>
                                <Td>{vehicle.color}</Td>
                                <Td>{vehicle.isActive ? "Active" : "Inactive"}</Td>
                                <Td>
                                    <Menu>
                                        <MenuButton
                                            color={theme.purple}
                                            as={IconButton}
                                            aria-label='profile-options'
                                            fontSize='20px'
                                            icon={<IoSettingsSharp />}
                                        />
                                        <MenuList>
                                            <MenuItem>
                                                <Link to={`/app/EditVehicleDetails/${vehicle.id}`}>
                                                    Edit
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to="/app/VehicleMaintenanceConfigurationTable">
                                                    Vehicle Maintenance Configuration
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={() => onClickDelete(vehicle)}>
                                                {vehicle.isActive ? "Deactivate" : "Activate"}
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Td>
                            </Tr>
                        ))
                    )}
                </Tbody>
            </Table>
            {!isEmpty && (
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                />
            )}

            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay>
                    <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                        <AlertDialogHeader>{selectedVehicle?.isActive ? "Deactivate" : "Activate"} Vehicle</AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to {selectedVehicle?.isActive ? "deactivate" : "activate"} this vehicle?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDialogClose}>Cancel</Button>
                            <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
                                {selectedVehicle?.isActive ? "Deactivate" : "Activate"}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </div>
    );
}
