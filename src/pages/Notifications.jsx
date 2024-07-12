import {
    Box,
    List,
    ListItem,
    Heading,
    Text,
    Icon,
    Button,
    IconButton,
    Alert,
    AlertIcon,
    Spinner
} from '@chakra-ui/react';
import { MdNotifications, MdDelete, MdNotificationsNone } from 'react-icons/md';
import PageHeader from "../components/PageHeader";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import './Notification.css';

const Notifications = () => {
    const { notifications, markAsRead, deleteNotification, markAllAsRead, deleteAllNotifications, loading, error } = useNotifications();
    const navigate = useNavigate();

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                There was an error fetching notifications: {error.message}
            </Alert>
        );
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    const handleMarkAsRead = (index) => {
        markAsRead(index);
    };

    const handleDeleteNotification = (index) => {
        deleteNotification(index);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    const handleDeleteAllNotifications = () => {
        deleteAllNotifications();
    };

    const handleNavigate = (username, emailAddress) => {
        navigate(`/app/ResetPasswordDriverHelper?username=${username}&emailAddress=${emailAddress}`);
    };

    return (
        <Box className="notification-container">
            <PageHeader title="Notifications" />
            {notifications.length > 0 && (
                <Box className="notification-controls">
                    <Button
                        className="mark-all-read-btn"
                        style={{ color: 'white', backgroundColor: '#2c2c59', height: '35px' }}
                        onClick={handleMarkAllAsRead}
                    >
                        Mark All as Read
                    </Button>
                    <Button
                        className="delete-all-btn"
                        style={{ color: 'white', backgroundColor: '#9d1518', height: '35px' }}
                        onClick={handleDeleteAllNotifications}
                    >
                        Delete All
                    </Button>
                </Box>
            )}
            {notifications.length === 0 && (
                <Box className="no-notifications">
                    <Icon as={MdNotificationsNone} w={9} h={9} color="ash" mb={2} />
                    <Text>No Notification Here</Text>
                </Box>
            )}
            <List spacing={4}>
                {notifications.map((notification, index) => {
                    if (notification.message.split(" ")[1] !== "0") {
                    return (<ListItem
                        key={index}
                        className={`notification-item ${notification.read ? "read" : "unread"}`}
                    >
                        <Box className="notification-header">
                            <Box className="notification-info">
                                <Icon as={MdNotifications} w={6} h={6} color="#393970" />
                                <Heading as="h2" size="sm">{notification.title}</Heading>
                            </Box>
                            <Box className="notification-actions">
                                {notification.isPasswordReset && (
                                    <Button
                                        className="reset-password-btn"
                                        style={{ color: 'white', backgroundColor: '#247ab7' }}
                                        onClick={() => handleNavigate(notification.username, notification.emailAddress)}
                                    >
                                        Reset Password
                                    </Button>
                                )}
                                {!notification.read && (
                                    <Button className="mark-read-btn" onClick={() => handleMarkAsRead(index)}>
                                        Mark as Read
                                    </Button>
                                )}
                                <IconButton
                                    className="delete-btn"
                                    aria-label="Delete notification"
                                    icon={<MdDelete size={20} />}
                                    onClick={() => handleDeleteNotification(index)}
                                />
                            </Box>
                        </Box>
                        <Text className="notification-body">{notification.message}</Text>
                        <Text className="notification-timestamp">{notification.time}</Text>
                    </ListItem>)}
                })}
            </List>
        </Box>
    );
};

export default Notifications;
