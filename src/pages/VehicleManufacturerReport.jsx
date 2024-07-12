import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import { Button } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function VehicleManufacturerReport() {

    const breadcrumbs = [
        {label: 'Reports', link: '/'},
        {label: 'Vehicle Reports', link: '/'},
        {label: 'Vehicle Manufacturer Report', link: '/'},
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const columns = [
        {
            Header: 'Vehicle Manufacturer',
            accessor: 'manufacturer',
        },
        {
            Header: 'Action',
            accessor: 'action',
        }
    ];

    const data = [
        { manufacturer: 'Manufacturer 1', action: '-' },
        { manufacturer: 'Manufacturer 2', action: '-' },
        { manufacturer: 'Manufacturer 3', action: '-' },
        { manufacturer: 'Manufacturer 4', action: '-' },
        { manufacturer: 'Manufacturer 5', action: '-' },
        { manufacturer: 'Manufacturer 6', action: '-' },
        { manufacturer: 'Manufacturer 7', action: '-' },
    ];

    return (
        <>
            <PageHeader title="Vehicle Manufacturer Report" breadcrumbs={breadcrumbs}/>
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
