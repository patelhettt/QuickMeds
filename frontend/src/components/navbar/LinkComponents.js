import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const LinkComponents = ({ to, icon, name, className = '' }) => {
    const location = useLocation();
    const isActive = location.pathname === `/admin-dashboard/${to}` ||
        (to === '' && location.pathname === '/admin-dashboard');

    return (
        <Link
            to={to}
            className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${className}`}
        >
            <span className={`${isActive ? 'text-primary' : 'text-gray-500'}`}>
                {icon}
            </span>
            <span className="ml-3"> {name} </span>
        </Link>
    );
};

export default LinkComponents;