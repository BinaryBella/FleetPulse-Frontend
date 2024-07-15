import { useEffect, useState } from 'react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import theme from "../config/ThemeConfig.jsx";
import axios from "axios";
import './TopMenu.css';
import { useNotifications } from '../context/NotificationContext';

export default function TopMenu() {
    const navigate = useNavigate();
    const [image, setImage] = useState("");
    const { notifications, getUnreadCount, markAsRead, deleteNotification } = useNotifications();

    const fetchUser = async () => {
        try {
            const username = sessionStorage.getItem("Username");
            if (username) {
                const response = await axios.get(`https://localhost:7265/api/Auth/userProfile?username=${username}`);
                const responseData = response.data;
                setImage(responseData.profilePicture);
            } else {
                console.error("Username not found in session storage.");
            }
        } catch (error) {
            console.error("Error fetching User details:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.removeItem('Token');
        navigate("/auth/Login");
    };

    const unreadCount = getUnreadCount();

    const handleMarkAsRead = async (index, id) => {
        try {
            await axios.post(`https://localhost:7265/api/Notification/mark-as-read/${id}`);
            markAsRead(index); // Update local state as well
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleDeleteNotification = async (index, id) => {
        try {
            await axios.delete(`https://localhost:7265/api/Notification/delete/${id}`);
            deleteNotification(index); // Update local state as well
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <>
            <div className="flex justify-end">
                <div className="flex gap-6 me-10">
                    <Link className="flex items-center notification" to="/app/Notification">
                        <IconButton
                            variant='link'
                            color={theme.purple}
                            aria-label='notification'
                            fontSize='30px'
                            mt={5}
                            icon={<IoIosNotifications />}
                        />
                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </Link>
                    <div className="flex items-center">
                        <Menu>
                            <MenuButton
                                color={theme.purple}
                                as={IconButton}
                                aria-label='profile-options'
                                fontSize='25px'
                                mt={5}
                                variant='outline'
                                sx={{
                                    _hover: {
                                        bg: 'transparent',
                                    },
                                }}
                            >
                                {image ? (
                                    <img
                                        src={`data:image/jpeg;base64,${image}`}
                                        alt="User Avatar"
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                ) : (
                                    <FaUser />
                                )}
                            </MenuButton>
                            <MenuList>
                                <MenuItem>
                                    <Link to="/app/UserProfile">
                                        User Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link to="/app/ChangePassword">
                                        Change Password
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </div>
            </div>
            <hr className="my-5 border border-[#D0D8DE]" />
        </>
    );
}