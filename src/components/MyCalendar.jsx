import { useState, useRef, useEffect } from 'react';
import { Input, Flex, Icon, Text } from '@chakra-ui/react';
import { BsCalendar } from 'react-icons/bs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MyCalendar() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [startCalendarOpen, setStartCalendarOpen] = useState(false);
    const [endCalendarOpen, setEndCalendarOpen] = useState(false);

    const startCalendarRef = useRef(null);
    const endCalendarRef = useRef(null);

    const toggleStartCalendar = () => {
        setStartCalendarOpen(!startCalendarOpen);
        setEndCalendarOpen(false);
    };

    const toggleEndCalendar = () => {
        setEndCalendarOpen(!endCalendarOpen);
        setStartCalendarOpen(false);
    };

    const handleOutsideClick = (event) => {
        if (startCalendarRef.current && !startCalendarRef.current.contains(event.target)) {
            setStartCalendarOpen(false);
        }

        if (endCalendarRef.current && !endCalendarRef.current.contains(event.target)) {
            setEndCalendarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div className="custom-datepicker">
            <Flex alignItems="center" justifyContent="flex-start" mb={4}>
                <Flex alignItems="center" mr={4}>
                    {/* Start Date */}
                    <Text mb={2} mr={2} fontSize="sm">Start Date</Text>
                    <Flex alignItems="center" position="relative">
                        <Input
                            type="date"
                            variant="filled"
                            borderRadius="md"
                            px={2}
                            width="200px"
                            height="32px"
                            name="startDate"
                            placeholder="Start Date"
                            fontSize="sm"
                            value={startDate ? startDate.toISOString().split('T')[0] : ''}
                            onClick={toggleStartCalendar}
                            readOnly
                        />
                        <Icon as={BsCalendar} onClick={toggleStartCalendar} cursor="pointer" position="absolute" right="8px" top="50%" transform="translateY(-50%)" />
                    </Flex>
                </Flex>

                <Flex alignItems="center">
                    {/* End Date */}
                    <Text mb={2} mr={2} fontSize="sm">End Date</Text>
                    <Flex alignItems="center" position="relative">
                        <Input
                            type="date"
                            variant="filled"
                            borderRadius="md"
                            px={2}
                            width="200px"
                            height="32px"
                            name="endDate"
                            placeholder="End Date"
                            fontSize="sm"
                            value={endDate ? endDate.toISOString().split('T')[0] : ''}
                            onClick={toggleEndCalendar}
                            readOnly
                        />
                        <Icon as={BsCalendar} onClick={toggleEndCalendar} cursor="pointer" position="absolute" right="8px" top="50%" transform="translateY(-50%)" />
                    </Flex>
                </Flex>
            </Flex>

            {startCalendarOpen && (
                <div ref={startCalendarRef}>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            toggleStartCalendar();
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select a date"
                        minDate={new Date('2015-01-01')}
                        maxDate={endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                        inline
                    />
                </div>
            )}

            {endCalendarOpen && (
                <div ref={endCalendarRef}>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                            setEndDate(date);
                            toggleEndCalendar();
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select a date"
                        minDate={startDate || new Date('2015-01-01')}
                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                        inline
                    />
                </div>
            )}
        </div>
    );
}
