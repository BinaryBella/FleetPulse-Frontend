import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import {
    Button,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function VehicleMaintenanceTypeReport() {

    const breadcrumbs = [
        {label: 'Reports', link: '/'},
        {label: 'Vehicle Reports', link: '/'},
        {label: 'Vehicle Maintenance Type Report', link: '/'},
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const columns = [
        {
            Header: 'Maintenance Type',
            accessor: 'maintenancetype',
        },
        {
            Header: 'Action',
            accessor: 'action',
        }
    ];

    const data = [
        {
            maintenancetype: 'Oil Change',
            action: 'Action 1',
        },
        {
            maintenancetype: 'Brake Replacement',
            action: 'Action 2',
        },
        {
            maintenancetype: 'Tire Rotation',
            action: 'Action 3',
        },
        {
            maintenancetype: 'Engine Tune-up',
            action: 'Action 4',
        },
        {
            maintenancetype: 'Battery Replacement',
            action: 'Action 5',
        },
        {
            maintenancetype: 'Headlight Repair',
            action: 'Action 6',
        },
        {
            maintenancetype: 'Transmission Flush',
            action: 'Action 7',
        },
    ];

    return (
        <>
            <PageHeader title="Vehicle Maintenance Type Report" breadcrumbs={breadcrumbs}/>
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
