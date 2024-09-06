import { useState, useEffect, useRef } from "react";
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  Stack,
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
import { axiosApi } from "../interceptor.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcelJS from "exceljs";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

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
  const [accidentPhotos, setAccidentPhotos] = useState([]);


  const cancelRef = useRef();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const {
    isOpen: isPhotoDialogOpen,
    onOpen: onPhotoDialogOpen,
    onClose: onPhotoDialogClose,
  } = useDisclosure();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAccidentDetails();
  }, []);

  const fetchAccidentDetails = async () => {
    try {
      const response = await axiosApi.get(
          "https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Accidents"
      );
      setAccidentDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching accident details:", error);
    }
  };


  const columns = [
    {
      accessorKey: "vehicleRegistrationNo",
      header: "Vehicle Reg No",
      meta: { isNumeric: false, filter: "text" },
    },
    {
      accessorKey: "dateTime", // Original accessor
      header: "Date",
      meta: { isNumeric: false, filter: "text" },
      cell: ({ row }) => {
        const date = new Date(row.original.dateTime).toLocaleDateString();
        return date;
      },
    },
    {
      accessorKey: "dateTime", // Reuse the original accessor
      header: "Time",
      meta: { isNumeric: false, filter: "text" },
      cell: ({ row }) => {
        const time = new Date(row.original.dateTime).toLocaleTimeString();
        return time;
      },
    },
    {
      accessorKey: "venue",
      header: "Venue",
      meta: { isNumeric: false, filter: "text" },
    },
    {
      accessorKey: "driverInjuredStatus",
      header: "Driver Injured",
      meta: { isNumeric: false, filter: "text" },
    },
    {
      accessorKey: "helperInjuredStatus",
      header: "Helper Injured",
      meta: { isNumeric: false, filter: "text" },
    },
    {
      accessorKey: "vehicleDamagedStatus",
      header: "Vehicle Damaged",
      meta: { isNumeric: false, filter: "text" },
    },
    {
      accessorKey: "nic",
      header: "Driver's NIC",
      meta: { isNumeric: false, filter: "text" },
    },
    {
      accessorKey: "loss",
      header: "Loss",
      meta: { isNumeric: false, filter: "text" },
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: { isNumeric: false, filter: "text" },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
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
                <Link to={`/app/EditAccidentDetails/${row.original.accidentId}`}>
                  Edit
                </Link>
              </MenuItem>
              <MenuItem onClick={() => onClickDelete(row.original)}>
                {row.original.status ? "Deactivate" : "Activate"}
              </MenuItem>
              <MenuItem onClick={() => onClickMoreDetails(row.original)}>
                More Details
              </MenuItem>
              <MenuItem>
                <Link to={`/app/ViewPhotos/${row.original.accidentId}`}>
                  View Photos
                </Link>
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
  const sortedData = table.getRowModel().rows.map((row) => row.original);
  const currentData = sortedData.slice(startOffset, endOffset);
  const pageCount = Math.ceil(
      table.getFilteredRowModel().rows.length / itemsPerPage
  );
  const isEmpty = currentData.length === 0;
  const iconStyle = {
    display: "inline-block",
    verticalAlign: "middle",
    marginLeft: "3.75px",
  };




  const handleGenerateReport = () => {
    setIsColumnSelectionOpen(true);
  };

  const renderCellContent = (columnKey, value) => {
    if (columnKey === 'driverInjuredStatus' || columnKey === 'helperInjuredStatus' || columnKey === 'vehicleDamagedStatus') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  const handleColumnSelection = () => {
    const selected = columns.filter(
        (col) => selectedColumns.includes(col.accessorKey) || col.id === "actions"
    );
    setSelectedColumns(selected);
  };

  const handlePreview = () => {
    const selected = columns.filter(
        (col) =>
            selectedColumns.includes(col.accessorKey) &&
            col.accessorKey !== "actions"
    );
    setSelectedColumns(selected);

    const preview = accidentDetails.map((item) => {
      let previewItem = {};
      selected.forEach((col) => {
        if (col.accessorKey === "status") {
          previewItem[col.accessorKey] = item[col.accessorKey]
              ? "Active"
              : "Inactive";
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
    setSelectedColumns((prev) =>
        prev.includes(accessorKey)
            ? prev.filter((col) => col !== accessorKey)
            : [...prev, accessorKey]
    );
  };

  const onClickSpecialNotes = (accident) => {
    setSpecialNotesContent(
        accident.specialNotes || "No special notes available."
    );
    setIsSpecialNotesOpen(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    doc.setFontSize(16);
    const reportTitleY = 10;
    doc.text(
        "Accident Details Report",
        doc.internal.pageSize.getWidth() / 2,
        reportTitleY,
        { align: "center" }
    );

    doc.setFontSize(10);
    const creationDateY = reportTitleY + 10;
    doc.text(`Report created on: ${formattedDate}`, 20, creationDateY);

    doc.autoTable({
      startY: creationDateY + 10,
      head: [selectedColumns.map((column) => column.header)],
      body: previewData.map((item) =>
          selectedColumns.map((column) => {
            if (column.accessorKey === "dateTime") {
              const date = new Date(item[column.accessorKey]).toLocaleDateString();
              const time = new Date(item[column.accessorKey]).toLocaleTimeString();
              return `${date} ${time}`;
            }
            return item[column.accessorKey];
          })
      ),
    });

    doc.save("accident_details.pdf");
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Accident Details");

    worksheet.addRow(selectedColumns.map((column) => column.header));

    previewData.forEach((item) => {
      worksheet.addRow(
          selectedColumns.map((column) => item[column.accessorKey])
      );
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "accident_details.xlsx";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToCSV = () => {
    const csvContent = [
      selectedColumns.map((column) => column.header).join(","),
      ...previewData.map((item) =>
          selectedColumns.map((column) => item[column.accessorKey]).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "accident_details.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const onClickDelete = (accident) => {
    setSelectedAccident(accident);
    onDialogOpen();
  };

  const onViewPhotos = async (accident) => {
    try {
      const response = await axiosApi.get(`https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/accidents/photos/${accident.accidentId}`);
      if (response.data && response.data.data) {
        const base64Photos = response.data.data.map(byteArray => {
          console.log(byteArray);
          return `data:image/jpeg;base64,${byteArray.photo}`;
        });
        console.log(base64Photos);

        setAccidentPhotos(base64Photos);
        onPhotoDialogOpen();
      } else {
        console.error('No photos received from the API');
        setAccidentPhotos([]);
      }
    } catch (error) {
      console.error('Error fetching accident photos:', error);
      setAccidentPhotos([]);
    }
  };

  const onConfirmDelete = async () => {
    try {
      if (!selectedAccident || !selectedAccident.accidentId) {
        console.error("Selected accident or its ID is undefined.");
        return;
      }

      const endpoint = `https://fleetpulsebackenddevelopment20240904063639.azurewebsites.net/api/Accidents/${
          selectedAccident.accidentId
      }/${selectedAccident.status ? "deactivate" : "activate"}`;

      const response = await axiosApi.put(endpoint, null, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 204) {
        fetchAccidentDetails();
        onDialogClose();
      } else {
        console.error("Failed to update accident status");
      }
    } catch (error) {
      console.error("Error updating accident status:", error);
    }
  };

  return (
      <div className="main-content">
        <PageHeader
            title="Accident Details"
            breadcrumbs={[
              { label: "Accident", link: "/app/AccidentDetails" },
              { label: "Accident Details", link: "/app/AccidentDetails" },
            ]}
        />
        <Box
            mb="15px"
            mt="37.5px"
            display="flex"
            alignItems="center"
            gap="15px"
            marginBottom="7.5px"
        >
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
              Add New Accident
            </Button>
          </Link>
        </Box>

        <Table className="custom-table" size="sm">
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
                            fontSize="0.75rem"
                        >
                          {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                          )}
                          {header.column.getCanSort() && (
                              <chakra.span pl="3">
                                {header.column.getIsSorted() ? (
                                    header.column.getIsSorted() === "desc" ? (
                                        <TriangleDownIcon
                                            aria-label="sorted descending"
                                            style={iconStyle}
                                        />
                                    ) : (
                                        <TriangleUpIcon
                                            aria-label="sorted ascending"
                                            style={iconStyle}
                                        />
                                    )
                                ) : (
                                    <TiArrowUnsorted
                                        aria-label="unsorted"
                                        style={iconStyle}
                                    />
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
                        <Td fontSize="0.75rem">
                          {accident.driverInjuredStatus ? "Yes" : "No"}
                        </Td>
                        <Td fontSize="0.75rem">
                          {accident.helperInjuredStatus ? "Yes" : "No"}
                        </Td>
                        <Td fontSize="0.75rem">
                          {accident.vehicleDamagedStatus ? "Yes" : "No"}
                        </Td>
                        <Td fontSize="0.75rem">{accident.nic}</Td>
                        <Td fontSize="0.75rem">{accident.loss}</Td>
                        <Td fontSize="0.75rem">
                          {accident.status ? "Active" : "Inactive"}
                        </Td>
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
                                <Link
                                    to={`/app/EditAccidentDetails/${accident.accidentId}`}
                                >
                                  Edit
                                </Link>
                              </MenuItem>
                              <MenuItem onClick={() => onClickDelete(accident)}>
                                {accident.status ? "Deactivate" : "Activate"}
                              </MenuItem>
                              <MenuItem onClick={() => onClickSpecialNotes(accident)}>
                                Special Notes
                              </MenuItem>
                              <MenuItem onClick={() => onViewPhotos(accident)}>
                                View Photos
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

        {isDialogOpen && <AlertDialog
            isOpen={isDialogOpen}
            onClose={onDialogClose}
            leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent
                position="absolute"
                top="30%"
                left="35%"
                transform="translate(-50%, -50%)"
            >
              <AlertDialogHeader>
                {selectedAccident?.status ? "Deactivate" : "Activate"} Vehicle
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to{" "}
                {selectedAccident?.status ? "deactivate" : "activate"} this
                accident?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDialogClose}>
                  Cancel
                </Button>
                <Button
                    colorScheme={selectedAccident?.status ? "red" : "red"}
                    onClick={onConfirmDelete}
                    ml={3}
                >
                  {selectedAccident?.status ? "Deactivate" : "Activate"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>}

        {isColumnSelectionOpen && <Modal
            isOpen={isColumnSelectionOpen}
            onClose={() => setIsColumnSelectionOpen(false)}
            isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select Columns for Report</ModalHeader>
            <ModalBody>
              <Stack spacing={3}>
                {columns.map(
                    (column) =>
                        column.id !== "actions" && (
                            <Checkbox
                                key={column.accessorKey}
                                isChecked={selectedColumns.includes(column.accessorKey)}
                                onChange={() => handleCheckboxChange(column.accessorKey)}
                            >
                              {column.header}
                            </Checkbox>
                        )
                )}
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
              <Button ml={3} onClick={() => setIsColumnSelectionOpen(false)}>
                Cancel
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
                        <Th key={column.accessorKey}>{column.header}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {previewData.map((item, index) => (
                      <Tr key={index}>
                        {selectedColumns.map((column) => {
                          console.log(item[column.accessorKey]); // Debugging
                          return (
                              <Td key={column.accessorKey}>
                                {renderCellContent(column.accessorKey, item[column.accessorKey])}
                              </Td>
                          );
                        })}

                      </Tr>
                  ))}
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
              <Button ml={3} onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>}

        {isSpecialNotesOpen && <Modal
            isOpen={isSpecialNotesOpen}
            onClose={() => setIsSpecialNotesOpen(false)}
            isCentered
        >
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
        </Modal>}

        {isPhotoDialogOpen && <Modal
            closeOnOverlayClick={false}
            isOpen={isPhotoDialogOpen}
            onClose={onPhotoDialogClose}
            isCentered={true}
            size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Accident Photos</ModalHeader>
            <ModalBody pb={6}>
              <PhotoProvider>
                <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                  {accidentPhotos.map((photo, index) => (
                      <PhotoView key={index} src={photo}>
                        <img
                            src={photo}
                            alt={`Accident photo ${index + 1}`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
                        />
                      </PhotoView>
                  ))}
                </Box>
              </PhotoProvider>
              {accidentPhotos.length === 0 && <p>No photos available for this accident.</p>}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onPhotoDialogClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>}
      </div>
  );
}
