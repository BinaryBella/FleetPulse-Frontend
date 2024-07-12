import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import { Button } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function HelperReport() {
    const breadcrumbs = [
        { label: 'Reports', link: '/' },
        { label: 'Helper Report', link: '/app/HelperReport' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const columns = [
        {
            Header: 'First Name',
            accessor: 'firstname',
        },
        {
            Header: 'Last Name',
            accessor: 'lastname',
        },
        {
            Header: 'DOB',
            accessor: 'dob',
        },
        {
            Header: 'NIC',
            accessor: 'nic',
        },
        {
            Header: 'Email Address',
            accessor: 'email',
        },
        {
            Header: 'Phone No',
            accessor: 'no',
        },
        {
            Header: 'Emergency Contact',
            accessor: 'emcontact',
        },
        {
            Header: 'Blood Group',
            accessor: 'bloodgrp',
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
        {
            Header: 'Action',
            accessor: 'action',
        }
    ];

    const data = [
        {
            firstname: 'Emily',
            lastname: 'Smith',
            dob: '1990-03-15',
            nic: '123456789V',
            email: 'emily.smith@example.com',
            no: '1234567890',
            emcontact: 'John Smith (123) 456-7890',
            bloodgrp: 'O+',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'James',
            lastname: 'Johnson',
            dob: '1985-08-25',
            nic: '987654321M',
            email: 'james.johnson@example.com',
            no: '9876543210',
            emcontact: 'Alice Johnson (987) 654-3210',
            bloodgrp: 'A-',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Sophia',
            lastname: 'Williams',
            dob: '1978-11-12',
            nic: '456789123C',
            email: 'sophia.williams@example.com',
            no: '4567891230',
            emcontact: 'Michael Williams (456) 789-1230',
            bloodgrp: 'B+',
            status: 'Inactive',
            action: 'View Details',
        },
        {
            firstname: 'Olivia',
            lastname: 'Brown',
            dob: '1982-04-25',
            nic: '654321987P',
            email: 'olivia.brown@example.com',
            no: '6543219870',
            emcontact: 'David Brown (654) 321-9870',
            bloodgrp: 'AB-',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Liam',
            lastname: 'Davis',
            dob: '1975-10-18',
            nic: '789654321L',
            email: 'liam.davis@example.com',
            no: '7896543210',
            emcontact: 'Emma Davis (789) 654-3210',
            bloodgrp: 'A+',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Ava',
            lastname: 'Miller',
            dob: '1993-12-05',
            nic: '321987654Q',
            email: 'ava.miller@example.com',
            no: '3219876540',
            emcontact: 'James Miller (321) 987-6540',
            bloodgrp: 'O-',
            status: 'Inactive',
            action: 'View Details',
        },
        {
            firstname: 'Noah',
            lastname: 'Wilson',
            dob: '1988-06-30',
            nic: '258963147E',
            email: 'noah.wilson@example.com',
            no: '2589631470',
            emcontact: 'Sarah Wilson (258) 963-1470',
            bloodgrp: 'B-',
            status: 'Active',
            action: 'View Details',
        },
    ];

    return (
        <>
            <PageHeader title="Helper Report" breadcrumbs={breadcrumbs} />
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <div>
                        <DatePicker />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginRight: '70px' }}>
                        <Button
                            bg={theme.purple}
                            _hover={{ bg: theme.onHoverPurple }}
                            color="#ffffff"
                            variant="solid"
                            w="230px"
                            marginTop="8"
                            onClick={handleSubmit}
                        >
                            Generate
                        </Button>
                        <Button
                            bg={theme.purple}
                            _hover={{ bg: theme.onHoverPurple }}
                            color="#ffffff"
                            variant="solid"
                            w="230px"
                            marginTop="8"
                            onClick={handleSubmit}
                        >
                            Print
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                <MyTable columns={columns} data={data} />
            </div>
        </>
    );
}
