import {Navigate, Outlet} from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoutes = ({ roles, children }) => {
    const token = localStorage.getItem('Token');
    const userRole = sessionStorage.getItem('UserRole');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!token) {
        return <Navigate to="/auth/Login" />;
    }

    if (roles && roles.length > 0) {
        if (roles.includes('Admin') && isAdmin) {
            return children ? children : <Outlet />;
        }
        if (roles.includes(userRole)) {
            return children ? children : <Outlet />;
        }
        return <Navigate to="/UnauthorizedPage" />;
    }

    return children;
};

PrivateRoutes.propTypes = {
    roles: PropTypes.arrayOf(PropTypes.string), // roles should be an array of strings
    children: PropTypes.node, // children is a required node (React element)
};

export default PrivateRoutes;
