import { useState, useRef, useEffect } from 'react';
import { axiosApi } from "../interceptor.js";
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
    InputGroup,
    InputLeftElement,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialog,
    Checkbox,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Stack
} from "@chakra-ui/react";
import {ChevronDownIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { TiArrowUnsorted } from "react-icons/ti";
import { IoSettingsSharp, IoSearchOutline } from "react-icons/io5";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination.jsx";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel
} from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import logo from "../assets/images/logo.png";

export default function VehicleDetails() {
    const [vehicleDetails, setVehicleDetails] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false); // New state for column selection modal
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const cancelRef = useRef();
    const itemsPerPage = 10;

    const exportToPDF = () => {
        const doc = new jsPDF();
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        // Add Logo at the center top
        const imgProps = doc.getImageProperties(logo);
        const imgWidth = 50;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = (pageWidth - imgWidth) / 2;

        doc.addImage(logo, "PNG", centerX, 8, imgWidth, imgHeight);

        // Add Report Title centered below the logo
        doc.setFontSize(16);
        const reportTitleY = imgHeight + 10;
        doc.text("Vehicle Details Report", pageWidth / 2, reportTitleY, { align: "center" });

        // Add Report creation date left-aligned below the report title
        doc.setFontSize(10);
        const creationDateY = reportTitleY + 10;
        doc.text(`Report created on: ${formattedDate}`, 20, creationDateY);

        // Generate the table
        doc.autoTable({
            startY: creationDateY + 10,
            head: [selectedColumns.map(column => column.header)],
            body: previewData.map(item =>
                selectedColumns.map(column => {
                    if (column.accessorKey === 'licenseExpireDate') {
                        const date = new Date(item[column.accessorKey]);
                        return date.toLocaleDateString();
                    }
                    return item[column.accessorKey];
                })
            ),
        });

        doc.save('vehicle_details.pdf');
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Vehicle Details');

        worksheet.addRow(selectedColumns.map(column => column.header));

        previewData.forEach(item => {
            worksheet.addRow(selectedColumns.map(column => {
                if (column.accessorKey === 'licenseExpireDate') {
                    const date = new Date(item[column.accessorKey]);
                    return date.toLocaleDateString();
                }
                if (column.accessorKey === 'status') {
                    return item[column.accessorKey] ? 'Active' : 'Inactive';
                }
                return item[column.accessorKey];
            }));
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'vehicle_details.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportToCSV = () => {
        const csvContent = [
            selectedColumns.map(column => column.header).join(','),
            ...previewData.map(item =>
                selectedColumns.map(column => {
                    if (column.accessorKey === 'licenseExpireDate') {
                        const date = new Date(item[column.accessorKey]);
                        return date.toLocaleDateString();
                    }
                    if (column.accessorKey === 'status') {
                        return item[column.accessorKey] ? 'Active' : 'Inactive';
                    }
                    return item[column.accessorKey];
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'vehicle_details.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    useEffect(() => {
        fetchVehicleDetails();
    }, []);

    const fetchVehicleDetails = async () => {
        try {
            const response = await axiosApi.get('https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Vehicles');
            setVehicleDetails(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching vehicle details:", error);
        }
    };

    const onClickDelete = (vehicle) => {
        setSelectedVehicle(vehicle);
        onDialogOpen();
    };

    const onConfirmDelete = async () => {
        try {
            if (!selectedVehicle || !selectedVehicle.vehicleId) {
                console.error('Selected vehicle or its ID is undefined.');
                return;
            }

            const endpoint = `https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Vehicles/${selectedVehicle.vehicleId}/${selectedVehicle.status ? 'deactivate' : 'activate'}`;

            const response = await axiosApi.put(endpoint, null, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 204) {
                fetchVehicleDetails();
                onDialogClose();
            } else {
                console.error('Failed to update vehicle status');
            }
        } catch (error) {
            console.error('Error updating vehicle status:', error);
        }
    };

    const columns = [
        {
            accessorKey: 'vehicleRegistrationNo',
            header: 'Reg No',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'licenseNo',
            header: 'License No',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'licenseExpireDate',
            header: 'License Exp Date',
            cell: info => {
                const date = new Date(info.getValue());
                return date.toLocaleDateString();
            },
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'manufacturer',
            header: 'Manufacturer',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'vehicleType',
            header: 'Type',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'fuelType',
            header: 'Fuel Type',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'vehicleColor',
            header: 'Color',
            meta: {isNumeric: false, filter: 'text'}
        },
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
                        aria-label='profile-options'
                        fontSize='20px'
                        icon={<IoSettingsSharp/>}
                    />
                    <MenuList>
                        <Link to={`/app/EditVehicleDetails/${row.original.vehicleId}`}>
                            <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem>
                            <Link to="/app/VehicleMaintenanceConfigurationTable">
                                Vehicle Maintenance Configuration
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => onClickDelete(row.original)}>
                            {row.original.status ? "Deactivate" : "Activate"}
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
            meta: {isNumeric: false, filter: null},
            enableSorting: false,
        }
    ];

    const table = useReactTable({
        data: vehicleDetails,
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
        {label: 'Vehicle', link: '/app/VehicleDetails'},
        {label: 'Vehicle Details', link: '/app/VehicleDetails'}
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

    const handleGenerateReport = () => {
        setIsColumnSelectionOpen(true); // Open column selection modal
    };

    const handleColumnSelection = () => {
        const selected = columns.filter(col => selectedColumns.includes(col.accessorKey) || col.id === 'actions');
        setSelectedColumns(selected);
    };

    const handlePreview = () => {
        // Apply the column selection, excluding the 'actions' column
        const selected = columns.filter(col =>
            selectedColumns.includes(col.accessorKey) && col.accessorKey !== 'actions'
        );
        setSelectedColumns(selected);

        // Generate preview data, excluding the 'actions' column
        const preview = vehicleDetails.map(item =>
            Object.fromEntries(
                selected.map(col => [col.accessorKey, item[col.accessorKey]])
            )
        );
        setPreviewData(preview);

        // Close the column selection modal and open the preview modal
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

    return (
        <div className="main-content">
            <PageHeader title="Vehicle Details" breadcrumbs={breadcrumbs}/>
            <Box mb="20px" mt="50px" display="flex" alignItems="center" gap="20px">
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
                <Button
                    bg={theme.purple}
                    _hover={{bg: theme.onHoverPurple}}
                    color="white"
                    variant="solid"
                    width="250px"
                    onClick={handleGenerateReport}
                >
                    Generate Report
                </Button>
                <Link to="/app/AddVehicleDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{bg: theme.onHoverPurple}}
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
                            {headerGroup.headers.map(header => (
                                <Th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    isNumeric={header.column.columnDef.meta?.isNumeric}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() ? (
                                        header.column.getIsSorted() === 'desc' ? (
                                            <TriangleDownIcon style={iconStyle}/>
                                        ) : (
                                            <TriangleUpIcon style={iconStyle}/>
                                        )
                                    ) : (
                                        header.column.columnDef.header !== 'Actions' && (
                                            <TiArrowUnsorted style={iconStyle}/>
                                        )
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {isEmpty ? (
                        <Tr>
                            <Td colSpan={columns.length} textAlign="center">
                                No data found
                            </Td>
                        </Tr>
                    ) : (
                        currentData.map((row, index) => (
                            <Tr key={index}>
                                {table.getRowModel().rows[index].getVisibleCells().map(cell => (
                                    <Td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    )}
                </Tbody>
            </Table>

            <Box mt="4">
                <Pagination
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    currentPage={currentPage}
                />
            </Box>

            {isDialogOpen && <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay>
                    <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                        <AlertDialogHeader>
                            {selectedVehicle?.status ? "Deactivate" : "Activate"} Vehicle
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to {selectedVehicle?.status ? "deactivate" : "activate"} this vehicle?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDialogClose}>Cancel</Button>
                            <Button colorScheme={selectedVehicle?.status ? "red" : "red"} onClick={onConfirmDelete} ml={3}>
                                {selectedVehicle?.status ? "Deactivate" : "Activate"}
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
                                                    {column.accessorKey === 'licenseExpireDate'
                                                        ? new Date(row[column.accessorKey]).toLocaleDateString()
                                                        : column.accessorKey === 'status'
                                                            ? row[column.accessorKey] ? 'Active' : 'Inactive'
                                                            : row[column.accessorKey]}
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
                                rightIcon={<ChevronDownIcon />}
                                bg={theme.purple}
                                _hover={{bg: theme.onHoverPurple}}
                                color="white"
                                variant="solid"
                                className="w-32"
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
