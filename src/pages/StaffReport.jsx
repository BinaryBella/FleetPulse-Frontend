import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import { Button } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function StaffReport() {
    const breadcrumbs = [
        { label: 'Reports', link: '/' },
        { label: 'Staff Report', link: '/app/StaffReport' },
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
            Header: 'Job Title',
            accessor: 'jobtitle',
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
            dob: '1980-01-15',
            nic: '123456789V',
            email: 'john.doe@example.com',
            no: '1234567890',
            emcontact: 'Jane Doe (123) 456-7890',
            jobtitle: 'Manager',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Alice',
            lastname: 'Smith',
            dob: '1985-05-20',
            nic: '987654321M',
            email: 'alice.smith@example.com',
            no: '9876543210',
            emcontact: 'Bob Smith (987) 654-3210',
            jobtitle: 'Assistant Manager',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Emma',
            lastname: 'Johnson',
            dob: '1978-11-12',
            nic: '456789123C',
            email: 'emma.johnson@example.com',
            no: '4567891230',
            emcontact: 'Michael Johnson (456) 789-1230',
            jobtitle: 'Supervisor',
            status: 'Inactive',
            action: 'View Details',
        },
        {
            firstname: 'Michael',
            lastname: 'Brown',
            dob: '1982-09-25',
            nic: '654321987P',
            email: 'michael.brown@example.com',
            no: '6543219870',
            emcontact: 'Olivia Brown (654) 321-9870',
            jobtitle: 'Clerk',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'Sarah',
            lastname: 'Wilson',
            dob: '1975-04-18',
            nic: '789654321L',
            email: 'sarah.wilson@example.com',
            no: '7896543210',
            emcontact: 'Noah Wilson (789) 654-3210',
            jobtitle: 'Receptionist',
            status: 'Active',
            action: 'View Details',
        },
        {
            firstname: 'David',
            lastname: 'Martinez',
            dob: '1993-12-05',
            nic: '321987654Q',
            email: 'david.martinez@example.com',
            no: '3219876540',
            emcontact: 'Ava Martinez (321) 987-6540',
            jobtitle: 'Security Guard',
            status: 'Inactive',
            action: 'View Details',
        },
        {
            firstname: 'Sophia',
            lastname: 'Garcia',
            dob: '1988-06-30',
            nic: '258963147E',
            email: 'sophia.garcia@example.com',
            no: '2589631470',
            emcontact: 'Liam Garcia (258) 963-1470',
            jobtitle: 'Janitor',
            status: 'Active',
            action: 'View Details',
        },
    ];

    return (
        <>
            <PageHeader title="Staff Report" breadcrumbs={breadcrumbs} />
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
