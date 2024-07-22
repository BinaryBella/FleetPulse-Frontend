import { useState, useEffect, useRef } from 'react';
import {axiosApi} from "../interceptor.js";
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
import { IoSettingsSharp, IoSearchOutline } from "react-icons/io5";
import { TiArrowUnsorted } from "react-icons/ti";
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

export default function TripDetails() {
    const [tripDetails, setTripDetails] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedTrip, setSelectedTrip] = useState(null);
    const cancelRef = useRef();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const itemsPerPage = 10;
    const toast = useToast();

    useEffect(() => {
        fetchTripDetails();
    }, []);

    const fetchTripDetails = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Trip");
            setTripDetails(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching trip details:", error);
        }
    };

    const columns = [
        { accessorKey: 'driversNIC', header: 'Driver\'s NIC' },
        { accessorKey: 'helpersNIC', header: 'Helper\'s NIC' },
        { accessorKey: 'vehicleRegNo', header: 'Vehicle Reg.No' },
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'startTime', header: 'Start Time' },
        { accessorKey: 'endTime', header: 'End Time' },
        { accessorKey: 'status', header: 'Status' },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <Menu>
                    <MenuButton
                        color={theme.purple}
                        as={IconButton}
                        aria-label="profile-options"
                        fontSize="20px"
                        icon={<IoSettingsSharp />}
                    />
                    <MenuList>
                        <MenuItem>
                            <Link to={`/app/EditTripDetails/${row.original.id}`}>
                                Edit
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => onClickDelete(row.original)}>
                            {row.original.status ? "Deactivate" : "Activate"}
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: tripDetails,
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
        { label: 'Trip', link: '/app/TripDetails' },
        { label: 'Trip Details', link: '/app/TripDetails' }
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

    const onClickDelete = (trip) => {
        setSelectedTrip(trip);
        onDialogOpen();
    };

    const onConfirmDelete = async () => {
        try {
            const endpoint = `https://localhost:7265/api/TripDetails/${selectedTrip.id}/${selectedTrip.status ? 'deactivate' : 'activate'}`;
            await axiosApi.put(endpoint);
            fetchTripDetails();
            onDialogClose();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast({
                    title: "Error",
                    description: "Unable to update trip status.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                console.error("Error updating trip status:", error);
            }
        }
    };

    return (
        <div className="main-content">
            <PageHeader title="Trip Details" breadcrumbs={breadcrumbs} />
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
                <Link to="/app/AddTripDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{ bg: theme.onHoverPurple }}
                        color="white"
                        variant="solid"
                        w="180px"
                        mr="50px"
                    >
                        Add New Trip
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
                        currentData.map((trip, index) => (
                            <Tr key={index}>
                                <Td>{trip.driversNIC}</Td>
                                <Td>{trip.helpersNIC}</Td>
                                <Td>{trip.vehicleRegNo}</Td>
                                <Td>{trip.date}</Td>
                                <Td>{trip.startTime}</Td>
                                <Td>{trip.endTime}</Td>
                                <Td>{trip.status ? "Active" : "Inactive"}</Td>
                                <Td>
                                    <Menu>
                                        <MenuButton
                                            color={theme.purple}
                                            as={IconButton}
                                            aria-label="profile-options"
                                            fontSize="20px"
                                            icon={<IoSettingsSharp />}
                                        />
                                        <MenuList>
                                            <MenuItem>
                                                <Link to={`/app/EditTripDetails/${trip.id}`}>
                                                    Edit
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={() => onClickDelete(trip)}>
                                                {trip.status ? "Deactivate" : "Activate"}
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

            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom" leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay />
                <AlertDialogContent position="absolute" top="30%" left="50%" transform="translate(-50%, -50%)">
                    <AlertDialogHeader>{selectedTrip?.status ? "Deactivate" : "Activate"} Trip</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to {selectedTrip?.status ? "deactivate" : "activate"} this trip?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <div className="flex flex-row gap-8">
                            <Button bg="gray.400" _hover={{ bg: "gray.500" }} color="#ffffff" variant="solid" onClick={onDialogClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' color="#FFFFFF" onClick={onConfirmDelete}>
                                {selectedTrip?.status ? "Deactivate" : "Activate"}
                            </Button>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
