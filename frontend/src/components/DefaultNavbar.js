import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaHome, FaTachometerAlt, FaInfoCircle, FaPhoneAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { RiMedicineBottleFill } from 'react-icons/ri';

const DefaultNavbar = () => {
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState("/");

    // Fetch user details when the component mounts
    useEffect(() => {
        const fetchUser = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        fetchUser(); // Initial check when component mounts

        // Listen for changes in localStorage
        window.addEventListener("storage", fetchUser);
        
        // Add scroll event listener
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Set active link based on current path
        setActiveLink(window.location.pathname);
        
        return () => {
            window.removeEventListener("storage", fetchUser);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);  // Update state immediately
    };

    const defaultNavbarMenus = [
        { id: 1, link: "/", name: "Home", icon: <FaHome className="text-lg" /> },
        { id: 7, link: "/dashboard", name: "Dashboard", icon: <FaTachometerAlt className="text-lg" /> },
        { id: 2, link: "/about", name: "About", icon: <FaInfoCircle className="text-lg" /> },
        { id: 3, link: "/contact", name: "Contact", icon: <FaPhoneAlt className="text-lg" /> },
    ];

    return (
        <div className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-1 sm:py-2' : 'bg-base-100 py-2 sm:py-4'}`}>
            <div className="navbar-start">
                <Link to='/' className="text-base sm:text-lg md:text-xl font-semibold uppercase flex items-center">
                    <RiMedicineBottleFill className="text-xl sm:text-2xl text-primary mr-1 sm:mr-2" />
                    <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">QuickMeds</span>
                </Link>
            </div>

            <div className="navbar-center hidden md:flex">
                <ul className="menu menu-horizontal p-0 flex gap-1 sm:gap-2">
                    {defaultNavbarMenus.map(menu => (
                        <li key={menu.id}>
                            <Link 
                                to={menu.link} 
                                className={`flex items-center gap-x-1 sm:gap-x-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all duration-300 hover:bg-primary hover:bg-opacity-10 hover:text-primary ${activeLink === menu.link ? 'bg-primary bg-opacity-10 text-primary font-medium' : ''}`}
                                onClick={() => setActiveLink(menu.link)}
                            >
                                {menu.icon}
                                <span className="text-sm sm:text-base">{menu.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-end">
                {user ? (
                    <div className="flex items-center">
                        <div className="hidden sm:flex items-center mr-2 sm:mr-4 bg-base-200 py-1 px-2 sm:px-3 rounded-full">
                            <FaUserCircle className="text-primary mr-1 sm:mr-2" />
                            <span className="font-medium text-sm sm:text-base">Hello, {user.name}</span>
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="btn btn-xs sm:btn-sm btn-error gap-1 sm:gap-2 hover:scale-105 transition-transform"
                        >
                            <FaSignOutAlt className="text-xs sm:text-sm" />
                            <span className="text-xs sm:text-sm">Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link 
                            to="/login" 
                            className="btn btn-xs sm:btn-sm btn-outline btn-primary hover:scale-105 transition-transform"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/pricing" 
                            className="btn btn-xs sm:btn-sm btn-primary text-white border-0 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                )}

                <div className="dropdown dropdown-end md:hidden ml-1 sm:ml-2">
                    <label tabIndex="0" className="btn btn-ghost btn-circle btn-xs sm:btn-sm">
                        <HiMenuAlt3 className='text-xl sm:text-2xl' />
                    </label>
                    <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-48 sm:w-52 border border-base-200">
                        {defaultNavbarMenus.map(menu => (
                            <li key={menu.id} className="my-1">
                                <Link 
                                    to={menu.link}
                                    className={`flex items-center gap-2 text-sm sm:text-base ${activeLink === menu.link ? 'bg-primary bg-opacity-10 text-primary font-medium' : ''}`}
                                    onClick={() => setActiveLink(menu.link)}
                                >
                                    {menu.icon}
                                    {menu.name}
                                </Link>
                            </li>
                        ))}
                        <div className="divider my-1"></div>
                        {user ? (
                            <>
                                <div className="px-4 py-2 text-xs sm:text-sm text-center">
                                    <span className="block text-gray-500">Signed in as</span>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <li>
                                    <button onClick={handleLogout} className="text-error flex items-center gap-2 text-sm sm:text-base">
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="flex items-center gap-2 text-sm sm:text-base">
                                        <FaUserCircle />
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pricing" className="text-primary text-sm sm:text-base">
                                        Get Started
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DefaultNavbar;
