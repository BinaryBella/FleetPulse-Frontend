import PropTypes from 'prop-types';
import SideMenu from '../components/SideMenu.jsx';
import TopMenu from '../components/TopMenu.jsx';
import { Outlet } from 'react-router-dom';

export default function MainLayout({ isAdmin }) {
    return (
        <div className="flex min-w-screen min-h-screen bg-[#2c2c59]">
            <SideMenu isAdmin={isAdmin} />
            <div className="bg-[#E1E4EB] w-4/5 pl-16 ml-[304px]">
                <TopMenu />
                <Outlet />
            </div>
        </div>
    );
}

// PropTypes validation for MainLayout component
MainLayout.propTypes = {
    isAdmin: PropTypes.bool.isRequired, // Validate isAdmin prop
};
