import { useState, useEffect, useRef } from "react";
import { axiosApi } from "../interceptor.js";
import {
    Table,
    Thead, Tbody, Tr, Th, Td, Box, Button, Menu, MenuButton, IconButton,
    MenuList, MenuItem, Input, InputGroup, InputLeftElement, AlertDialog,
    AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody,
    AlertDialogFooter, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, useDisclosure, Stack,
} from "@chakra-ui/react";
import { ChevronDownIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { TiArrowUnsorted } from "react-icons/ti";
import { IoSearchOutline, IoSettingsSharp } from "react-icons/io5";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import theme from "../config/ThemeConfig.jsx";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import logo from "../assets/images/logo.png";
import PageHeader from "../components/PageHeader.jsx";

export default function FuelRefillDetails() {
    const [fuelRefillDetails, setFuelRefillDetails] = useState([]);
    const [selectedFuelRefill, setSelectedFuelRefill] = useState(null);
    const [error, setError] = useState(null);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false); // New state for column selection modal
    const {isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose} = useDisclosure();
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
        doc.text("Fuel Refill Details Report", pageWidth / 2, reportTitleY, {align: "center"});

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
                    if (column.accessorKey === 'date') {
                        const date = new Date(item[column.accessorKey]);
                        return date.toLocaleDateString();
                    }
                    return item[column.accessorKey];
                })
            ),
        });

        doc.save('fuelrefill_details.pdf');
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Fuel Refill Details');

        worksheet.addRow(selectedColumns.map(column => column.header));

        previewData.forEach(item => {
            worksheet.addRow(selectedColumns.map(column => {
                if (column.accessorKey === 'date') {
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
        link.download = 'fuelrefill_details.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportToCSV = () => {
        const csvContent = [
            selectedColumns.map(column => column.header).join(','),
            ...previewData.map(item =>
                selectedColumns.map(column => {
                    if (column.accessorKey === 'date') {
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
        link.download = 'fuelrefill_details.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    useEffect(() => {
        fetchFuelRefill();
    }, []);


    const fetchFuelRefill = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/FuelRefill");
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
                await axiosApi.post(`https://localhost:7265/api/FuelRefill/deactivate/${selectedFuelRefill.fuelRefillId}`);
            } else {
                await axiosApi.post(`https://localhost:7265/api/FuelRefill/activate/${selectedFuelRefill.fuelRefillId}`);
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
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'vehicleRegistrationNo',
            header: 'Vehicle Reg No',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'literCount',
            header: 'Liter Count',
            meta: {isNumeric: true, filter: 'number'}
        },
        {
            accessorKey: 'date',
            header: 'Date',
            cell: info => formatDate(info.row.original),
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'time',
            header: 'Time',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'fType',
            header: 'Refill Type',
            meta: {isNumeric: false, filter: 'text'}
        },
        {
            accessorKey: 'cost',
            header: 'Cost',
            meta: {isNumeric: true, filter: 'number'}
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
                        aria-label="profile-options"
                        fontSize="20px"
                        icon={<IoSettingsSharp/>}
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
            meta: {isNumeric: false, filter: null}
        }
    ];

    const table = useReactTable({
        data: fuelRefillDetails,
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
        setCurrentPage(0); // Reset pagination when searching
    };

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

    const handlePreview = () => {
        // Apply the column selection, excluding the 'actions' column
        const selected = columns.filter(col =>
            selectedColumns.includes(col.accessorKey) && col.accessorKey !== 'actions'
        );
        setSelectedColumns(selected);

        // Generate preview data, excluding the 'actions' column
        const preview = fuelRefillDetails.map(item =>
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

    const breadcrumbs = [
        {label: "Vehicle", link: "/app/VehicleDetails"},
        {label: "Fuel Refill Details", link: "/app/FuelRefillDetails"},
    ];

    return (
        <div className="main-content">
            <PageHeader title="Fuel Refill Details" breadcrumbs={breadcrumbs}/>

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
                <Link to="/app/AddFuelRefillDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{bg: theme.onHoverPurple}}
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
                                );
                            })}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {isEmpty ? (
                        <Tr>
                            <Td colSpan={columns.length} textAlign="center">
                                <p>No results found for {searchInput}</p>
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
                                            icon={<IoSettingsSharp/>}
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
            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom"
                         leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay/>
                <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                    <AlertDialogHeader>{selectedFuelRefill?.status ? "Deactivate" : "Activate"} Fuel Refill
                        Details</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want
                        to {selectedFuelRefill?.status ? "deactivate" : "activate"} {selectedFuelRefill?.typeName} Fuel
                        Refill?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <div className="flex flex-row gap-8">
                            <Button bg="gray.400" _hover={{bg: "gray.500"}} color="#ffffff" variant="solid"
                                    onClick={onDialogClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" color="#FFFFFF" onClick={onConfirmDelete}>
                                {selectedFuelRefill?.status ? "Deactivate" : "Activate"}
                            </Button>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal for Column Selection */}
            <Modal isOpen={isColumnSelectionOpen} onClose={() => setIsColumnSelectionOpen(false)} isCentered>
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
            </Modal>

            {/* Modal for Preview */}
            <Modal
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
                                                    {column.accessorKey === 'date'
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
            </Modal>
        </div>
    );
}
