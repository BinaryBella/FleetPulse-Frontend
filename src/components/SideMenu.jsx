import {useEffect} from 'react';
import PropTypes from 'prop-types';
import Logo from "../assets/images/logo.png";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Text,
    VStack,
    IconButton
} from '@chakra-ui/react';
import {Link} from "react-router-dom";
import theme from "../config/ThemeConfig.jsx";
import {AiOutlineDashboard} from "react-icons/ai";
import {FaCarAlt, FaCarCrash} from "react-icons/fa";
import {MdAirlineSeatReclineNormal} from "react-icons/md";
import {IoMdPeople, IoMdPerson} from "react-icons/io";
import {BiTrip} from "react-icons/bi";
import $ from 'jquery';

export default function SideMenu({isAdmin}) {
    useEffect(() => {
        $(".chakra-accordion__item").css({"border-color": "transparent"});
    }, []);

    return (
        <div className="side-menu">
            <div className="flex justify-center items-center w-full h-40 mb-3 -mt-5">
                <Link to="/app/Dashboard">
                    <img src={Logo} alt="Logo" style={{height: "80%"}}/>
                </Link>
            </div>
            <VStack spacing={7} align='stretch' width="full">
                <Link className="flex items-center pl-16" to="/app/Dashboard">
                    <IconButton
                        variant="link"
                        color={theme.orange}
                        aria-label="dashboard"
                        fontSize="20px"
                        icon={<AiOutlineDashboard/>}

                    />
                    <Text color={theme.orange}
                          fontSize="md"
                          paddingLeft="6"
                          _hover={{
                              color: '#FFA500', // Change this to your desired hover color
                          }}>
                        Dashboard
                    </Text>
                </Link>
                <div className="flex items-start pl-16">
                    <IconButton
                        variant='link'
                        color={theme.orange}
                        aria-label='vehicle'
                        marginTop="4"
                        fontSize="20px"
                        icon={<FaCarAlt/>}
                        style={{marginRight: "8px"}}
                    />
                    <Accordion allowMultiple>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box as="span" flex='1' textAlign='left' color={theme.orange} fontSize='md'
                                         paddingLeft="0">
                                        Vehicle
                                    </Box>
                                    <AccordionIcon color={theme.orange}/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <div>
                                    <Link className="flex items-center pl-3 mb-3" to="/app/VehicleDetails">
                                        <Text
                                            color={theme.orange}
                                            fontSize="md"
                                            _hover={{
                                                color: '#FFA500', // Change this to your desired hover color
                                            }}
                                        >
                                            Vehicle Details
                                        </Text>
                                    </Link>
                                    <Link className="flex items-center pl-3 mb-3" to="/app/VehicleTypeDetails">
                                        <Text
                                            color={theme.orange}
                                            fontSize="md"
                                            _hover={{
                                                color: '#FFA500', // Change this to your desired hover color
                                            }}
                                        >
                                            Vehicle Type
                                        </Text>
                                    </Link>
                                    <Link className="flex items-center pl-3 mb-3" to="/app/ManufacturerDetails">
                                        <Text
                                            color={theme.orange}
                                            fontSize="md"
                                            _hover={{
                                                color: '#FFA500', // Change this to your desired hover color
                                            }}
                                        >
                                            Manufacturer
                                        </Text>
                                    </Link>
                                    <Link className="flex items-center pl-3 mb-3" to="/app/VehicleMaintenanceDetails">
                                        <Text
                                            color={theme.orange}
                                            fontSize="md"
                                            _hover={{
                                                color: '#FFA500', // Change this to your desired hover color
                                            }}
                                        >
                                            Maintenance
                                        </Text>
                                    </Link>
                                    <Link className="flex items-center pl-3 mb-3" to="/app/VehicleMaintenanceTypeDetails">
                                        <Text
                                            color={theme.orange}
                                            fontSize="md"
                                            _hover={{
                                                color: '#FFA500', // Change this to your desired hover color
                                            }}
                                        >
                                            Maintenance Type
                                        </Text>
                                    </Link>
                                    <Link className="flex items-center pl-3 mb-3" to="/app/FuelRefillDetails">
                                        <Text
                                            color={theme.orange}
                                            fontSize="md"
                                            _hover={{
                                                color: '#FFA500', // Change this to your desired hover color
                                            }}
                                        >
                                            Fuel Refill
                                        </Text>
                                    </Link>
                                </div>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </div>
                <Link className="flex items-center pl-16" to="/app/DriverDetails">
                    <IconButton
                        variant="link"
                        color={theme.orange}
                        aria-label='driver'
                        fontSize="20px"
                        icon={<MdAirlineSeatReclineNormal/>}
                    />
                    <Text color={theme.orange} fontSize="md" paddingLeft="6">
                        Driver
                    </Text>
                </Link>
                <Link className="flex items-center pl-16" to="/app/HelperDetails">
                    <IconButton
                        variant='link'
                        color={theme.orange}
                        aria-label='helper'
                        fontSize="20px"
                        icon={<IoMdPerson/>}
                    />
                    <Text color={theme.orange} fontSize="md" paddingLeft="6">
                        Helper
                    </Text>
                </Link>
                {isAdmin && ( // Render only if isAdmin is true (admin user)
                    <Link className="flex items-center pl-16" to="/app/StaffDetails">
                        <IconButton
                            variant='link'
                            color={theme.orange}
                            aria-label='staff'
                            fontSize="20px"
                            icon={<IoMdPeople/>}
                        />
                        <Text color={theme.orange} fontSize="md" paddingLeft="6">
                            Staff
                        </Text>
                    </Link>
                )}
                <Link className="flex items-center pl-16" to="/app/TripDetails">
                    <IconButton
                        variant='link'
                        color={theme.orange}
                        aria-label='trip'
                        fontSize="20px"
                        icon={<BiTrip/>}
                    />
                    <Text color={theme.orange} fontSize="md" paddingLeft="6">
                        Trip
                    </Text>
                </Link>
                <Link className="flex items-center pl-16" to="/app/AccidentDetails">
                    <IconButton
                        variant='link'
                        color={theme.orange}
                        aria-label='accident'
                        fontSize="20px"
                        icon={<FaCarCrash/>}
                    />
                    <Text color={theme.orange} fontSize="md" paddingLeft="6">
                        Accident
                    </Text>
                </Link>
            </VStack>
        </div>
    );
}

SideMenu.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
};
