// import React, { useState, useEffect } from 'react';
// import {axiosApi} from "../interceptor.js";
// import {
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Button,
//   Menu,
//   MenuButton,
//   IconButton,
//   MenuList,
//   MenuItem,
//   Input,
//   chakra,
//   InputGroup,
//   InputLeftElement,
//   Text,
//   AlertDialog,
//   AlertDialogOverlay,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogBody,
//   AlertDialogFooter,
//   useDisclosure,
//   useToast,
// } from '@chakra-ui/react';
// import { Link, useNavigate } from 'react-router-dom';
// import { IoSettingsSharp, IoSearchOutline } from 'react-icons/io5';
// import { TiArrowUnsorted } from 'react-icons/ti';
// import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
// import theme from '../config/ThemeConfig.jsx';
// import PageHeader from '../components/PageHeader.jsx';
// import Pagination from '../components/Pagination';
// import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
//
// export default function HelperDetails() {
//   const [helperDetails, setHelperDetails] = useState([]);
//   const [sorting, setSorting] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchInput, setSearchInput] = useState('');
//   const [selectedHelper, setSelectedHelper] = useState(null);
//   const cancelRef = React.useRef();
//   const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
//   const toast = useToast();
//   const navigate = useNavigate();
//   const itemsPerPage = 10;
//
//   const breadcrumbs = [
//     { label: "Helper", link: "/app/HelperDetails" },
//     { label: "Helper Details", link: "/app/HelperDetails" },
//   ];
//
//   useEffect(() => {
//     fetchHelperDetails();
//   }, []);
//
//   const fetchHelperDetails = async () => {
//     try {
//       const response = await axiosApi.get('https://localhost:7265/api/Helper');
//       setHelperDetails(response.data);
//     } catch (error) {
//       console.error('Error fetching helper details:', error);
//     }
//   };
//
//   const handleSearchInputChange = (event) => {
//     const inputValue = event.target.value.toLowerCase();
//     setSearchInput(inputValue);
//     setCurrentPage(0);
//   };
//
//   const onClickInactive = (helper) => {
//     setSelectedHelper(helper);
//     onDialogOpen();
//   };
//
//   const onConfirmInactive = async () => {
//     try {
//       const endpoint = selectedHelper.status
//         ? `https://localhost:7265/api/Helper/${selectedHelper.userId}/deactivate`
//         : `https://localhost:7265/api/Helper/${selectedHelper.userId}/activate`;
//
//       await axiosApi.put(endpoint);
//       fetchHelperDetails();
//       onDialogClose();
//       toast({
//         title: 'Success',
//         description: `Helper ${selectedHelper.status ? 'deactivated' : 'activated'} successfully.`,
//         status: 'success',
//         duration: 5000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error('Error updating helper status:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to update helper status.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };
//
//   const columns = [
//     { accessorKey: 'firstName', header: 'First Name', meta: { isNumeric: false, filter: 'text' } },
//     { accessorKey: 'lastName', header: 'Last Name', meta: { isNumeric: false, filter: 'text' } },
//     {
//       accessorKey: 'dateOfBirth',
//       header: 'DoB',
//       cell: info => {
//         const dateString = info.getValue();
//         if (dateString) {
//           const dateOnly = dateString.split('T')[0];
//           return dateOnly;
//         }
//         return '';
//       },
//       meta: { isNumeric: false, filter: 'text' }
//     },
//     { accessorKey: 'nic', header: 'NIC', meta: { isNumeric: false, filter: 'text' } },
//     { accessorKey: 'emailAddress', header: 'Email Address', meta: { isNumeric: false, filter: 'text' } },
//     { accessorKey: 'phoneNo', header: 'Phone No.', meta: { isNumeric: false, filter: 'text' } },
//     { accessorKey: 'emergencyContact', header: 'Em.Contact', meta: { isNumeric: false, filter: 'text' } },
//     { accessorKey: 'bloodGroup', header: 'Blood Group', meta: { isNumeric: false, filter: 'text' } },
//     { accessorKey: 'status', header: 'Status', cell: info => (info.getValue() ? 'Active' : 'Inactive'), meta: { isNumeric: false, filter: 'boolean' } },
//     {
//       id: 'actions',
//       header: 'Actions',
//       cell: ({ row }) => (
//         <Menu>
//           <MenuButton color={theme.purple} as={IconButton} aria-label='profile-options' fontSize='20px' icon={<IoSettingsSharp />} />
//           <MenuList>
//             <MenuItem onClick={() => navigate(`/editHelper/${row.original.userId}`)}>Edit</MenuItem>
//             <MenuItem onClick={() => onClickInactive(row.original)}>{row.original.status ? 'Deactivate' : 'Activate'}</MenuItem>
//           </MenuList>
//         </Menu>
//       ),
//       meta: { isNumeric: false, filter: null },
//       enableSorting: false,
//     },
//   ];
//
//   const table = useReactTable({
//     data: helperDetails,
//     columns,
//     state: { sorting, globalFilter: searchInput },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });
//
//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };
//
//   const startOffset = currentPage * itemsPerPage;
//   const endOffset = startOffset + itemsPerPage;
//   const sortedData = table.getRowModel().rows.map(row => row.original);
//   const currentData = sortedData.slice(startOffset, endOffset);
//   const pageCount = Math.ceil(table.getFilteredRowModel().rows.length / itemsPerPage);
//   const isEmpty = currentData.length === 0;
//
//   return (
//     <>
//       <PageHeader title='Helper Details' breadcrumbs={breadcrumbs} />
//       <div className='flex justify-between items-center mt-8'>
//         <InputGroup>
//           <InputLeftElement pointerEvents='none'>
//             <IoSearchOutline />
//           </InputLeftElement>
//           <Input
//             placeholder='Search'
//             value={searchInput}
//             onChange={handleSearchInputChange}
//             variant='filled'
//             width='300px'
//           />
//         </InputGroup>
//         <Link to='/app/AddHelperDetails'>
//           <Button
//             bg={theme.purple}
//             _hover={{ bg: theme.onHoverPurple }}
//             color='white'
//             variant='solid'
//             marginRight='50'
//           >
//             Add New Helper
//           </Button>
//         </Link>
//       </div>
//       <Table className='custom-table mt-4'>
//         <Thead>
//           <Tr>
//             {table.getHeaderGroups().map(headerGroup => (
//               <React.Fragment key={headerGroup.id}>
//                 {headerGroup.headers.map(header => (
//                   <Th key={header.id} onClick={header.column.getToggleSortingHandler()} isNumeric={header.column.columnDef.meta?.isNumeric} className='custom-table-th'>
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                     <chakra.span pl='4'>
//                       {header.column.getIsSorted() ? (
//                         header.column.getIsSorted() === 'desc' ? (
//                           <TriangleDownIcon aria-label='sorted descending' />
//                         ) : (
//                           <TriangleUpIcon aria-label='sorted ascending' />
//                         )
//                       ) : (
//                         <TiArrowUnsorted aria-label='unsorted' />
//                       )}
//                     </chakra.span>
//                   </Th>
//                 ))}
//               </React.Fragment>
//             ))}
//           </Tr>
//         </Thead>
//         <Tbody>
//           {isEmpty ? (
//             <Tr>
//               <Td colSpan={columns.length} textAlign='center'>
//                 <Text>No results found for {searchInput}</Text>
//               </Td>
//             </Tr>
//           ) : (
//             currentData.map((helper, index) => (
//               <Tr key={index}>
//                 <Td>{helper.firstName}</Td>
//                 <Td>{helper.lastName}</Td>
//                 <Td>{helper.dateOfBirth ? helper.dateOfBirth.split('T')[0] : ''}</Td>
//                 <Td>{helper.nic}</Td>
//                 <Td>{helper.emailAddress}</Td>
//                 <Td>{helper.phoneNo}</Td>
//                 <Td>{helper.emergencyContact}</Td>
//                 <Td>{helper.bloodGroup}</Td>
//                 <Td>{helper.status ? 'Active' : 'Inactive'}</Td>
//                 <Td>
//                   <Menu>
//                     <MenuButton as={IconButton} aria-label='options' icon={<IoSettingsSharp />} />
//                     <MenuList>
//                       <MenuItem onClick={() => navigate(`/app/EditHelperDetails/${helper.userId}`)}>Edit</MenuItem>
//                       <MenuItem>
//                         <Link to={`/app/ResetPasswordDriverHelper?username=${helper.userName}`}>Reset Password</Link>
//                       </MenuItem>
//                       <MenuItem onClick={() => onClickInactive(helper)}>{helper.status ? 'Deactivate' : 'Activate'}</MenuItem>
//                     </MenuList>
//                   </Menu>
//                 </Td>
//               </Tr>
//             ))
//           )}
//         </Tbody>
//       </Table>
//       <Pagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
//       <AlertDialog isOpen={isDialogOpen} leastDestructiveRef={cancelRef} onClose={onDialogClose}>
//         <AlertDialogOverlay>
//           <AlertDialogContent>
//             <AlertDialogHeader>Change Helper Status</AlertDialogHeader>
//             <AlertDialogBody>
//               Are you sure you want to {selectedHelper?.status ? 'deactivate' : 'activate'} this helper?
//             </AlertDialogBody>
//             <AlertDialogFooter>
//               <Button ref={cancelRef} onClick={onDialogClose}>
//                 Cancel
//               </Button>
//               <Button colorScheme='red' onClick={onConfirmInactive} ml={3}>
//                 Yes
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import { axiosApi } from "../interceptor.js";
import {
  Table, Thead, Tbody, Tr, Th, Td, Button,
  Menu, MenuButton, IconButton, MenuList, MenuItem,
  Input, chakra, InputGroup, InputLeftElement,
  Text, AlertDialog, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogBody,
  AlertDialogFooter, useDisclosure, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Checkbox, Stack, Box
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsSharp, IoSearchOutline } from 'react-icons/io5';
import { TiArrowUnsorted } from 'react-icons/ti';
import {ChevronDownIcon, TriangleDownIcon, TriangleUpIcon} from '@chakra-ui/icons';
import theme from '../config/ThemeConfig.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Pagination from '../components/Pagination';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';

