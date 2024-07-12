import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import { Button } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function DriverReport() {
    const breadcrumbs = [
        { label: 'Reports', link: '/' },
        { label: 'Driver Report', link: '/app/DriverReport' },
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
            Header: 'Driver Lic No',
            accessor: 'licno',
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
            firstname: 'John',
            lastname: 'Doe',
            dob: '1990-05-20',
            nic: '123456789V',
            email: 'john.doe@example.com',
            no: '1234567890',
            licno: 'DL123456',
            emcontact: 'Jane Doe (123) 456-7890',
            bloodgrp: 'O+',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Alice',
            lastname: 'Smith',
            dob: '1985-08-15',
            nic: '987654321M',
            email: 'alice.smith@example.com',
            no: '9876543210',
            licno: 'DL654321',
            emcontact: 'Bob Smith (987) 654-3210',
            bloodgrp: 'A-',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Michael',
            lastname: 'Johnson',
            dob: '1978-11-10',
            nic: '456789123C',
            email: 'michael.johnson@example.com',
            no: '4567891230',
            licno: 'DL789123',
            emcontact: 'Karen Johnson (456) 789-1230',
            bloodgrp: 'B+',
            status: 'Inactive',
            action: 'View Details',
        },
        {
            firstname: 'Sarah',
            lastname: 'Brown',
            dob: '1982-03-25',
            nic: '654321987P',
            email: 'sarah.brown@example.com',
            no: '6543219870',
            licno: 'DL987654',
            emcontact: 'David Brown (654) 321-9870',
            bloodgrp: 'AB-',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'David',
            lastname: 'Miller',
            dob: '1975-09-18',
            nic: '789654321L',
            email: 'david.miller@example.com',
            no: '7896543210',
            licno: 'DL456789',
            emcontact: 'Emily Miller (789) 654-3210',
            bloodgrp: 'A+',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Emma',
            lastname: 'Davis',
            dob: '1993-12-05',
            nic: '321987654Q',
            email: 'emma.davis@example.com',
            no: '3219876540',
            licno: 'DL369258',
            emcontact: 'Oliver Davis (321) 987-6540',
            bloodgrp: 'O-',
            status: 'Inactive',
            action: 'View Details',
        },
        // Add one more row of data
        {
            firstname: 'James',
            lastname: 'Wilson',
            dob: '1988-06-30',
            nic: '258963147E',
            email: 'james.wilson@example.com',
            no: '2589631470',
            licno: 'DL147258',
            emcontact: 'Linda Wilson (258) 963-1470',
            bloodgrp: 'B-',
            status: 'Active',
            action: 'View Details',
        },
    ];

    return (
        <>
            <PageHeader title="Driver Report" breadcrumbs={breadcrumbs} />
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
