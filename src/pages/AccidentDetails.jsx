import { useState, useEffect, useRef } from "react";
import {
  Table, Thead, Tbody, Tr, Th, Td, Box, Button, Menu,
  MenuButton, IconButton, MenuList, MenuItem, Input, chakra,
  InputGroup, InputLeftElement, Text, useToast, AlertDialog,
  AlertDialogOverlay, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter, useDisclosure, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Checkbox, Stack
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { TiArrowUnsorted } from "react-icons/ti";
import { IoSearchOutline, IoSettingsSharp } from "react-icons/io5";
import theme from "../config/ThemeConfig.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination";
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { axiosApi } from "../interceptor.js";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';

export default function AccidentDetails() {
  const [accidentDetails, setAccidentDetails] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);
  const [isSpecialNotesOpen, setIsSpecialNotesOpen] = useState(false);
  const [specialNotesContent, setSpecialNotesContent] = useState("");

  const cancelRef = useRef();
  const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
  const itemsPerPage = 10;
  const toast = useToast();

  useEffect(() => {
    fetchAccidentDetails();
  }, []);

  const fetchAccidentDetails = async () => {
    try {
      const response = await axiosApi.get("https://localhost:7265/api/Accidents");
      setAccidentDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching accident details:", error);
    }
  };

  const columns = [
    { accessorKey: "vehicleRegistrationNo", header: "Vehicle Reg No", meta: {isNumeric: false, filter: "text"} },
    { accessorKey: "date", header: "Date", meta: { isNumeric: false, filter: "text" } },
    { accessorKey: "time", header: "Time", meta: { isNumeric: false, filter: "text" } },
    { accessorKey: "venue", header: "Venue", meta: { isNumeric: false, filter: "text" } },
    { accessorKey: "driverInjuredStatus", header: "Driver Injured", meta: { isNumeric: false, filter: "text" } },
    { accessorKey: "helperInjuredStatus", header: "Helper Injured", meta: { isNumeric: false, filter: "text" } },
    { accessorKey: "vehicleDamagedStatus", header: "Vehicle Damaged", meta: { isNumeric: false, filter: "text" } },
    { accessorKey: "driversNic", header: "Driver's NIC", meta: { isNumeric: false, filter: "text" } },
    { accessorKey: "loss", header: "Loss", meta: { isNumeric: false, filter: "text" } },
    { accessorKey: "status", header: "Status", meta: { isNumeric: false, filter: "text" } },
    {
      id: "actions", header: "Actions", cell: ({ row }) => (
          <Menu>
            <MenuButton color={theme.purple} as={IconButton} aria-label="profile-options" fontSize="15px" icon={<IoSettingsSharp />} />
            <MenuList>
              <MenuItem>
                <Link to={`/app/EditAccidentDetails/${row.original.accidentId}`}>Edit</Link>
              </MenuItem>
              <MenuItem onClick={() => onClickDelete(row.original)}>
                {row.original.status ? "Deactivate" : "Activate"}
              </MenuItem>
                <MenuItem onClick={() => onClickMoreDetails(row.original)}>More Details</MenuItem>
              <MenuItem>
                <Link to={`/app/ViewPhotos/${row.original.accidentId}`}>View Photos</Link>
              </MenuItem>
            </MenuList>
          </Menu>
      ),
      meta: { isNumeric: false, filter: null },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: accidentDetails,
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
  const sortedData = table.getRowModel().rows.map(row => row.original);
  const currentData = sortedData.slice(startOffset, endOffset);
  const pageCount = Math.ceil(table.getFilteredRowModel().rows.length / itemsPerPage);
  const isEmpty = currentData.length === 0;
  const iconStyle = { display: "inline-block", verticalAlign: "middle", marginLeft: "3.75px" };

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

    const preview = accidentDetails.map(item => {
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

  const onClickSpecialNotes = (accident) => {
    setSpecialNotesContent(accident.specialNotes || "No special notes available.");
    setIsSpecialNotesOpen(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    doc.setFontSize(16);
    const reportTitleY = 10;
    doc.text("Accident Details Report", doc.internal.pageSize.getWidth() / 2, reportTitleY, { align: "center" });

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

    doc.save('accident_details.pdf');
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Accident Details');

    worksheet.addRow(selectedColumns.map(column => column.header));

    previewData.forEach(item => {
      worksheet.addRow(selectedColumns.map(column => item[column.accessorKey]));
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'accident_details.xlsx';
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
    link.download = 'accident_details.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const onClickDelete = (accident) => {
    setSelectedAccident(accident);
    onDialogOpen();
  };

  const onConfirmDelete = async () => {
    try {
      const endpoint = `https://localhost:7265/api/AccidentDetails/${selectedAccident.id}/${selectedAccident.isActive ? 'deactivate' : 'activate'}`;
      await axiosApi.put(endpoint);
      fetchAccidentDetails();
      onDialogClose();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast({
          title: "Error",
          description: "Unable to update accident status.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error("Error updating accident status:", error);
      }
    }
  };

  return (
      <div className="main-content">
        <PageHeader title="Accident Details" breadcrumbs={[
          { label: "Accidents", link: "/app/AccidentDetails" },
          { label: "Accident Details", link: "/app/AccidentDetails" },
        ]} />
        <Box mb="15px" mt="37.5px" display="flex" alignItems="center" gap="15px" marginBottom="7.5px">
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
          <Link to="/app/AddAccidentDetails">
            <Button
                bg={theme.purple}
                _hover={{ bg: theme.onHoverPurple }}
                color="white"
                variant="solid"
                w="200px"
                mr="50px"
            >
              Add New Accident details
            </Button>
          </Link>
        </Box>

        <Table className="custom-table" size="sm">
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
                            fontSize="0.75rem"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                              <chakra.span pl="3">
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
                currentData.map((accident, index) => {
                  const date = new Date(accident.dateTime).toLocaleDateString();
                  const time = new Date(accident.dateTime).toLocaleTimeString();

                  return (
                      <Tr key={index}>
                        <Td fontSize="0.75rem">{accident.vehicleRegistrationNo}</Td>
                        <Td fontSize="0.75rem">{date}</Td>
                        <Td fontSize="0.75rem">{time}</Td>
                        <Td fontSize="0.75rem">{accident.venue}</Td>
                        <Td fontSize="0.75rem">{accident.driverInjuredStatus ? 'Yes' : 'No'}</Td>
                        <Td fontSize="0.75rem">{accident.helperInjuredStatus ? 'Yes' : 'No'}</Td>
                        <Td fontSize="0.75rem">{accident.vehicleDamagedStatus ? 'Yes' : 'No'}</Td>
                        <Td fontSize="0.75rem">{accident.nic}</Td>
                        <Td fontSize="0.75rem">{accident.loss}</Td>
                        <Td fontSize="0.75rem">{accident.status ? 'Active' : 'Inactive'}</Td>
                        <Td fontSize="0.75rem">
                          <Menu>
                            <MenuButton
                                color={theme.purple}
                                as={IconButton}
                                aria-label="profile-options"
                                fontSize="15px"
                                icon={<IoSettingsSharp />}
                            />
                            <MenuList>
                              <MenuItem>
                                <Link to={`/app/EditAccidentDetails/${accident.accidentId}`}>Edit</Link>
                              </MenuItem>
                              <MenuItem onClick={() => onClickDelete(accident)}>
                                {accident.status ? "Deactivate" : "Activate"}
                              </MenuItem>
                              <MenuItem onClick={() => onClickSpecialNotes(accident)}>
                                Special Notes
                              </MenuItem>
                              <MenuItem>
                                <Link to={`/app/ViewPhotos/${accident.accidentId}`}>View Photos</Link>
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                  );
                })
            )}
          </Tbody>
        </Table>
        {!isEmpty && (
            <Pagination
                pageCount={pageCount}
                onPageChange={handlePageClick}
                fontSize="0.75rem"
            />
        )}

        <AlertDialog isOpen={isDialogOpen} onClose={onDialogClose} motionPreset="slideInBottom" leastDestructiveRef={cancelRef}>
          <AlertDialogOverlay />
          <AlertDialogContent position="absolute" top="30%" left="50%" transform="translate(-50%, -50%)">
            <AlertDialogHeader>{selectedAccident?.isActive ? "Deactivate" : "Activate"} Accident</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to {selectedAccident?.isActive ? "deactivate" : "activate"} this accident?
            </AlertDialogBody>
            <AlertDialogFooter>
              <div className="flex flex-row gap-8">
                <Button bg="gray.400" _hover={{ bg: "gray.500" }} color="#ffffff" variant="solid" onClick={onDialogClose} ref={cancelRef}>
                  Cancel
                </Button>
                <Button colorScheme='red' color="#FFFFFF" onClick={onConfirmDelete}>
                  {selectedAccident?.isActive ? "Deactivate" : "Activate"}
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
        </Modal>

        {/* Modal for More Details */}
        <Modal isOpen={isSpecialNotesOpen} onClose={() => setIsSpecialNotesOpen(false)} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Special Notes</ModalHeader>
            <ModalBody>
              <Text>{specialNotesContent}</Text>
            </ModalBody>
            <ModalFooter>
              <Button
                  bg={theme.purple}
                  _hover={{ bg: theme.onHoverPurple }}
                  color="white"
                  variant="solid"
                  onClick={() => setIsSpecialNotesOpen(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </div>
  );
}
