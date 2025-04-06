import React from 'react';
import { BiGitPullRequest } from 'react-icons/bi';
import { FaUsers, FaThList, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { HiMenuAlt3 } from 'react-icons/hi';
import { MdLocalPharmacy, MdSpaceDashboard } from 'react-icons/md';
import { TbTruckReturn } from 'react-icons/tb';
import { RiProductHuntFill, RiProfileFill, RiFileDamageFill, RiMedicineBottleFill } from 'react-icons/ri';
import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LinkComponents from '../../components/navbar/LinkComponents';
import logo from '../../Assets/logo.png';
import DetailsComponent from '../../components/navbar/DetailsComponent';

const EmployeeDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        
        if (!token || !userString) {
            setIsAuthenticated(false);
            toast.error('Please login to access the dashboard', {
                position: "top-right",
                autoClose: 3000
            });
            navigate('/login', { state: { from: '/employee-dashboard' } });
        } else {
            setIsAuthenticated(true);
            try {
                const user = JSON.parse(userString);
                if (user.role !== 'employee') {
                    // Redirect to appropriate dashboard based on role
                    if (user.role === 'admin' || user.role === 'superadmin') {
                        navigate('/dashboard');
                    }
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        setIsLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success('Logged out successfully', {
            position: "top-right",
            autoClose: 3000
        });
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: '/employee-dashboard' }} />;
    }

    return (
        <div className="drawer drawer-mobile">
            <input id="employee-dashboard" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="sticky top-0 z-30 flex justify-between items-center bg-base-100 p-2 shadow-sm lg:hidden">
                    <Link to="/" className="flex items-center">
                        <img className='w-8 mr-2' src={logo} alt="logo" />
                        <span className="font-bold text-lg">QuickMeds</span>
                    </Link>
                    <label htmlFor="employee-dashboard" className="btn btn-ghost drawer-button lg:hidden">
                        <HiMenuAlt3 className="text-2xl" />
                    </label>
                </div>
                <Outlet />
            </div>
            <div className="drawer-side lg:bg-green-200 md:bg-green-200 w-52">
                <label htmlFor="employee-dashboard" className="drawer-overlay"></label>
                <div className="flex flex-col justify-between h-screen pb-6">
                    <nav className="flex flex-col mt-6 space-y-2">
                        <Link className="text-xl font-semibold uppercase flex items-center mb-8 px-4" to='/'>
                            <RiMedicineBottleFill className="text-2xl text-primary mr-2" />
                            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">QuickMeds</span>
                        </Link>

                        <LinkComponents to={''} icon={<MdSpaceDashboard className='text-lg' />} name={'Dashboard'} />

                    
                        {/* Requested Items - visible to employees */}
                        <DetailsComponent
                            icon={<BiGitPullRequest className='text-lg' />}
                            name={'Request For Items'}
                            subMenus={
                                [
                                    <LinkComponents
                                        to={'requested-items/pharmacy'}
                                        icon={<MdLocalPharmacy className='text-lg' />}
                                        name={'Pharmacy'} />,

                                    <LinkComponents
                                        to={'requested-items/non-pharmacy'}
                                        icon={<RiProfileFill className='text-lg' />}
                                        name={'Non Pharmacy'} />
                                ]
                            } />

                        {/* Returns - visible to employees */}
                        <DetailsComponent
                            icon={<TbTruckReturn className='text-lg' />}
                            name={'Returns'}
                            subMenus={
                                [
                                    <LinkComponents
                                        to={'returns/customers'}
                                        icon={<FaUser className='text-lg' />}
                                        name={'Customers'} />,

                                    <LinkComponents
                                        to={'returns/expires-or-damages'}
                                        icon={<RiFileDamageFill className='text-lg' />}
                                        name={'Expires / Damages'} />
                                ]
                            } />

                        {/* Customers - visible to employees */}
                        <LinkComponents to={'customers'} icon={<FaUsers className='text-lg' />} name={'Customers'} />

                        {/* POS - visible to employees */}
                        <LinkComponents to={'POS'} icon={<FaThList className='text-lg' />} name={'POS'} />
                    </nav>
                    
                    <div className="px-4">
                        <button 
                            onClick={handleLogout} 
                            className="btn bg-red-600 hover:bg-red-700 text-white w-full gap-2 hover:scale-105 transition-all duration-300 border-0 shadow-md"
                        >
                            <FaSignOutAlt className="text-lg" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard; 