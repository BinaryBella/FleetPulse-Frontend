import React, { useState, useEffect } from 'react';
import {axiosApi} from "../interceptor.js";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSettingsSharp, IoSearchOutline } from 'react-icons/io5';
import { TiArrowUnsorted } from 'react-icons/ti';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import theme from '../config/ThemeConfig.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Pagination from '../components/Pagination';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';

export default function HelperDetails() {
  const [helperDetails, setHelperDetails] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [selectedHelper, setSelectedHelper] = useState(null);
  const cancelRef = React.useRef();
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
    { accessorKey: 'dateOfBirth', header: 'DoB', meta: { isNumeric: false, filter: 'text' } },
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

  return (
    <>
      <PageHeader title='Helper Details' breadcrumbs={breadcrumbs} />
      <div className='flex justify-between items-center mt-8'>
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
      </div>
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
                <Td>{helper.dateOfBirth}</Td>
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
    </>
  );
}
