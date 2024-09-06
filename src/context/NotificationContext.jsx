import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     // Load notifications from local storage initially
    //     const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    //     setNotifications(storedNotifications);
    // }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(' http://localhost:5173/api/Notification/unread'); // Replace with your backend API URL
                console.log(response);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);


    useEffect(() => {
        // Save notifications to local storage on update
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = (notification) => {
        console.log('Adding notification:', notification); // Add logging
        setNotifications((prevNotifications) => [
            { ...notification, read: false },
            ...prevNotifications
        ]);
    };

    const markAsRead = (index) => {
        setNotifications((prevNotifications) => {
            const updatedNotifications = [...prevNotifications];
            if (updatedNotifications[index]) {
                updatedNotifications[index].read = true;
            }
            return updatedNotifications;
        });
    };

    const deleteNotification = (index) => {
        setNotifications((prevNotifications) => {
            const updatedNotifications = [...prevNotifications];
            updatedNotifications.splice(index, 1);
            return updatedNotifications;
        });
    };

    const markAllAsRead = () => {
        setNotifications((prevNotifications) => {
            return prevNotifications.map(notification => ({
                ...notification,
                read: true
            }));
        });
    };

    const deleteAllNotifications = () => setNotifications([]);

    const getUnreadCount = () => notifications.filter(notification => !notification.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications, addNotification, getUnreadCount, deleteAllNotifications,
            markAsRead, markAllAsRead, deleteNotification, loading, error
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default NotificationProvider;
