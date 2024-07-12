import Logo from './../assets/images/logo.png'; // Importing the Logo image
import { Outlet } from "react-router-dom"; // Importing the Outlet component from react-router-dom

// AnonymousLayout component definition
export default function AnonymousLayout() {
    // Rendering the layout structure
    return (
        <div className="flex w-screen h-screen">
            {/* Left side containing the logo */}
            <div className="bg-[#2c2c59] w-1/2 flex items-center justify-center">
                <img src={Logo} alt="Logo" className="w-1/2"/>
            </div>

            {/* Right side for main content */}
            <div className="bg-[#E1E4EB] w-1/2 flex flex-col items-center justify-center">
                {/* Outlet for rendering nested routes */}
                <Outlet/>
            </div>
        </div>
    );
}
