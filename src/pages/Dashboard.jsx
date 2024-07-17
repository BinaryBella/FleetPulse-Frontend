import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import testc from "../assets/images/testc.png";
import testd from "../assets/images/testd.png";
import testu from "../assets/images/testu.png";
import testt from "../assets/images/testt.png";
import testcv from "../assets/images/testcv.png";
import testa from "../assets/images/testa.png";

export default function Dashboard() {
    const [driverCount, setDriverCount] = useState(0);
    const [vehicleCount, setVehicleCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [dailyTripCount, setDailyTripCount] = useState(0);

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

        fetch('https://localhost:7265/api/Driver/count', { headers: headers })
            .then(response => response.json())
            .then(data => setDriverCount(data))
            .catch(error => console.error('Error fetching driver count:', error));

        fetch('https://localhost:7265/api/Vehicle/count', { headers: headers })
            .then(response => response.json())
            .then(data => setVehicleCount(data))
            .catch(error => console.error('Error fetching vehicle count:', error));

        fetch('https://localhost:7265/api/Auth/count', { headers: headers })
            .then(response => response.json())
            .then(data => setUserCount(data))
            .catch(error => console.error('Error fetching user count:', error));

        fetch('https://localhost:7265/api/Trip/dailycount', { headers: headers })
            .then(response => response.json())
            .then(data => setDailyTripCount(data))
            .catch(error => console.error('Error fetching daily trip count:', error));
    }, []);

    return (
        <>
            <PageHeader title="Dashboard" breadcrumbs={breadcrumbs} />
            <div className="flex justify-between items-center mr-16 mb-16 space-x-14">
                <DashboardCard img={testc} title={vehicleCount} subtitle="Vehicles" />
                <DashboardCard img={testd} title={driverCount} subtitle="Drivers" />
                <DashboardCard img={testu} title={userCount} subtitle="Users" />
            </div>
            <div className="flex justify-between items-center mr-16 space-x-14">
                <DashboardCard img={testt} title={dailyTripCount} subtitle="Daily Trips" />
                <DashboardCard img={testcv} title="50" subtitle="Company Vehicles" />
                <DashboardCard img={testa} title="02" subtitle="Recent Accident" />
            </div>
        </>
    );
}
