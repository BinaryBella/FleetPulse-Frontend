import  { useState, useEffect, useRef } from "react";
import { axiosApi } from "../interceptor.js";
import {
    Table, Thead, Tbody, Tr, Th, Td, Box, Button, Menu,
    MenuButton, IconButton, MenuList, MenuItem, Input, chakra,
    InputGroup, InputLeftElement, Text, AlertDialogOverlay,
    AlertDialogContent, AlertDialogHeader, AlertDialogBody,
    AlertDialogFooter, AlertDialog, useDisclosure, useToast,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalFooter, Checkbox, Stack
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { TiArrowUnsorted } from "react-icons/ti";
import { IoSettingsSharp, IoSearchOutline } from "react-icons/io5";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';

export default function StaffDetails() {
    const [staffDetails, setStaffDetails] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);

    const cancelRef = useRef();
    const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
    const itemsPerPage = 10;
    const toast = useToast();

    useEffect(() => {
        fetchStaffDetails();
    }, []);

    const onClickDelete = (staff) => {
        setSelectedStaff(staff);
        onDialogOpen();
    };

    const onConfirmDelete = async () => {
        try {
            const endpoint = selectedStaff.status
                ? `https://localhost:7265/api/Staff/${selectedStaff.userId}/deactivate`
                : `https://localhost:7265/api/Staff/${selectedStaff.userId}/activate`;
            await axiosApi.put(endpoint);
            fetchStaffDetails();
            onDialogClose();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data === "Staff is active and associated with staff records. Cannot deactivate.") {
                toast({
                    title: "Error",
                    description: "Staff is active and associated with staff records. Cannot deactivate.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                console.error("Error updating staff status:", error);
            }
        }
    };

    const fetchStaffDetails = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Staff");
            setStaffDetails(response.data);
        } catch (error) {
            console.error("Error fetching staff details:", error);
        }
    };

    const columns = [
        { accessorKey: 'firstName', header: 'First Name', meta: { isNumeric: false, filter: 'text' } },
        { accessorKey: 'lastName', header: 'Last Name', meta: { isNumeric: false, filter: 'text' } },
        { accessorKey: 'dateOfBirth', header: 'DoB', meta: { isNumeric: false, filter: 'text' } },
        { accessorKey: 'nic', header: 'NIC', meta: { isNumeric: false, filter: 'text' } },
        { accessorKey: 'emailAddress', header: 'Email Address', meta: { isNumeric: false, filter: 'text' } },
        { accessorKey: 'phoneNo', header: 'Phone No', meta: { isNumeric: false, filter: 'text' } },
        { accessorKey: 'emergencyContact', header: 'Emergency Contact', meta: { isNumeric: false, filter: 'text' } },
        { accessorKey: 'status', header: 'Status', cell: info => (info.getValue() ? "Active" : "Inactive"), meta: { isNumeric: false, filter: 'boolean' } },
        {
            id: 'actions', header: 'Actions', cell: ({ row }) => (
                <Menu>
                    <MenuButton color={theme.purple} as={IconButton} aria-label="profile-options" fontSize="20px" icon={<IoSettingsSharp />} />
                    <MenuList>
                        <MenuItem>
                            <Link to={`/app/EditStaffDetails/${row.original.userId}`}>Edit</Link>
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
        data: staffDetails,
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
        { label: 'Staff', link: '/app/StaffDetails' },
        { label: 'Staff Details', link: '/app/StaffDetails' }
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
        setIsColumnSelectionOpen(true); // Open column selection modal
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

        const preview = staffDetails.map(item => {
            let previewItem = {};
            selected.forEach(col => {
                if (col.accessorKey === 'status') {
                    // Convert the boolean status to "Active" or "Inactive"
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
        doc.text("Staff Details Report", doc.internal.pageSize.getWidth() / 2, reportTitleY, { align: "center" });

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

        doc.save('staff_details.pdf');
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Staff Details');

        worksheet.addRow(selectedColumns.map(column => column.header));

        previewData.forEach(item => {
            worksheet.addRow(selectedColumns.map(column => item[column.accessorKey]));
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'staff_details.xlsx';
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
        link.download = 'staff_details.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="main-content">
            <PageHeader title="Staff Details" breadcrumbs={breadcrumbs} />
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
                <Link to="/app/AddStaffDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{ bg: theme.onHoverPurple }}
                        color="white"
                        variant="solid"
                        w="180px"
                        mr="50px"
                    >
                        Add New Staff Details
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
                        currentData.map((staff, index) => (
                            <Tr key={index}>
                                <Td className="custom-table-td">{staff.firstName}</Td>
                                <Td className="custom-table-td">{staff.lastName}</Td>
                                <Td>{staff.dateOfBirth ? staff.dateOfBirth.split('T')[0] : ''}</Td>
                                <Td className="custom-table-td">{staff.nic}</Td>
                                <Td className="custom-table-td">{staff.emailAddress}</Td>
                                <Td className="custom-table-td">{staff.phoneNo}</Td>
                                <Td className="custom-table-td">{staff.emergencyContact}</Td>
                                <Td className="custom-table-td">{staff.status ? "Active" : "Inactive"}</Td>
                                <Td className="custom-table-td">
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
                                                <Link to={`/app/EditStaffDetails/${staff.userId}`}>Edit</Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to={`/app/ResetPasswordDriverHelper?username=${staff.userName}&emailAddress=${staff.emailAddress}`}>
                                                    Reset Password
                                                </Link>                                            </MenuItem>
                                            <MenuItem onClick={() => onClickDelete(staff)}>
                                                {staff.status ? "Deactivate" : "Activate"}
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

            {isDialogOpen && <AlertDialog
                isOpen={isDialogOpen}
                onClose={onDialogClose}
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
            >
                <AlertDialogOverlay />
                <AlertDialogContent position="absolute" top="30%" left="50%" transform="translate(-50%, -50%)">
                    <AlertDialogHeader>{selectedStaff?.status ? "Deactivate" : "Activate"} Staff</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to {selectedStaff?.status ? "deactivate" : "activate"} {selectedStaff?.firstName} {selectedStaff?.lastName}?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button
                            bg="gray.400"
                            _hover={{ bg: "gray.500" }}
                            color="#ffffff"
                            variant="solid"
                            onClick={onDialogClose}
                            ref={cancelRef}
                            ml={3}
                        >
                            Cancel
                        </Button>
                        <Button colorScheme="red" color="#FFFFFF" onClick={onConfirmDelete} ml={3}>
                            {selectedStaff?.status ? "Deactivate" : "Activate"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
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

