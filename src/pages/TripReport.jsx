import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import { Button } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function TripReport() {
    const breadcrumbs = [
        { label: 'Reports', link: '/' },
        { label: 'Trip Report', link: '/app/TripReport' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const columns = [
        {
            Header: 'Driver NIC',
            accessor: 'drivernic',
        },
        {
            Header: 'Helper NIC',
            accessor: 'helpernic',
        },
        {
            Header: 'Vehicle Reg.No',
            accessor: 'vehicleregno',
        },
        {
            Header: 'Date',
            accessor: 'date',
        },
        {
            Header: 'Start Time',
            accessor: 'starttime',
        },
        {
            Header: 'End Time',
            accessor: 'endtime',
        },
        {
            Header: 'Start Location',
            accessor: 'startlocation',
        },
        {
            Header: 'End Location',
            accessor: 'endlocation',
        }
    ];

    const data = [
        {
            drivernic: '123456789V',
            helpernic: '987654321M',
            vehicleregno: 'ABC123',
            date: '2024-05-01',
            starttime: '08:00 AM',
            endtime: '04:00 PM',
            startlocation: 'City A',
            endlocation: 'City B',
        },
        {
            drivernic: '987654321M',
            helpernic: '456789123C',
            vehicleregno: 'XYZ456',
            date: '2024-05-02',
            starttime: '09:00 AM',
            endtime: '05:00 PM',
            startlocation: 'City B',
            endlocation: 'City C',
        },
        // Add more rows as needed
        {
            drivernic: '456789123C',
            helpernic: '258963147E',
            vehicleregno: 'DEF789',
            date: '2024-05-03',
            starttime: '10:00 AM',
            endtime: '06:00 PM',
            startlocation: 'City C',
            endlocation: 'City D',
        },
        {
            drivernic: '258963147E',
            helpernic: '123456789V',
            vehicleregno: 'GHI012',
            date: '2024-05-04',
            starttime: '11:00 AM',
            endtime: '07:00 PM',
            startlocation: 'City D',
            endlocation: 'City E',
        },
        {
            drivernic: '123456789V',
            helpernic: '987654321M',
            vehicleregno: 'JKL345',
            date: '2024-05-05',
            starttime: '12:00 PM',
            endtime: '08:00 PM',
            startlocation: 'City E',
            endlocation: 'City F',
        },
        {
            drivernic: '987654321M',
            helpernic: '456789123C',
            vehicleregno: 'MNO678',
            date: '2024-05-06',
            starttime: '01:00 PM',
            endtime: '09:00 PM',
            startlocation: 'City F',
            endlocation: 'City G',
        },
        {
            drivernic: '456789123C',
            helpernic: '258963147E',
            vehicleregno: 'PQR901',
            date: '2024-05-07',
            starttime: '02:00 PM',
            endtime: '10:00 PM',
            startlocation: 'City G',
            endlocation: 'City H',
        },
    ];

    return (
        <>
            <PageHeader title="Trip Report" breadcrumbs={breadcrumbs} />
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
