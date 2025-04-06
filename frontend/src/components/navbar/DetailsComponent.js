import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const DetailsComponent = ({ icon, name, subMenus }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(() => {
        // Auto-open the details if a submenu matches the current path
        return subMenus.some(subMenu => {
            // Extract the "to" prop from the submenu component
            const to = subMenu.props.to;
            return location.pathname.includes(`/admin-dashboard/${to}`);
        });
    });
    
    // Check if any submenu is active to highlight the parent
    const isActive = subMenus.some(subMenu => {
        const to = subMenu.props.to;
        return location.pathname.includes(`/admin-dashboard/${to}`);
    });
    
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
                <div className="flex items-center">
                    <span className={isActive ? 'text-primary' : 'text-gray-500'}>
                        {icon}
                    </span>
                    <span className="ml-3">{name}</span>
                </div>
                
                <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                    } ${isActive ? 'text-primary' : 'text-gray-500'}`} 
                />
            </button>

            <div 
                className={`mt-1 ml-6 pl-2 border-l border-gray-100 space-y-1 overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                {subMenus.map((subMenu, index) => (
                    <div key={index} className="py-1">
                        {subMenu}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailsComponent;