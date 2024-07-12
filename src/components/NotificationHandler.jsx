import { useEffect } from 'react';
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase/firebaseConfig";
import { useNotifications } from '../context/NotificationContext';

const NotificationHandler = () => {
    const { VITE_APP_VAPID_KEY } = import.meta.env;
    const { addNotification } = useNotifications();

    useEffect(() => {
        const requestPermission = async () => {
            try {
                const permission = await Notification.requestPermission();

                if (permission === "granted") {
                    const token = await getToken(messaging, {
                        vapidKey: VITE_APP_VAPID_KEY,
                    });
                    console.log("Token generated: ", token);
                    sessionStorage.setItem("deviceToken", token);
                } else if (permission === "denied") {
                    alert("You denied the notification");
                }
            } catch (error) {
                console.error("Error requesting permission or getting token: ", error);
            }
        };

        requestPermission();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Incoming message", payload);  // Log payload for debugging

            const options = {
                timeZone: 'Asia/Colombo',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
            };

            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date());

            const notification = {
                title: payload.notification?.title || 'No title',
                message: payload.notification?.body || 'No body',
                emailAddress: payload.data?.emailAddress || 'No email',
                username: payload.data?.username || 'Unknown',
                vehicleRegistrationNo: payload.data?.vehicleRegistrationNo || 'No vehicle registration number',
                isPasswordReset: payload.notification?.title === "Password Reset Request",
                time: formattedDate,
                read: false,
            };

            console.log('Parsed notification:', notification); // Log notification for debugging

            addNotification(notification);
        });

        return () => unsubscribe();
    }, [VITE_APP_VAPID_KEY, addNotification]);

    return null;
};

export default NotificationHandler;
