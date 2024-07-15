import { useState, useEffect, useRef } from "react";
import axios from "axios";
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
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { TiArrowUnsorted } from "react-icons/ti";
import { IoSearchOutline, IoSettingsSharp } from "react-icons/io5";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Link } from "react-router-dom";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ReactPaginate from 'react-paginate';

export default function FuelRefillDetails() {
    const [fuelRefillDetails, setFuelRefillDetails] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedFuelRefill, setSelectedFuelRefill] = useState(null);
    const itemsPerPage = 10;
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFuelRefill();
    }, []);

    const fetchFuelRefill = async () => {
        try {
            const response = await axios.get("https://localhost:7265/api/FuelRefill");
            const responseData = response.data;
            setFuelRefillDetails(responseData);
        } catch (error) {
            console.error("Error fetching fuel refills:", error);
            setError("Error fetching fuel refill. Please try again later.");
        }
    };

    const onClickDelete = async (fuelRefill) => {
        setSelectedFuelRefill(fuelRefill);
        onDialogOpen();
    };

    const onConfirmDelete = async () => {
        try {
            if (selectedFuelRefill.status) {
                await axios.post(`https://localhost:7265/api/FuelRefill/deactivate/${selectedFuelRefill.fuelRefillId}`);
            } else {
                await axios.post(`https://localhost:7265/api/FuelRefill/activate/${selectedFuelRefill.fuelRefillId}`);
            }
            fetchFuelRefill();
            onDialogClose();
        } catch (error) {
            console.error("Error updating fuel refill status:", error);
        }
    };

    const formatDate = (fuelRefill) => {
        if (!fuelRefill.date) return 'N/A';
        const datetimeParts = fuelRefill.date.split("T");
        return datetimeParts[0] || 'Invalid Date';
    };

    const columns = [
        {
            accessorKey: 'nic',
            header: 'User NIC',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'vehicleRegistrationNo',
            header: 'Vehicle Registration No',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'literCount',
            header: 'Liter Count',
            meta: { isNumeric: true, filter: 'number' }
        },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: info => formatDate(info.row.original),
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'time',
            header: 'Time',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'fType',
            header: 'Refill Type',
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'cost',
            header: 'Cost',
            meta: { isNumeric: true, filter: 'number' }
        },
        {
            accessorKey: 'status',
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
                        aria-label="profile-options"
                        fontSize="20px"
                        icon={<IoSettingsSharp />}
                    />
                    <MenuList>
                        <MenuItem>
                            <Link to={`/app/EditFuelRefillDetails/${row.original.fuelRefillId}`}>
                                Edit
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => onClickDelete(row.original)}>
                            {row.original.status ? "Deactivate" : "Activate"}
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
            meta: { isNumeric: false, filter: null }
        }
    ];

    const table = useReactTable({
        data: fuelRefillDetails,
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
        setCurrentPage(0); // Reset pagination when searching
    };

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
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const cancelRef = useRef();

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/VehicleDetails" },
        { label: "Fuel Refill Details", link: "/app/FuelRefillDetails" },
    ];

    return (
        <div className="main-content">
            <PageHeader title="Fuel Refill Details" breadcrumbs={breadcrumbs} />

            <Box mb="20px" mt="50px" display="flex" alignItems="center" gap="20px" marginTop="60px" marginBottom="10px">
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
                <Link to="/app/AddFuelRefillDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{ bg: theme.onHoverPurple }}
                        color="white"
                        variant="solid"
                        w="230px"
                        mr="45px"
                    >
                        Add New Fuel Refill Details
                    </Button>
                </Link>
            </Box>

            <Table className="custom-table">
                <Thead className="sticky-header">
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
                        currentData.map((fuelRefill, index) => (
                            <Tr key={index}>
                                <Td>{fuelRefill.nic}</Td>
                                <Td>{fuelRefill.vehicleRegistrationNo}</Td>
                                <Td>{fuelRefill.literCount}</Td>
                                <Td>{formatDate(fuelRefill)}</Td>
                                <Td>{fuelRefill.time}</Td>
                                <Td>{fuelRefill.fType}</Td>
                                <Td>{fuelRefill.cost}</Td>
                                <Td>{fuelRefill.status ? "Active" : "Inactive"}</Td>
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
                                                <Link to={`/app/EditFuelRefillDetails/${fuelRefill.fuelRefillId}`}>
                                                    Edit
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={() => onClickDelete(fuelRefill)}>
                                                {fuelRefill.status ? "Deactivate" : "Activate"}
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
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="<"
                    marginPagesDisplayed={2}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                />
            )}
            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom" leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay />
                <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                    <AlertDialogHeader>{selectedFuelRefill?.status ? "Deactivate" : "Activate"} Fuel Refill Details</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to {selectedFuelRefill?.status ? "deactivate" : "activate"} {selectedFuelRefill?.typeName} Fuel Refill?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <div className="flex flex-row gap-8">
                            <Button bg="gray.400" _hover={{ bg: "gray.500" }} color="#ffffff" variant="solid" onClick={onDialogClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" color="#FFFFFF" onClick={onConfirmDelete}>
                                {selectedFuelRefill?.status ? "Deactivate" : "Activate"}
                            </Button>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
