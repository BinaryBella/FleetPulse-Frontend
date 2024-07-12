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
import { Link } from "react-router-dom";
import { TiArrowUnsorted } from "react-icons/ti";
import { IoSearchOutline, IoSettingsSharp } from "react-icons/io5";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

export default function MaintenanceTable() {
    const [vehicleMaintenance, setVehicleMaintenance] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const itemsPerPage = 10;
    const cancelRef = useRef();

    useEffect(() => {
        fetchVehicleMaintenance();
    }, []);

    const fetchVehicleMaintenance = async () => {
        try {
            const response = await axios.get("https://localhost:7265/api/VehicleMaintenance");
            setVehicleMaintenance(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching vehicle maintenance:", error);
        }
    };

    const onClickDelete = (maintenance) => {
        setSelectedMaintenance(maintenance);
        onDialogOpen();
    };

    const onConfirmDelete = async () => {
        try {
            await axios.put(`https://localhost:7265/api/VehicleMaintenance/${selectedMaintenance.maintenanceId}`, {
                ...selectedMaintenance,
                status: !selectedMaintenance.status,
            });
            setVehicleMaintenance((prev) =>
                prev.map((maintenance) =>
                    maintenance.maintenanceId === selectedMaintenance.maintenanceId
                        ? { ...maintenance, status: !maintenance.status }
                        : maintenance
                )
            );
            onDialogClose();
        } catch (error) {
            console.error("Error updating maintenance status:", error);
        }
    };

    const columns = [
        {
            accessorKey: "vehicleRegistrationNo",
            header: "Vehicle Registration No",
            meta: { isNumeric: false, filter: "text" },
        },
        {
            accessorKey: "typeName",
            header: "Maintenance Type",
            meta: { isNumeric: false, filter: "text" },
        },
        {
            accessorKey: "maintenanceDate",
            header: "Date",
            cell: (info) => formatDate(info.row.original),
            meta: { isNumeric: false, filter: "date" },
        },
        {
            accessorKey: "cost",
            header: "Cost",
            meta: { isNumeric: true, filter: "text" },
        },
        {
            accessorKey: "partsReplaced",
            header: "Parts Replaced",
            meta: { isNumeric: false, filter: "text" },
        },
        {
            accessorKey: "serviceProvider",
            header: "Service Provider",
            meta: { isNumeric: false, filter: "text" },
        },
        {
            accessorKey: "specialNotes",
            header: "Special Notes",
            meta: { isNumeric: false, filter: "text" },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: (info) => (info.getValue() ? "Active" : "Inactive"),
            meta: { isNumeric: false, filter: "boolean" },
        },
        {
            accessorKey: "actions",
            header: "Actions",
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
                            <Link to={`/app/EditMaintenance/${row.original.maintenanceId}`}>
                                Edit
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => onClickDelete(row.original)}>
                            {row.original.status ? "Deactivate" : "Activate"}
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
            meta: { isNumeric: false, filter: null },
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: vehicleMaintenance,
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

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const startOffset = currentPage * itemsPerPage;
    const endOffset = startOffset + itemsPerPage;
    const sortedData = table.getRowModel().rows.map((row) => row.original);
    const currentData = sortedData.slice(startOffset, endOffset);
    const pageCount = Math.ceil(table.getFilteredRowModel().rows.length / itemsPerPage);
    const isEmpty = currentData.length === 0;
    const iconStyle = { display: "inline-block", verticalAlign: "middle", marginLeft: "5px" };
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();

    const formatDate = (maintenance) => {
        if (!maintenance.maintenanceDate) return "N/A";
        const datetimeParts = maintenance.maintenanceDate.split("T");
        return datetimeParts[0] || "Invalid Date";
    };

    const breadcrumbs = [
        { label: "Vehicle", link: "/app/VehicleDetailsTable" },
        { label: "Vehicle Maintenance Details", link: "/app/MaintenanceTable" },
    ];

    return (
        <div className="main-content">
            <PageHeader title="Vehicle Maintenance Details" breadcrumbs={breadcrumbs} />
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
                <Link to="/app/AddVehicleMaintenanceDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{ bg: theme.onHoverPurple }}
                        color="white"
                        variant="solid"
                        w="300px"
                        mr="50px"
                    >
                        Add New Vehicle Maintenance Details
                    </Button>
                </Link>
            </Box>

            <Table className="custom-table">
                <Thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const meta = header.column.columnDef.meta;
                                return (
                                    <Th
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        isNumeric={meta?.isNumeric}
                                        className="custom-table-th"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getCanSort() && (
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
                                        )}
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
                        currentData.map((maintenance, index) => (
                            <Tr key={index}>
                                <Td>{maintenance.vehicleRegistrationNo}</Td>
                                <Td>{maintenance.typeName}</Td>
                                <Td>{formatDate(maintenance)}</Td>
                                <Td>{maintenance.cost}</Td>
                                <Td>{maintenance.partsReplaced}</Td>
                                <Td>{maintenance.serviceProvider}</Td>
                                <Td>{maintenance.specialNotes}</Td>
                                <Td>{maintenance.status ? "Active" : "Inactive"}</Td>
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
                                                <Link to={`/app/EditMaintenance/${maintenance.maintenanceId}`}>
                                                    Edit
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={() => onClickDelete(maintenance)}>
                                                {maintenance.status ? "Deactivate" : "Activate"}
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
                <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
            )}

            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom" leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay />
                <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                    <AlertDialogHeader>{selectedMaintenance?.status ? "Deactivate" : "Activate"} Maintenance Details</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to {selectedMaintenance?.status ? "deactivate" : "activate"} {selectedMaintenance?.typeName} Maintenance?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <div className="flex flex-row gap-8">
                            <Button bg="gray.400" _hover={{ bg: "gray.500" }} color="#ffffff" variant="solid" onClick={onDialogClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" color="#FFFFFF" onClick={onConfirmDelete}>
                                {selectedMaintenance?.status ? "Deactivate" : "Activate"}
                            </Button>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
