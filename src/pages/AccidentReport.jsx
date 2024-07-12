import React from "react";
import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import { Button } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function AccidentReport() {
    const breadcrumbs = [
        { label: 'Reports', link: '/' },
        { label: 'Accident Report', link: '/app/AccidentReport' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const columns = [
        {
            Header: 'Driver Injured',
            accessor: 'driverinjured',
        },
        {
            Header: 'Date & Time',
            accessor: 'datetime',
        },
        {
            Header: 'Venue',
            accessor: 'venue',
        },
        {
            Header: 'Helper Injured',
            accessor: 'helperinjured',
        },
        {
            Header: 'Vehicle Damaged',
            accessor: 'vehicledamaged',
        },
        {
            Header: 'Loss',
            accessor: 'loss',
        },
        {
            Header: 'Special Note',
            accessor: 'specialnote',
        },
        {
            Header: 'Photos',
            accessor: 'photos',
        },
        {
            Header: 'Action',
            accessor: 'action',
        }
    ];

    const data = [
        {
            driverinjured: 'Yes',
            datetime: '2024-05-10 14:30',
            venue: 'Main Street',
            helperinjured: 'No',
            vehicledamaged: 'Yes',
            loss: '$2000',
            specialnote: 'Minor scratches on the door',
            photos: 'View Photos',
            action: 'Review',
        },
        {
            driverinjured: 'No',
            datetime: '2024-04-22 08:15',
            venue: 'Highway 21',
            helperinjured: 'Yes',
            vehicledamaged: 'No',
            loss: '$500',
            specialnote: 'Helper injured his arm',
            photos: 'View Photos',
            action: 'Review',
        },
        // Add 5 additional rows of data
        {
            driverinjured: 'Yes',
            datetime: '2024-06-05 12:45',
            venue: 'City Avenue',
            helperinjured: 'Yes',
            vehicledamaged: 'Yes',
            loss: '$3000',
            specialnote: 'Both driver and helper injured, significant vehicle damage',
            photos: 'View Photos',
            action: 'Review',
        },
        {
            driverinjured: 'Yes',
            datetime: '2024-06-15 09:30',
            venue: 'Rural Road',
            helperinjured: 'No',
            vehicledamaged: 'No',
            loss: '$100',
            specialnote: 'Minor injury to the driver, no vehicle damage',
            photos: 'View Photos',
            action: 'Review',
        },
        {
            driverinjured: 'No',
            datetime: '2024-07-02 17:00',
            venue: 'Parking Lot',
            helperinjured: 'No',
            vehicledamaged: 'Yes',
            loss: '$1500',
            specialnote: 'Vehicle collision with a stationary object',
            photos: 'View Photos',
            action: 'Review',
        },
        {
            driverinjured: 'No',
            datetime: '2024-07-18 10:20',
            venue: 'Intersection',
            helperinjured: 'Yes',
            vehicledamaged: 'Yes',
            loss: '$2500',
            specialnote: 'Helper injured, moderate vehicle damage',
            photos: 'View Photos',
            action: 'Review',
        },
        {
            driverinjured: 'Yes',
            datetime: '2024-08-05 14:10',
            venue: 'Highway 7',
            helperinjured: 'Yes',
            vehicledamaged: 'Yes',
            loss: '$5000',
            specialnote: 'Serious accident, both driver and helper injured, major vehicle damage',
            photos: 'View Photos',
            action: 'Review',
        },
    ];

    return (
        <>
            <PageHeader title="Accident Report" breadcrumbs={breadcrumbs} />
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    {/* Date Picker */}
                    <div>
                        <DatePicker />
                    </div>

                    {/* Generate and Print Buttons */}
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
