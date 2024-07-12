import PageHeader from "../components/PageHeader.jsx";
import MyTable from "../components/MyTable.jsx";
import {
    Button,

} from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";

import DatePicker from "../components/MyCalendar.jsx";

export default function VehicleReports() {

    const breadcrumbs = [
        {label: 'Reports', link: '/'},
        {label: 'Vehicle Reports', link: '/'},
        {label: 'Vehicle Details Report', link: '/'},
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
    ]
    const dataTemplate = {
        regno: '-',
        licexpdate: '-',
        model: '-',
        manufacturer: '-',
        type: '-',
        fueltype: '-',
        color: '-',
        status: '-',
        action: '-'
    };

    const data = Array(10).fill().map(() => ({ ...dataTemplate }));


    return (
        <>
            <PageHeader title="Vehicle Details Report" breadcrumbs={breadcrumbs}/>
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
