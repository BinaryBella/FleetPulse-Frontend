import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import {
    Button,
} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import DatePicker from "../components/MyCalendar.jsx";

export default function VehicleFuelRefillReport() {

    const breadcrumbs = [
        {label: 'Reports', link: '/'},
        {label: 'Vehicle Reports', link: '/'},
        {label: 'Vehicle Fuel Refill Report', link: '/'},
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    const columns =[
        {
            Header: 'Reg No',
            accessor: 'regno',
        },
        {
            Header: 'Driver NIC',
            accessor: 'drivernic',
        },
        {
            Header: 'Helper NIC',
            accessor: 'helpernic',
        },
        {
            Header: 'Liter Count',
            accessor: 'litercount',
        },
        {
            Header: 'Date',
            accessor: 'date',
        },
        {
            Header: 'Time',
            accessor: 'time',
        },
        {
            Header: 'Refill Type',
            accessor: 'refilltype',
        },
        {
            Header: 'Cost',
            accessor: 'cost',
        },
        {
            Header: 'Action',
            accessor: 'action',
        }
    ]

    const data = [
        {
            regno: 'ABC-1',
            drivernic: 'NIC-1',
            helpernic: 'Helper-NIC-1',
            litercount: 50,
            date: '2024-05-01',
            time: '10:01',
            refilltype: 'Type-1',
            cost: '$500',
            action: 'Action 1',
        },
        {
            regno: 'ABC-2',
            drivernic: 'NIC-2',
            helpernic: 'Helper-NIC-2',
            litercount: 60,
            date: '2024-05-02',
            time: '10:02',
            refilltype: 'Type-2',
            cost: '$600',
            action: 'Action 2',
        },
        {
            regno: 'ABC-3',
            drivernic: 'NIC-3',
            helpernic: 'Helper-NIC-3',
            litercount: 70,
            date: '2024-05-03',
            time: '10:03',
            refilltype: 'Type-3',
            cost: '$700',
            action: 'Action 3',
        },
        {
            regno: 'ABC-4',
            drivernic: 'NIC-4',
            helpernic: 'Helper-NIC-4',
            litercount: 80,
            date: '2024-05-04',
            time: '10:04',
            refilltype: 'Type-4',
            cost: '$800',
            action: 'Action 4',
        },
        {
            regno: 'ABC-5',
            drivernic: 'NIC-5',
            helpernic: 'Helper-NIC-5',
            litercount: 90,
            date: '2024-05-05',
            time: '10:05',
            refilltype: 'Type-5',
            cost: '$900',
            action: 'Action 5',
        },
        {
            regno: 'ABC-6',
            drivernic: 'NIC-6',
            helpernic: 'Helper-NIC-6',
            litercount: 100,
            date: '2024-05-06',
            time: '10:06',
            refilltype: 'Type-6',
            cost: '$1000',
            action: 'Action 6',
        },
        {
            regno: 'ABC-7',
            drivernic: 'NIC-7',
            helpernic: 'Helper-NIC-7',
            litercount: 110,
            date: '2024-05-07',
            time: '10:07',
            refilltype: 'Type-7',
            cost: '$1100',
            action: 'Action 7',
        },
    ];

    return (
        <>
            <PageHeader title="Vehicle Fuel Refill Report" breadcrumbs={breadcrumbs}/>
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
