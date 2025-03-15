import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { HiMenuAlt3 } from 'react-icons/hi';

const DefaultNavbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user details from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const defaultNavbarMenus = [
        { id: 1, link: "/", name: "Home", extraClass: "" },
        { id: 7, link: "/dashboard", name: "Dashboard", extraClass: "" },
        { id: 2, link: "/about", name: "About", extraClass: "" },
        { id: 3, link: "/contact", name: "Contact", extraClass: "" }
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
                            <Link to={menu.link} className={`flex items-center gap-x-2 ${menu.extraClass}`}>
                                {menu.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="navbar-end">
                {user ? (
                    <>
                        <span className="mr-4">Hello, {user.firstName}</span>
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
