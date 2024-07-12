import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";

const PrivateRoutes = ({ roles }) => {

    const token = localStorage.getItem('Token');
    const isAuthenticated = !!token;
    let userRole = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userRole = decodedToken.role;
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/Login" />;
    } else if (roles && !roles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    } else {
        return <Outlet />;
    }
};

PrivateRoutes.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoutes;
