import React, { useState, useEffect, useRef } from 'react';
import { axiosApi } from "../interceptor.js";
import {
    Table, Thead, Tbody, Tr, Th, Td, Box, Button, Menu,
    MenuButton, IconButton, MenuList, MenuItem, Input, chakra,
    InputGroup, InputLeftElement, Text, AlertDialogOverlay,
    AlertDialogContent, AlertDialogHeader, AlertDialogBody,
    AlertDialogFooter, AlertDialog, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalFooter, Checkbox, Stack
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { IoSettingsSharp, IoSearchOutline } from "react-icons/io5";
import { TiArrowUnsorted } from "react-icons/ti";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';

export default function TripDetails() {
    const [tripDetails, setTripDetails] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);

    const cancelRef = useRef();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTripDetails();
    }, []);

    const fetchTripDetails = async () => {
        try {
            const response = await axiosApi.get("https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Trip");
            setTripDetails(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching trip details:", error);
        }
    };

    const onClickDelete = (trip) => {
        setSelectedTrip(trip);
        onDialogOpen();
    };

    const onConfirmDelete = async () => {
        try {
            const action = selectedTrip.status ? 'deactivate' : 'activate';
            const endpoint = `https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Trip/${action}/${selectedTrip.tripId}`;

            // Log to debug
            console.log("Trip ID:", selectedTrip.tripId);
            console.log("Status:", selectedTrip.status);
            console.log("Endpoint URL:", endpoint);

            // Make sure tripId is valid
            if (!selectedTrip.tripId) {
                throw new Error("Invalid trip ID");
            }

            const response = await axiosApi.put(endpoint);

            fetchTripDetails();
            onDialogClose();
        } catch (error) {
            console.error("Error updating trip status:", error);

       }
    };


    const columns = [
        { accessorKey: 'nic', header: 'Driver\'s NIC', meta: { isNumeric: false, filter: 'text' } },
        { accessorKey: 'vehicleRegistrationNo', header: 'Vehicle Reg.No', meta: { isNumeric: false, filter: 'text' } },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: info => {
                const dateString = info.getValue();
                if (dateString) {
                    const dateOnly = dateString.split('T')[0];
                    return dateOnly;
                }
                return '';
            },
            meta: { isNumeric: false, filter: 'text' }
        },
        {
            accessorKey: 'startTime',
            header: 'Start Time',
            meta: { isNumeric: false, filter: 'text' },
            cell: ({ getValue }) => {
                const timeValue = new Date(getValue());
                return timeValue.toLocaleTimeString();
            }
        },
        {
            accessorKey: 'endTime',
            header: 'End Time',
            meta: { isNumeric: false, filter: 'text' },
            cell: ({ getValue }) => {
                const timeValue = new Date(getValue());
                return timeValue.toLocaleTimeString();
            }
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (info.getValue() ? "Active" : "Inactive"),
            meta: { isNumeric: false, filter: 'boolean' }
        },
        {
            id: 'actions', header: 'Actions', cell: ({ row }) => (
                <Menu>
                    <MenuButton color={theme.purple} as={IconButton} aria-label="profile-options" fontSize="20px" icon={<IoSettingsSharp />} />
                    <MenuList>
                        <MenuItem>
                            <Link to={`/app/EditTripDetails/${row.original.tripId}`}>Edit</Link>
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

    const handleGenerateReport = () => {
        setIsColumnSelectionOpen(true);
    };

    const handleColumnSelection = () => {
        const selected = columns.filter(col => selectedColumns.includes(col.accessorKey) || col.id === 'actions');
        setSelectedColumns(selected);
    };

    const handlePreview = () => {
        const selected = columns.filter(col =>
            selectedColumns.includes(col.accessorKey) && col.accessorKey !== 'actions'
        );
        setSelectedColumns(selected);

        const preview = tripDetails.map(item => {
            let previewItem = {};
            selected.forEach(col => {
                if (col.accessorKey === 'status') {
                    previewItem[col.accessorKey] = item[col.accessorKey] ? 'Active' : 'Inactive';
                } else {
                    previewItem[col.accessorKey] = item[col.accessorKey];
                }
            });
            return previewItem;
        });

        setPreviewData(preview);
        setIsColumnSelectionOpen(false);
        setIsPreviewOpen(true);
    };

    const handleCheckboxChange = (accessorKey) => {
        setSelectedColumns(prev =>
            prev.includes(accessorKey)
                ? prev.filter(col => col !== accessorKey)
                : [...prev, accessorKey]
        );
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        doc.setFontSize(16);
        const reportTitleY = 10;
        doc.text("Trip Details Report", doc.internal.pageSize.getWidth() / 2, reportTitleY, { align: "center" });

        doc.setFontSize(10);
        const creationDateY = reportTitleY + 10;
        doc.text(`Report created on: ${formattedDate}`, 20, creationDateY);

        doc.autoTable({
            startY: creationDateY + 10,
            head: [selectedColumns.map(column => column.header)],
            body: previewData.map(item =>
                selectedColumns.map(column => item[column.accessorKey])
            ),
        });

        doc.save('trip_details.pdf');
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Trip Details');

        worksheet.addRow(selectedColumns.map(column => column.header));

        previewData.forEach(item => {
            worksheet.addRow(selectedColumns.map(column => item[column.accessorKey]));
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'trip_details.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportToCSV = () => {
        const csvContent = [
            selectedColumns.map(column => column.header).join(','),
            ...previewData.map(item =>
                selectedColumns.map(column => item[column.accessorKey]).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'trip_details.csv';
        link.click();
        URL.revokeObjectURL(link.href);
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
                <Button
                    bg={theme.purple}
                    _hover={{ bg: theme.onHoverPurple }}
                    color="white"
                    variant="solid"
                    width="250px"
                    onClick={handleGenerateReport}
                >
                    Generate Report
                </Button>
                <Link to="/app/AddTripDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{ bg: theme.onHoverPurple }}
                        color="white"
                        variant="solid"
                        w="200px"
                        mr="50"
                    >
                        Add New Trip Details
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
                                <Td>{trip.nic}</Td>
                                <Td>{trip.vehicleRegistrationNo}</Td>
                                <Td>{trip.date ? trip.date.split('T')[0] : ''}</Td>
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
                                                <Link to={`/app/EditTripDetails/${trip.tripId}`}>
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

            {!isEmpty && <Pagination pageCount={pageCount} onPageChange={handlePageClick} />}

            {isDialogOpen && <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay>
                    <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                        <AlertDialogHeader>
                            {selectedTrip?.status ? "Deactivate" : "Activate"} Trip
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to {selectedTrip?.status ? "deactivate" : "activate"} this trip?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDialogClose}>Cancel</Button>
                            <Button colorScheme={selectedTrip?.status ? "red" : "red"} onClick={onConfirmDelete} ml={3}>
                                {selectedTrip?.status ? "Deactivate" : "Activate"}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>}
            {/* Modal for Column Selection */}
            {isColumnSelectionOpen && <Modal isOpen={isColumnSelectionOpen} onClose={() => setIsColumnSelectionOpen(false)} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Select Columns for Report</ModalHeader>
                    <ModalBody>
                        <Stack spacing={3}>
                            {columns.map(column => (
                                column.id !== 'actions' && (
                                    <Checkbox
                                        key={column.accessorKey}
                                        isChecked={selectedColumns.includes(column.accessorKey)}
                                        onChange={() => handleCheckboxChange(column.accessorKey)}
                                    >
                                        {column.header}
                                    </Checkbox>
                                )
                            ))}
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={handlePreview}
                            isDisabled={selectedColumns.length === 0}
                            bg={theme.purple}
                            _hover={{ bg: theme.onHoverPurple }}
                            color="white"
                        >
                            Preview
                        </Button>
                        <Button ml={3} onClick={() => setIsColumnSelectionOpen(false)}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>}

            {/* Modal for Preview */}
            {isPreviewOpen && <Modal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                size="6xl"
                isCentered
            >
                <ModalOverlay />
                <ModalContent maxHeight="80vh">
                    <ModalHeader>Preview</ModalHeader>
                    <ModalBody overflowY="auto">
                        <Table className="custom-table">
                            <Thead>
                                <Tr>
                                    {selectedColumns.map((column) => (
                                        <Th key={column.accessorKey}>
                                            {column.header}
                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {previewData.length > 0 ? (
                                    previewData.map((row, rowIndex) => (
                                        <Tr key={rowIndex}>
                                            {selectedColumns.map((column) => (
                                                <Td key={column.accessorKey}>
                                                    {row[column.accessorKey]}
                                                </Td>
                                            ))}
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan={selectedColumns.length} textAlign="center">
                                            No data available
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rightIcon={<TriangleDownIcon />}
                                bg={theme.purple}
                                _hover={{ bg: theme.onHoverPurple }}
                                color="white"
                                variant="solid"
                            >
                                Export
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={exportToPDF}>Export to PDF</MenuItem>
                                <MenuItem onClick={exportToExcel}>Export to Excel</MenuItem>
                                <MenuItem onClick={exportToCSV}>Export to CSV</MenuItem>
                            </MenuList>
                        </Menu>
                        <Button ml={3} onClick={() => setIsPreviewOpen(false)}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>}
        </div>
    );
}

