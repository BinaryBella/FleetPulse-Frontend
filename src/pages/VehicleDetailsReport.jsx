import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import { Button } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function VehicleDetailsReport() {
    const breadcrumbs = [
        { label: 'Reports', link: '/' },
        { label: 'Vehicle Reports', link: '/app/VehicleReports' },
        { label: 'Vehicle Details Report', link: '/app/VehicleDetailsReport' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const columns = [
        {
            Header: 'Reg No',
            accessor: 'regno',
        },
        {
            Header: 'Licence Exp Date',
            accessor: 'licexpdate',
        },
        {
            Header: 'Model',
            accessor: 'model',
        },
        {
            Header: 'Manufacturer',
            accessor: 'manufacturer',
        },
        {
            Header: 'Type',
            accessor: 'type',
        },
        {
            Header: 'Fuel Type',
            accessor: 'fueltype',
        },
        {
            Header: 'Color',
            accessor: 'color',
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
            regno: 'ABC123',
            licexpdate: '2024-06-01',
            model: 'Model A',
            manufacturer: 'Manufacturer X',
            type: 'Type 1',
            fueltype: 'Petrol',
            color: 'Red',
            status: 'Active',
            action: '-',
        },
        {
            regno: 'XYZ456',
            licexpdate: '2024-06-02',
            model: 'Model B',
            manufacturer: 'Manufacturer Y',
            type: 'Type 2',
            fueltype: 'Diesel',
            color: 'Blue',
            status: 'Inactive',
            action: '-',
        },
        // Add more rows as needed
        {
            regno: 'DEF789',
            licexpdate: '2024-06-03',
            model: 'Model C',
            manufacturer: 'Manufacturer Z',
            type: 'Type 3',
            fueltype: 'Electric',
            color: 'Green',
            status: 'Active',
            action: '-',
        },
        {
            regno: 'GHI012',
            licexpdate: '2024-06-04',
            model: 'Model D',
            manufacturer: 'Manufacturer X',
            type: 'Type 4',
            fueltype: 'Petrol',
            color: 'Yellow',
            status: 'Inactive',
            action: '-',
        },
        {
            regno: 'JKL345',
            licexpdate: '2024-06-05',
            model: 'Model E',
            manufacturer: 'Manufacturer Y',
            type: 'Type 5',
            fueltype: 'Diesel',
            color: 'Orange',
            status: 'Active',
            action: '-',
        },
        {
            regno: 'MNO678',
            licexpdate: '2024-06-06',
            model: 'Model F',
            manufacturer: 'Manufacturer Z',
            type: 'Type 6',
            fueltype: 'Electric',
            color: 'Purple',
            status: 'Inactive',
            action: '-',
        },
        {
            regno: 'PQR901',
            licexpdate: '2024-06-07',
            model: 'Model G',
            manufacturer: 'Manufacturer X',
            type: 'Type 7',
            fueltype: 'Petrol',
            color: 'Black',
            status: 'Active',
            action: '-',
        },
    ];

    return (
        <>
            <PageHeader title="Vehicle Details Report" breadcrumbs={breadcrumbs}/>
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
