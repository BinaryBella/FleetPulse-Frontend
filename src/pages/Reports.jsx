import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import dynamic report components
const DynamicVehicleDetailsReport = React.lazy(() => import('./VehicleDetailsReport'));
const DynamicVehicleFuelRefillReport = React.lazy(() => import('./VehicleFuelRefillReport'));
const DynamicVehicleMaintenanceReport = React.lazy(() => import('./VehicleMaintenanceReport'));
const DynamicVehicleMaintenanceTypeReport = React.lazy(() => import('./VehicleMaintenanceTypeReport'));
const DynamicVehicleManufacturerReport = React.lazy(() => import('./VehicleManufacturerReport'));
const DynamicVehicleModelReport = React.lazy(() => import('./VehicleModelReport'));
const DynamicVehicleTypeReport = React.lazy(() => import('./VehicleTypeReport'));

const DynamicDriverReport = React.lazy(() => import('./DriverReport'));
const DynamicHelperReport = React.lazy(() => import('./HelperReport'));
const DynamicStaffReport = React.lazy(() => import('./StaffReport'));
const DynamicTripReport = React.lazy(() => import('./TripReport'));
const DynamicAccidentReport = React.lazy(() => import('./AccidentReport'));

const Reports = () => {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="vehicle-details" element={<DynamicVehicleDetailsReport />} />
                <Route path="vehicle-fuel-refill" element={<DynamicVehicleFuelRefillReport />} />
                <Route path="vehicle-maintenance" element={<DynamicVehicleMaintenanceReport />} />
                <Route path="vehicle-maintenance-type" element={<DynamicVehicleMaintenanceTypeReport />} />
                <Route path="vehicle-manufacturer" element={<DynamicVehicleManufacturerReport />} />
                <Route path="vehicle-model" element={<DynamicVehicleModelReport />} />
                <Route path="vehicle-type" element={<DynamicVehicleTypeReport />} />
                <Route path="driver" element={<DynamicDriverReport />} />
                <Route path="helper" element={<DynamicHelperReport />} />
                <Route path="staff" element={<DynamicStaffReport />} />
                <Route path="trip" element={<DynamicTripReport />} />
                <Route path="accident" element={<DynamicAccidentReport />} />
            </Routes>
        </React.Suspense>
    );
}

export default Reports;
