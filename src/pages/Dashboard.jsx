import { useEffect, useState } from "react";
import {axiosApi} from "../interceptor.js";
import PageHeader from "../components/PageHeader.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import testc from "../assets/images/testc.png";
import testd from "../assets/images/testd.png";
import testu from "../assets/images/testu.png";
import testt from "../assets/images/testt.png";
import testa from "../assets/images/testa.png";
import testh from "../assets/images/testh.png";

export default function Dashboard() {
    const [driverCount, setDriverCount] = useState(0);
    const [vehicleCount, setVehicleCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [dailyTripCount, setDailyTripCount] = useState(0);
    const [helperCount, setHelperCount] = useState(0);
    const [accidentCount, setAccidentCount] = useState(0);


    const breadcrumbs = [
        { label: 'Home', link: '/app/Dashboard' },
        { label: 'Dashboard', link: '/app/Dashboard' },
    ];

    const headers = { 'Authorization': `Bearer ${localStorage.getItem("Token")}` };

    useEffect(() => {
        const hasRefreshed = sessionStorage.getItem('hasRefreshed');
        if (!hasRefreshed) {
            sessionStorage.setItem('hasRefreshed', 'true');
            window.location.reload();
        }

        axiosApi.get(' http://localhost:5173/api/Auth/count', { headers: headers })
            .then(response => setUserCount(response.data))
            .catch(error => console.error('Error fetching user count:', error));

        axiosApi.get(' http://localhost:5173/api/Driver/count', { headers: headers })
            .then(response => setDriverCount(response.data))
            .catch(error => console.error('Error fetching driver count:', error));

        axiosApi.get(' http://localhost:5173/api/Helper/count', { headers: headers })
            .then(response => setHelperCount(response.data))
            .catch(error => console.error('Error fetching driver count:', error));

        axiosApi.get(' http://localhost:5173/api/Vehicles/count', { headers: headers })
            .then(response => setVehicleCount(response.data))
            .catch(error => console.error('Error fetching vehicle count:', error));

        axiosApi.get(' http://localhost:5173/api/Trip/dailycount', { headers: headers })
            .then(response => setDailyTripCount(response.data))
            .catch(error => console.error('Error fetching daily trip count:', error));

        axiosApi.get(' http://localhost:5173/api/Accidents/latest-month/count', { headers: headers })
            .then(response => setAccidentCount(response.data))
            .catch(error => console.error('Error fetching daily trip count:', error));
    }, []);

    return (
        <>
            <PageHeader title="Dashboard" breadcrumbs={breadcrumbs} />
            <div className="flex justify-between items-center mr-16 mb-20 space-x-16">
                <DashboardCard img={testu} title={userCount} subtitle="Users" />
                <DashboardCard img={testd} title={driverCount} subtitle="Drivers" />
                <DashboardCard img={testh} title={helperCount} subtitle="Helpers" />
            </div>
            <div className="flex justify-between items-center mr-16 space-x-16">
                <DashboardCard img={testc} title={vehicleCount} subtitle="Vehicles" />
                <DashboardCard img={testt} title={dailyTripCount} subtitle="Daily Trips" />
                <DashboardCard img={testa} title={accidentCount} subtitle="Monthly Accidents" />
            </div>
        </>
    );
}
