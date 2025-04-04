import React from 'react';

const DashboardPageHeading = ({ pageHeading, name, value, children, buttons }) => {
    // Support both new and old usage patterns
    const title = pageHeading || name;
    const subtitle = value;
    
    return (
        <div className='flex flex-col md:flex-row justify-between items-center mb-6'>
            <h2 className='text-xl md:text-2xl font-semibold mb-4 md:mb-0'>
                {title}
                {subtitle && <span className='badge badge-lg badge-secondary ml-2'>{subtitle}</span>}
            </h2>
            <div className='flex items-center gap-2'>
                {/* Support both children and buttons array */}
                {children}
                {buttons && Array.isArray(buttons) && buttons.map((button, index) => (
                    <React.Fragment key={index}>{button}</React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DashboardPageHeading;