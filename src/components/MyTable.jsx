import PropTypes from 'prop-types';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export default function MyTable({ columns, data }) {
    return (
        <Table className="custom-table">
            {/* Table Header */}
            <Thead align="center">
                <Tr>
                    {/* Render table headers */}
                    {columns.map(column => (
                        <Th key={column.Header}>{column.Header}</Th>
                    ))}
                </Tr>
            </Thead>

            {/* Table Body */}
            <Tbody>
                {/* Map over data to render table rows */}
                {data.map((row, index) => (
                    <Tr key={index}>
                        {/* Map over columns to render individual cells */}
                        {columns.map(column => (
                            <Td key={column.accessor}>{row[column.accessor]}</Td>
                        ))}
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}

MyTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            Header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