export default function HelperDetails() {
  const [helperDetails, setHelperDetails] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);

  const cancelRef = useRef();
  const { isOpen: isDialogOpen, onOpen: onDialogOpen, onClose: onDialogClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const breadcrumbs = [
    { label: "Helper", link: "/app/HelperDetails" },
    { label: "Helper Details", link: "/app/HelperDetails" },
  ];

  useEffect(() => {
    fetchHelperDetails();
  }, []);

  const fetchHelperDetails = async () => {
    try {
      const response = await axiosApi.get('https://localhost:7265/api/Helper');
      setHelperDetails(response.data);
    } catch (error) {
      console.error('Error fetching helper details:', error);
    }
  };

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setSearchInput(inputValue);
    setCurrentPage(0);
  };

  const onClickInactive = (helper) => {
    setSelectedHelper(helper);
    onDialogOpen();
  };

  const onConfirmInactive = async () => {
    try {
      const endpoint = selectedHelper.status
          ? `https://localhost:7265/api/Helper/${selectedHelper.userId}/deactivate`
          : `https://localhost:7265/api/Helper/${selectedHelper.userId}/activate`;

      await axiosApi.put(endpoint);
      fetchHelperDetails();
      onDialogClose();
      toast({
        title: 'Success',
        description: `Helper ${selectedHelper.status ? 'deactivated' : 'activated'} successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating helper status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update helper status.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const columns = [
    { accessorKey: 'firstName', header: 'First Name', meta: { isNumeric: false, filter: 'text' } },
    { accessorKey: 'lastName', header: 'Last Name', meta: { isNumeric: false, filter: 'text' } },
    {
      accessorKey: 'dateOfBirth',
      header: 'DoB',
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
    { accessorKey: 'nic', header: 'NIC', meta: { isNumeric: false, filter: 'text' } },
    { accessorKey: 'emailAddress', header: 'Email Address', meta: { isNumeric: false, filter: 'text' } },
    { accessorKey: 'phoneNo', header: 'Phone No.', meta: { isNumeric: false, filter: 'text' } },
    { accessorKey: 'emergencyContact', header: 'Em.Contact', meta: { isNumeric: false, filter: 'text' } },
    { accessorKey: 'bloodGroup', header: 'Blood Group', meta: { isNumeric: false, filter: 'text' } },
    { accessorKey: 'status', header: 'Status', cell: info => (info.getValue() ? 'Active' : 'Inactive'), meta: { isNumeric: false, filter: 'boolean' } },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
          <Menu>
            <MenuButton color={theme.purple} as={IconButton} aria-label='profile-options' fontSize='20px' icon={<IoSettingsSharp />} />
            <MenuList>
              <MenuItem onClick={() => navigate(`/editHelper/${row.original.userId}`)}>Edit</MenuItem>
              <MenuItem onClick={() => onClickInactive(row.original)}>{row.original.status ? 'Deactivate' : 'Activate'}</MenuItem>
            </MenuList>
          </Menu>
      ),
      meta: { isNumeric: false, filter: null },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: helperDetails,
    columns,
    state: { sorting, globalFilter: searchInput },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const startOffset = currentPage * itemsPerPage;
  const endOffset = startOffset + itemsPerPage;
  const sortedData = table.getRowModel().rows.map(row => row.original);
  const currentData = sortedData.slice(startOffset, endOffset);
  const pageCount = Math.ceil(table.getFilteredRowModel().rows.length / itemsPerPage);
  const isEmpty = currentData.length === 0;

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

    const preview = helperDetails.map(item =>
        Object.fromEntries(
            selected.map(col => [col.accessorKey, item[col.accessorKey]])
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    doc.setFontSize(16);
    const reportTitleY = 10;
    doc.text("Helper Details Report", doc.internal.pageSize.getWidth() / 2, reportTitleY, { align: "center" });

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

    doc.save('helper_details.pdf');
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Helper Details');

    worksheet.addRow(selectedColumns.map(column => column.header));

    previewData.forEach(item => {
      worksheet.addRow(selectedColumns.map(column => item[column.accessorKey]));
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'helper_details.xlsx';
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

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'helper_details.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
      <>
        <PageHeader title='Helper Details' breadcrumbs={breadcrumbs} />
          <Box mb="20px" mt="50px" display="flex" alignItems="center" gap="20px" marginTop="60px" marginBottom="10px">
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <IoSearchOutline />
            </InputLeftElement>
            <Input
                placeholder='Search'
                value={searchInput}
                onChange={handleSearchInputChange}
                variant='filled'
                width='300px'
            />
          </InputGroup>
          <Button
              bg={theme.purple}
              _hover={{ bg: theme.onHoverPurple }}
              color='white'
              variant='solid'
              width='250px'
              onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
          <Link to='/app/AddHelperDetails'>
            <Button
                bg={theme.purple}
                _hover={{ bg: theme.onHoverPurple }}
                color='white'
                variant='solid'
                marginRight='50'
            >
              Add New Helper
            </Button>
          </Link>
          </Box>

        <Table className='custom-table mt-4'>
          <Thead>
            <Tr>
              {table.getHeaderGroups().map(headerGroup => (
                  <React.Fragment key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <Th key={header.id} onClick={header.column.getToggleSortingHandler()} isNumeric={header.column.columnDef.meta?.isNumeric} className='custom-table-th'>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <chakra.span pl='4'>
                            {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === 'desc' ? (
                                    <TriangleDownIcon aria-label='sorted descending' />
                                ) : (
                                    <TriangleUpIcon aria-label='sorted ascending' />
                                )
                            ) : (
                                <TiArrowUnsorted aria-label='unsorted' />
                            )}
                          </chakra.span>
                        </Th>
                    ))}
                  </React.Fragment>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isEmpty ? (
                <Tr>
                  <Td colSpan={columns.length} textAlign='center'>
                    <Text>No results found for {searchInput}</Text>
                  </Td>
                </Tr>
            ) : (
                currentData.map((helper, index) => (
                    <Tr key={index}>
                      <Td>{helper.firstName}</Td>
                      <Td>{helper.lastName}</Td>
                      <Td>{helper.dateOfBirth ? helper.dateOfBirth.split('T')[0] : ''}</Td>
                      <Td>{helper.nic}</Td>
                      <Td>{helper.emailAddress}</Td>
                      <Td>{helper.phoneNo}</Td>
                      <Td>{helper.emergencyContact}</Td>
                      <Td>{helper.bloodGroup}</Td>
                      <Td>{helper.status ? 'Active' : 'Inactive'}</Td>
                      <Td>
                        <Menu>
                          <MenuButton as={IconButton} aria-label='options' icon={<IoSettingsSharp />} />
                          <MenuList>
                            <MenuItem onClick={() => navigate(`/app/EditHelperDetails/${helper.userId}`)}>Edit</MenuItem>
                            <MenuItem>
                              <Link to={`/app/ResetPasswordDriverHelper?username=${helper.userName}`}>Reset Password</Link>
                            </MenuItem>
                            <MenuItem onClick={() => onClickInactive(helper)}>{helper.status ? 'Deactivate' : 'Activate'}</MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                ))
            )}
          </Tbody>
        </Table>
        <Pagination pageCount={pageCount} onPageChange={handlePageClick} currentPage={currentPage} />
        <AlertDialog isOpen={isDialogOpen} leastDestructiveRef={cancelRef} onClose={onDialogClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Change Helper Status</AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to {selectedHelper?.status ? 'deactivate' : 'activate'} this helper?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDialogClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={onConfirmInactive} ml={3}>
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
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
      </>
  );
}
