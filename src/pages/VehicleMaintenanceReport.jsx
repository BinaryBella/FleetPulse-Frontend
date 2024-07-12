import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import {
    Button,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function VehicleMaintenanceReport() {

    const breadcrumbs = [
        {label: 'Reports', link: '/'},
        {label: 'Vehicle Reports', link: '/'},
        {label: 'Vehicle Maintenance Report', link: '/'},
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const columns = [
        {
            Header: 'Maintenance Status',
            accessor: 'maintenancestatus',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Cost',
            accessor: 'cost',
        },
        {
            Header: 'Replaced Parts',
            accessor: 'replacedparts',
        },
        {
            Header: 'Service Provider',
            accessor: 'serviceprovider',
        },
        {
            Header: 'Special Notes',
            accessor: 'specialnotes',
        },
        {
            Header: 'Action',
            accessor: 'action',
        }
    ];

    const data = [
        {
            maintenancestatus: 'Completed',
            description: 'Oil Change',
            cost: '$50',
            replacedparts: 'Oil Filter',
            serviceprovider: 'Service Center A',
            specialnotes: 'N/A',
            action: 'Action 1',
        },
        {
            maintenancestatus: 'Pending',
            description: 'Brake Replacement',
            cost: '$200',
            replacedparts: 'Brake Pads',
            serviceprovider: 'Service Center B',
            specialnotes: 'Requires urgent attention',
            action: 'Action 2',
        },
        {
            maintenancestatus: 'Completed',
            description: 'Tire Rotation',
            cost: '$30',
            replacedparts: 'N/A',
            serviceprovider: 'Service Center C',
            specialnotes: 'Regular maintenance',
            action: 'Action 3',
        },
        {
            maintenancestatus: 'Scheduled',
            description: 'Engine Tune-up',
            cost: '$100',
            replacedparts: 'Spark Plugs',
            serviceprovider: 'Service Center D',
            specialnotes: 'Next week appointment',
            action: 'Action 4',
        },
        {
            maintenancestatus: 'Completed',
            description: 'Battery Replacement',
            cost: '$150',
            replacedparts: 'Battery',
            serviceprovider: 'Service Center E',
            specialnotes: 'Highly recommended',
            action: 'Action 5',
        },
        {
            maintenancestatus: 'Pending',
            description: 'Headlight Repair',
            cost: '$80',
            replacedparts: 'Headlight Bulb',
            serviceprovider: 'Service Center F',
            specialnotes: 'Issue identified during inspection',
            action: 'Action 6',
        },
        {
            maintenancestatus: 'Scheduled',
            description: 'Transmission Flush',
            cost: '$120',
            replacedparts: 'Transmission Fluid',
            serviceprovider: 'Service Center G',
            specialnotes: 'Next month appointment',
            action: 'Action 7',
        },
    ];

    return (
        <>
            <PageHeader title="Vehicle Maintenance Report" breadcrumbs={breadcrumbs}/>
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
