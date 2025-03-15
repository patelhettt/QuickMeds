import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { HiMenuAlt3 } from 'react-icons/hi';

const DefaultNavbar = () => {
    const [user, setUser] = useState(null);

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
        return () => window.removeEventListener("storage", fetchUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);  // Update state immediately
    };

    const defaultNavbarMenus = [
        { id: 1, link: "/", name: "Home" },
        { id: 7, link: "/dashboard", name: "Dashboard" },
        { id: 2, link: "/about", name: "About" },
        { id: 3, link: "/contact", name: "Contact" },
    ];

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <Link to='/' className="text-lg md:text-lg lg:text-xl font-semibold uppercase flex items-center">
                    <span className="ml-2 text-xl font-bold">QuickMeds</span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal p-0">
                    {defaultNavbarMenus.map(menu => (
                        <li key={menu.id}>
                            <Link to={menu.link} className="flex items-center gap-x-2">
                                {menu.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-end">
                {user ? (
                    <>
                        <span className="mr-4">Hello, {user.name}</span>
                        <button onClick={handleLogout} className="btn btn-sm btn-error">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-sm btn-primary mr-2">Login</Link>
                        <Link to="/pricing" className="btn btn-sm btn-secondary text-white border-0">Get Started</Link>
                    </>
                )}

                <div className="dropdown dropdown-end lg:hidden">
                    <label tabIndex="0" className="btn btn-ghost">
                        <HiMenuAlt3 className='text-2xl' />
                    </label>
                    <ul tabIndex="0" className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        {defaultNavbarMenus.map(menu => (
                            <li key={menu.id}>
                                <Link to={menu.link}>{menu.name}</Link>
                            </li>
                        ))}
                        {user ? (
                            <li>
                                <button onClick={handleLogout} className="btn btn-error btn-sm">Logout</button>
                            </li>
                        ) : (
                            <>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/pricing">Get Started</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DefaultNavbar;
