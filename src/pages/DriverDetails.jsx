import {useEffect, useRef, useState, useMemo} from "react";
import {
    Table, Thead, Tbody, Tr, Th, Td, Box, Button, Menu, MenuButton,
    IconButton, MenuList, MenuItem, Input, InputGroup, InputLeftElement,
    AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody,
    AlertDialogFooter, AlertDialog, Checkbox, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalBody, ModalFooter, useDisclosure, Stack, Text
} from "@chakra-ui/react";
import {ChevronDownIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {TiArrowUnsorted} from "react-icons/ti";
import {IoSearchOutline, IoSettingsSharp} from "react-icons/io5";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import {axiosApi} from "../interceptor.js";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination";
import theme from "../config/ThemeConfig.jsx";
import logo from "../assets/images/logo.png";
import {
    flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable
} from '@tanstack/react-table';

export default function DriverDetails() {
    const [driverDetails, setDriverDetails] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);
    const {isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose} = useDisclosure();
    const {isOpen, onOpen, onClose} = useDisclosure(); // for 'More Details' Modal
    const cancelRef = useRef();
    const itemsPerPage = 10;

    useEffect(() => {
        fetchDriverDetails();
    }, []);

    const fetchDriverDetails = async () => {
        try {
            const response = await axiosApi.get("https://localhost:7265/api/Driver");
            setDriverDetails(response.data);
        } catch (error) {
            console.error("Error fetching driver details:", error);
        }
    };

    const handlePageClick = ({selected}) => {
        setCurrentPage(selected);
    };

    const breadcrumbs = [
        {label: "Driver", link: "/app/DriverDetails"},
        {label: "Driver Details", link: "/app/DriverDetails"},
    ];

    const columns = useMemo(() => [
        {accessorKey: 'firstName', header: 'First Name', meta: {isNumeric: false, filter: 'text'}},
        {accessorKey: 'lastName', header: 'Last Name', meta: {isNumeric: false, filter: 'text'}},
        {accessorKey: 'nic', header: 'NIC', meta: {isNumeric: false, filter: 'text'}},
        {accessorKey: 'driverLicenseNo', header: 'License No', meta: {isNumeric: false, filter: 'text'}},
        {
            accessorKey: 'licenseExpiryDate',
            header: 'License Exp Date',
            cell: info => {
                const dateString = info.getValue();
                if (dateString) {
                    const dateOnly = dateString.split('T')[0];
                    return dateOnly;
                }
                return '';
            },
            meta: {isNumeric: false, filter: 'text'}
        },
        {accessorKey: 'phoneNo', header: 'Phone No', meta: {isNumeric: false, filter: 'text'}},
        {accessorKey: 'emergencyContact', header: 'Emergency Contact', meta: {isNumeric: false, filter: 'text'}},
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (info.getValue() ? "Active" : "Inactive"),
            meta: {isNumeric: false, filter: 'boolean'}
        }, {
            id: 'actions',
            header: 'Actions',
            cell: ({row}) => (
                <Menu>
                    <MenuButton color={theme.purple} as={IconButton} aria-label="profile-options" fontSize="20px"
                                icon={<IoSettingsSharp/>}/>
                    <MenuList>
                        <MenuItem>
                            <Link to={`/app/EditDriverDetails/${row.original.userId}`}>Edit</Link>
                        </MenuItem>
                        <MenuItem>
                            <Link
                                to={`/app/ResetPasswordDriverHelper?username=${row.original.userName}&emailAddress=${row.original.emailAddress}`}>
                                Reset Password
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => onClickMoreDetails(row.original)}>More Details</MenuItem>
                        <MenuItem
                            onClick={() => onClickDelete(row.original)}>{row.original.status ? "Deactivate" : "Activate"}</MenuItem>
                    </MenuList>
                </Menu>
            ),
            meta: {isNumeric: false, filter: null},
            enableSorting: false,
        }
    ], [])

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

    const startOffset = currentPage * itemsPerPage;
    const endOffset = startOffset + itemsPerPage;
    const sortedData = table.getRowModel().rows.map(row => row.original);
    const currentData = sortedData.slice(startOffset, endOffset);
    const pageCount = Math.ceil(table.getFilteredRowModel().rows.length / itemsPerPage);
    const isEmpty = currentData.length === 0;
    const iconStyle = {display: "inline-block", verticalAlign: "middle", marginLeft: "5px"};

    const onClickDelete = (driver) => {
        setSelectedDriver(driver);
        onDialogOpen();
    };

    const onClickMoreDetails = (driver) => {
        setSelectedDriver(driver);
        onOpen();
    };

    const onConfirmDelete = async () => {
        try {
            const endpoint = `https://localhost:7265/api/Driver/${selectedDriver.userId}/${selectedDriver.status ? 'deactivate' : 'activate'}`;
            await axiosApi.put(endpoint);
            fetchDriverDetails();
            onDialogClose();
        } catch (error) {
            console.error("Error updating driver status:", error);
        }
    };

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

        const preview = driverDetails.map(item => {
            const data = Object.fromEntries(
                selected.map(col => [col.accessorKey, item[col.accessorKey]])
            );
            // Add the additional fields from 'More Details' modal to the report
            data.emailAddress = item.emailAddress;
            data.bloodGroup = item.bloodGroup;
            data.dateOfBirth = item.dateOfBirth;
            return data;
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

        const imgProps = doc.getImageProperties(logo);
        const imgWidth = 50;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = (pageWidth - imgWidth) / 2;

        doc.addImage(logo, "PNG", centerX, 8, imgWidth, imgHeight);

        doc.setFontSize(16);
        const reportTitleY = imgHeight + 10;
        doc.text("Driver Details Report", pageWidth / 2, reportTitleY, {align: "center"});

        doc.setFontSize(12);
        const additionalInfoY = reportTitleY + 10;
        doc.text(`Report Date: ${formattedDate}`, 20, additionalInfoY);
        doc.text("Generated by: Your App Name", 20, additionalInfoY + 5);

        doc.autoTable({
            startY: additionalInfoY + 20,
            head: [selectedColumns.map(column => column.header).concat(["Email", "Blood Group", "Date of Birth"])],
            body: previewData.map(item =>
                selectedColumns.map(column => item[column.accessorKey]).concat(
                    item.emailAddress,
                    item.bloodGroup,
                    new Date(item.dateOfBirth).toLocaleDateString()
                )
            ),
        });

        doc.save('driver_details.pdf');
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Driver Details');

        worksheet.columns = selectedColumns.map(column => ({
            header: column.header,
            key: column.accessorKey,
        })).concat([
            {header: "Email", key: "emailAddress"},
            {header: "Blood Group", key: "bloodGroup"},
            {header: "Date of Birth", key: "dateOfBirth"}
        ]);

        const date = new Date();
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        worksheet.mergeCells('A1:E1');
        worksheet.getCell('A1').value = "Driver Details Report";
        worksheet.getCell('A1').font = {size: 16, bold: true};
        worksheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};

        worksheet.mergeCells('A2:E2');
        worksheet.getCell('A2').value = `Report Date: ${formattedDate}`;
        worksheet.getCell('A2').font = {size: 12, bold: true};
        worksheet.getCell('A2').alignment = {vertical: 'middle', horizontal: 'center'};

        worksheet.mergeCells('A3:E3');
        worksheet.getCell('A3').value = "Generated by: Your App Name";
        worksheet.getCell('A3').font = {size: 12, bold: true};
        worksheet.getCell('A3').alignment = {vertical: 'middle', horizontal: 'center'};

        previewData.forEach(item => {
            worksheet.addRow(selectedColumns.map(column => item[column.accessorKey]).concat(
                item.emailAddress,
                item.bloodGroup,
                new Date(item.dateOfBirth).toLocaleDateString()
            ));
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'driver_details.xlsx';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportToCSV = () => {
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        const header = `Driver Details Report\nReport Date: ${formattedDate}\nGenerated by: Your App Name\n`;

        const csvContent = [
            header,
            selectedColumns.map(column => column.header).concat(["Email", "Blood Group", "Date of Birth"]).join(','),
            ...previewData.map(item =>
                selectedColumns.map(column => item[column.accessorKey]).concat(
                    item.emailAddress,
                    item.bloodGroup,
                    new Date(item.dateOfBirth).toLocaleDateString()
                ).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'driver_details.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="main-content">
            <PageHeader title="Driver Details" breadcrumbs={breadcrumbs}/>
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
                <Link to="/app/AddDriverDetails">
                    <Button
                        bg={theme.purple}
                        _hover={{bg: theme.onHoverPurple}}
                        color="white"
                        variant="solid"
                        w="200px"
                        mr="50"
                    >
                        Add New Driver Details
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

            <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay>
                    <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                        <AlertDialogHeader>
                            {selectedDriver?.status ? "Deactivate" : "Activate"} Driver
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to {selectedDriver?.status ? "deactivate" : "activate"} this driver?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDialogClose}>Cancel</Button>
                            <Button colorScheme={selectedDriver?.status ? "red" : "red"} onClick={onConfirmDelete}
                                    ml={3}>
                                {selectedDriver?.status ? "Deactivate" : "Activate"}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* Modal for Column Selection */}
            <Modal isOpen={isColumnSelectionOpen} onClose={() => setIsColumnSelectionOpen(false)} isCentered>
                <ModalOverlay/>
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
                            _hover={{bg: theme.onHoverPurple}}
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
                <ModalOverlay/>
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
                                                    {column.accessorKey === 'licenseExpiryDate'
                                                        ? new Date(row[column.accessorKey]).toLocaleDateString()
                                                        : column.accessorKey === 'status'
                                                            ? row[column.accessorKey] ? 'Active' : 'Inactive'
                                                            : row[column.accessorKey]}
                                                </Td>
                                            ))}
                                            {/* Include additional details here */}
                                            <Td>{row.emailAddress}</Td>
                                            <Td>{row.bloodGroup}</Td>
                                            <Td>{new Date(row.dateOfBirth).toLocaleDateString()}</Td>
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
                                rightIcon={<ChevronDownIcon/>}
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

            {/* Modal for More Details */}
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
