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
        <div className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-base-100 py-4'}`}>
            <div className="navbar-start">
                <Link to='/' className="text-lg md:text-lg lg:text-xl font-semibold uppercase flex items-center">
                    <RiMedicineBottleFill className="text-2xl text-primary mr-2" />
                    <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">QuickMeds</span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal p-0 flex gap-2">
                    {defaultNavbarMenus.map(menu => (
                        <li key={menu.id}>
                            <Link 
                                to={menu.link} 
                                className={`flex items-center gap-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary hover:bg-opacity-10 hover:text-primary ${activeLink === menu.link ? 'bg-primary bg-opacity-10 text-primary font-medium' : ''}`}
                                onClick={() => setActiveLink(menu.link)}
                            >
                                {menu.icon}
                                <span>{menu.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-end">
                {user ? (
                    <div className="flex items-center">
                        <div className="hidden md:flex items-center mr-4 bg-base-200 py-1 px-3 rounded-full">
                            <FaUserCircle className="text-primary mr-2" />
                            <span className="font-medium">Hello, {user.name}</span>
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="btn btn-sm btn-error gap-2 hover:scale-105 transition-transform"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/login" 
                            className="btn btn-sm btn-outline btn-primary hover:scale-105 transition-transform"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/pricing" 
                            className="btn btn-sm btn-primary text-white border-0 hover:scale-105 transition-transform shadow-md hover:shadow-lg"
                        >
                            Get Started
                        </Link>
                    </div>
                )}

                <div className="dropdown dropdown-end lg:hidden ml-2">
                    <label tabIndex="0" className="btn btn-ghost btn-circle">
                        <HiMenuAlt3 className='text-2xl' />
                    </label>
                    <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200">
                        {defaultNavbarMenus.map(menu => (
                            <li key={menu.id} className="my-1">
                                <Link 
                                    to={menu.link}
                                    className={`flex items-center ${activeLink === menu.link ? 'bg-primary bg-opacity-10 text-primary font-medium' : ''}`}
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
                                <div className="px-4 py-2 text-sm text-center">
                                    <span className="block text-gray-500">Signed in as</span>
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <li>
                                    <button onClick={handleLogout} className="text-error flex items-center gap-2">
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="flex items-center gap-2"><FaUserCircle /> Login</Link></li>
                                <li><Link to="/pricing" className="text-primary">Get Started</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DefaultNavbar;
