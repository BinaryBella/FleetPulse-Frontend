import {useState, useEffect, useRef} from "react";
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
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Checkbox,
    Stack
} from "@chakra-ui/react";
import {ChevronDownIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {Link} from "react-router-dom";
import {TiArrowUnsorted} from "react-icons/ti";
import {IoSearchOutline, IoSettingsSharp} from "react-icons/io5";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination.jsx";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import {flexRender} from "@tanstack/react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";
import logo from "../assets/images/logo.png";
export default function VehicleMaintenanceDetails() {
    const [vehicleMaintenance, setVehicleMaintenance] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchInput, setSearchInput] = useState("");
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const itemsPerPage = 10;
    const cancelRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaintenanceForModal, setSelectedMaintenanceForModal] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);

    useEffect(() => {
        fetchVehicleMaintenance();
    }, []);

    const handlePreview = () => {
        // Filter out the "Actions" column from selectedColumns
        const filteredSelectedColumns = columns
            .filter(col => selectedColumns.includes(col.accessorKey) && col.accessorKey !== 'actions');

        // Update selectedColumns state with the filtered list
        setSelectedColumns(filteredSelectedColumns);

        // Prepare preview data without the "Actions" column
        const preview = vehicleMaintenance.map(item =>
            Object.fromEntries(
                filteredSelectedColumns.map(col => [col.accessorKey, item[col.accessorKey]])
            )
        );
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

    const handleGenerateReport = () => {
        setIsColumnSelectionOpen(true);
    };

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
        doc.text("Vehicle Maintenance Report", pageWidth / 2, reportTitleY, { align: "center" });

        // Add Report creation date left-aligned below the report title
        doc.setFontSize(10);
        const creationDateY = reportTitleY + 10;
        doc.text(`Report created on: ${formattedDate}`, 20, creationDateY);

        // Generate the table excluding the Actions column
        doc.autoTable({
            startY: creationDateY + 10,
            head: [selectedColumns.filter(col => col.accessorKey !== 'actions').map(column => column.header)],
            body: previewData.map(item =>
                selectedColumns.filter(col => col.accessorKey !== 'actions').map(column => {
                    if (column.accessorKey === 'maintenanceDate') {
                        const date = new Date(item[column.accessorKey]);
                        return date.toLocaleDateString();
                    }
                    return item[column.accessorKey];
                })
            ),
        });

        doc.save('vehicle_maintenance.pdf');
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Vehicle Maintenance Details");

        // Add headers excluding Actions
        worksheet.addRow(
            columns
                .filter(column => column.accessorKey !== 'actions')
                .map(column => column.header)
                .concat('Special Notes')
        );

        // Add data excluding Actions
        vehicleMaintenance.forEach(item => {
            worksheet.addRow(
                columns
                    .filter(column => column.accessorKey !== 'actions')
                    .map(column => item[column.accessorKey] || 'N/A')
                    .concat(item.specialNotes || 'N/A')
            );
        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Create blob and download
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "vehicle_maintenance_details.xlsx";
        link.click();
        URL.revokeObjectURL(link.href);
    };


    const exportToCSV = () => {
        const csvContent = [
            columns
                .filter(column => column.accessorKey !== 'actions')
                .map(column => column.header)
                .concat('Special Notes')
                .join(","),
            ...vehicleMaintenance.map(item =>
                columns
                    .filter(column => column.accessorKey !== 'actions')
                    .map(column => item[column.accessorKey] || 'N/A')
                    .concat(item.specialNotes || 'N/A')
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "vehicle_maintenance_details.csv";
        link.click();
        URL.revokeObjectURL(link.href);
    };


    const fetchVehicleMaintenance = async () => {
        try {
            const response = await axiosApi.get(" http://localhost:5173/api/VehicleMaintenance");
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
            await axiosApi.put(` http://localhost:5173/api/VehicleMaintenance/${selectedMaintenance.maintenanceId}`, {
                ...selectedMaintenance,
                status: !selectedMaintenance.status,
            });
            setVehicleMaintenance((prev) =>
                prev.map((maintenance) =>
                    maintenance.maintenanceId === selectedMaintenance.maintenanceId
                        ? {...maintenance, status: !maintenance.status}
                        : maintenance
                )
            );
            onDialogClose();
        } catch (error) {
            console.error("Error updating maintenance status:", error);
        }
    };

    const openModal = (maintenance) => {
        setSelectedMaintenanceForModal(maintenance);
        setIsModalOpen(true);
    };

    const columns = [
        {
            accessorKey: "vehicleRegistrationNo",
            header: "Vehicle Reg No",
            meta: {isNumeric: false, filter: "text"},
        },
        {
            accessorKey: "typeName",
            header: "Maintenance Type",
            meta: {isNumeric: false, filter: "text"},
        },
        {
            accessorKey: "maintenanceDate",
            header: "Date",
            cell: (info) => formatDate(info.row.original),
            meta: {isNumeric: false, filter: "date"},
        },
        {
            accessorKey: "cost",
            header: "Cost",
            meta: {isNumeric: true, filter: "text"},
        },
        {
            accessorKey: "partsReplaced",
            header: "Parts Replaced",
            meta: {isNumeric: false, filter: "text"},
        },
        {
            accessorKey: "serviceProvider",
            header: "Service Provider",
            meta: {isNumeric: false, filter: "text"},
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: (info) => (info.getValue() ? "Active" : "Inactive"),
            meta: {isNumeric: false, filter: "boolean"},
        },
        {
            accessorKey: "actions",
            header: "Actions",
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
                            <Link to={`/app/EditMaintenance/${row.original.maintenanceId}`}>
                                Edit
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={() => onClickDelete(row.original)}>
                            {row.original.status ? "Deactivate" : "Activate"}
                        </MenuItem>
                        <MenuItem onClick={() => openModal(row.original)}>
                            Special Notes
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
            meta: {isNumeric: false, filter: null},
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: vehicleMaintenance,
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

    const handlePageClick = ({selected}) => {
        setCurrentPage(selected);
    };

    const startOffset = currentPage * itemsPerPage;
    const endOffset = startOffset + itemsPerPage;
    const sortedData = table.getRowModel().rows.map((row) => row.original);
    const currentData = sortedData.slice(startOffset, endOffset);
    const pageCount = Math.ceil(table.getFilteredRowModel().rows.length / itemsPerPage);
    const isEmpty = currentData.length === 0;
    const iconStyle = {display: "inline-block", verticalAlign: "middle", marginLeft: "5px"};
    const {isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose} = useDisclosure();

    const formatDate = (maintenance) => {
        if (!maintenance.maintenanceDate) return "N/A";
        const datetimeParts = maintenance.maintenanceDate.split("T");
        return datetimeParts[0] || "Invalid Date";
    };

    const breadcrumbs = [
        {label: "Vehicle", link: "/app/VehicleDetails"},
        {label: "Vehicle Maintenance Details", link: "/app/VehicleMaintenanceDetails"},
    ];

    return (
        <div className="main-content">
            <PageHeader title="Vehicle Maintenance Details" breadcrumbs={breadcrumbs}/>
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
                    <Link to="/app/AddVehicleMaintenanceDetails">
                        <Button
                            bg={theme.purple}
                            _hover={{bg: theme.onHoverPurple}}
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
                                                        <TriangleDownIcon aria-label="sorted descending"
                                                                          style={iconStyle}/>
                                                    ) : (
                                                        <TriangleUpIcon aria-label="sorted ascending"
                                                                        style={iconStyle}/>
                                                    )
                                                ) : (
                                                    <TiArrowUnsorted aria-label="unsorted" style={iconStyle}/>
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
                                <Td>{maintenance.status ? "Active" : "Inactive"}</Td>
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
                                                <Link to={`/app/EditMaintenance/${maintenance.maintenanceId}`}>
                                                    Edit
                                                </Link>
                                            </MenuItem>
                                            <MenuItem onClick={() => onClickDelete(maintenance)}>
                                                {maintenance.status ? "Deactivate" : "Activate"}
                                            </MenuItem>
                                            <MenuItem onClick={() => openModal(maintenance)}>
                                                Special Notes
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
                <Pagination pageCount={pageCount} onPageChange={handlePageClick}/>
            )}

            {isDialogOpen && <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom"
                         leastDestructiveRef={cancelRef}>
                <AlertDialogOverlay/>
                <AlertDialogContent position="absolute" top="30%" left="35%" transform="translate(-50%, -50%)">
                    <AlertDialogHeader>{selectedMaintenance?.status ? "Deactivate" : "Activate"} Maintenance
                        Details</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want
                        to {selectedMaintenance?.status ? "deactivate" : "activate"} {selectedMaintenance?.typeName} Maintenance?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <div className="flex flex-row gap-8">
                            <Button bg="gray.400" _hover={{bg: "gray.500"}} color="#ffffff" variant="solid"
                                    onClick={onDialogClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" color="#FFFFFF" onClick={onConfirmDelete}>
                                {selectedMaintenance?.status ? "Deactivate" : "Activate"}
                            </Button>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>}

            {isModalOpen && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Maintenance Details</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        {selectedMaintenanceForModal && (
                            <>
                                <Text as='b'>Vehicle Registration No</Text>
                                <Text className="mb-3">{selectedMaintenanceForModal.vehicleRegistrationNo}</Text>
                                <Text as='b'>Maintenance Type</Text>
                                <Text className="mb-3">{selectedMaintenanceForModal.typeName}</Text>
                                <Text as='b'>Special Notes</Text>
                                <Text className="mb-3">{selectedMaintenanceForModal.specialNotes}</Text>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button bg={theme.purple}
                                _hover={{bg: theme.onHoverPurple}}
                                color="white"
                                variant="solid" onClick={() => setIsModalOpen(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>}

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
                                        column.accessorKey !== 'actions' && (
                                            <Th key={column.accessorKey}>
                                                {column.header}
                                            </Th>
                                        )
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {previewData.length > 0 ? (
                                    previewData.map((row, rowIndex) => (
                                        <Tr key={rowIndex}>
                                            {selectedColumns.map((column) => (
                                                column.accessorKey !== 'actions' && (
                                                    <Td key={column.accessorKey}>
                                                        {column.accessorKey === 'maintenanceDate'
                                                            ? formatDate(row)
                                                            : column.accessorKey === 'status'
                                                                ? row[column.accessorKey] ? 'Active' : 'Inactive'
                                                                : row[column.accessorKey]}
                                                    </Td>
                                                )
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
                                                    {column.accessorKey === 'maintenanceDate'
                                                        ? formatDate(row)
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
