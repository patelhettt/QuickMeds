import React from 'react';
import { AiFillCreditCard, AiFillCopyrightCircle, AiFillSetting } from 'react-icons/ai';
import { BiCategory, BiUnite, BiGitPullRequest } from 'react-icons/bi';
import { BsCreditCard2BackFill } from 'react-icons/bs';
import { FaUsers, FaThList, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { HiDocumentText, HiMenuAlt3 } from 'react-icons/hi';
import { MdLocalPharmacy, MdSpaceDashboard } from 'react-icons/md';
import { TbTruckReturn, TbTruckDelivery } from 'react-icons/tb';
import { RiProductHuntFill, RiAdminFill, RiShoppingCartFill, RiProfileFill, RiFileDamageFill, RiMedicineBottleFill } from 'react-icons/ri';
import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LinkComponents from '../../components/navbar/LinkComponents';
import logo from '../../Assets/logo.png';
import DetailsComponent from '../../components/navbar/DetailsComponent';
import DashboardPageHeading from '../../components/headings/DashboardPageHeading';
import RefreshButton from '../../components/buttons/RefreshButton';
import PrintButton from '../../components/buttons/PrintButton';

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Add this near the top with other state variables
    const [userRole, setUserRole] = useState('');
    
    // Update the useEffect to get the user role
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
            navigate('/login', { state: { from: '/dashboard' } });
        } else {
            setIsAuthenticated(true);
            try {
                const user = JSON.parse(userString);
                setUserRole(user.role || 'employee');
            } catch (error) {
                console.error('Error parsing user data:', error);
                setUserRole('employee'); // Default to employee if parsing fails
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
        return <Navigate to="/login" state={{ from: '/dashboard' }} />;
    }

    return (
        <div className="drawer drawer-mobile">
            <input id="dashboard" className="drawer-toggle" />
            <div className="drawer-content">
                <div className="sticky top-0 z-30 flex justify-between items-center bg-base-100 p-2 shadow-sm lg:hidden">
                    <Link to="/" className="flex items-center">
                        <img className='w-8 mr-2' src={logo} alt="logo" />
                        <span className="font-bold text-lg">QuickMeds</span>
                    </Link>
                    <label htmlFor="dashboard" className="btn btn-ghost drawer-button lg:hidden">
                        <HiMenuAlt3 className="text-2xl" />
                    </label>
                </div>
                <Outlet />
            </div>
            <div className="drawer-side lg:bg-yellow-200 md:bg-yellow-200 w-52">
                <label htmlFor="dashboard" className="drawer-overlay"></label>
                <div className="flex flex-col justify-between h-screen pb-6">
                    <nav className="flex flex-col mt-6 space-y-2">
                        <Link className="text-xl font-semibold uppercase flex items-center mb-8 px-4" to='/'>
                            <RiMedicineBottleFill className="text-2xl text-primary mr-2" />
                            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">QuickMeds</span>
                        </Link>

                        <LinkComponents to={''} icon={<MdSpaceDashboard className='text-lg' />} name={'Dashboard'} />

                        {/* Products - visible to all roles */}
                        <DetailsComponent
                            icon={<RiProductHuntFill className='text-lg' />}
                            name={'Products'}
                            subMenus={
                                [
                                    <LinkComponents
                                        to={'products/pharmacy'}
                                        icon={<MdLocalPharmacy className='text-lg' />}
                                        name={'Pharmacy'} />,

                                    <LinkComponents
                                        to={'products/non-pharmacy'}
                                        icon={<RiProfileFill className='text-lg' />}
                                        name={'Non Pharmacy'} />
                                ]
                            } />

                        {/* Requested Items - visible to all roles */}
                        <DetailsComponent
                            icon={<BiGitPullRequest className='text-lg' />}
                            name={'Requested Items'}
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

                        {/* Orders/Inventory - visible to admin and superadmin only */}
                        {(userRole === 'admin' || userRole === 'superadmin') && (
                            <DetailsComponent
                                icon={<RiShoppingCartFill className='text-lg' />}
                                name={'Order Status'}
                                subMenus={
                                    [
                                        <LinkComponents
                                            to={'orders/pharmacy'}
                                            icon={<MdLocalPharmacy className='text-lg' />}
                                            name={'Pharmacy'} />,

                                        <LinkComponents
                                            to={'orders/non-pharmacy'}
                                            icon={<RiProfileFill className='text-lg' />}
                                            name={'Non Pharmacy'} />
                                    ]
                                } />
                        )}

                        {/* /Inventory - Inventory for admins */}
                        {(userRole === 'admin') && (
                            <DetailsComponent
                                icon={<RiShoppingCartFill className='text-lg' />}
                                name={'Inventory'}
                                subMenus={
                                    [
                                        <LinkComponents
                                            to={'inventory/pharmacy'}
                                            icon={<MdLocalPharmacy className='text-lg' />}
                                            name={'Pharmacy'} />,

                                        <LinkComponents
                                            to={'inventory/non-pharmacy'}
                                            icon={<RiProfileFill className='text-lg' />}
                                            name={'Non Pharmacy'} />
                                    ]
                                } />
                        )}

                        {/* Purchases - visible to admin and superadmin only */}
                        {(userRole === 'admin' || userRole === 'superadmin') && (
                            <DetailsComponent
                                icon={<AiFillCreditCard className='text-lg' />}
                                name={'Purchases'}
                                subMenus={
                                    [
                                        <LinkComponents
                                            to={'purchases/pharmacy'}
                                            icon={<MdLocalPharmacy className='text-lg' />}
                                            name={'Pharmacy'} />,

                                        <LinkComponents
                                            to={'purchases/non-pharmacy'}
                                            icon={<RiProfileFill className='text-lg' />}
                                            name={'Non Pharmacy'} />
                                    ]
                                } />
                        )}

                        {/* Returns - visible to all roles */}
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

                        {/* Settings - visible to admin and superadmin only */}
                        {(userRole === 'admin' || userRole === 'superadmin') && (
                            <DetailsComponent
                                icon={<AiFillSetting className='text-lg' />}
                                name={'Settings'}
                                subMenus={
                                    [
                                        <LinkComponents
                                            to={'setup/categories'}
                                            icon={<BiCategory className='text-lg' />}
                                            name={'Categories'} />,

                                        <LinkComponents
                                            to={'setup/unit-types'}
                                            icon={<BiUnite className='text-lg' />}
                                            name={'Unit Types'} />,

                                        <LinkComponents
                                            to={'setup/companies'}
                                            icon={<AiFillCopyrightCircle className='text-lg' />}
                                            name={'Companies'} />
                                    ]
                                } />
                        )}

                        {/* Employees - visible to admin and superadmin only */}
                        {(userRole === 'admin' || userRole === 'superadmin') && (
                            <LinkComponents to={'employees'} icon={<RiAdminFill className='text-lg' />} name={'Employees'} />
                        )}

                        {/* Customers - visible to all roles */}
                        <LinkComponents to={'customers'} icon={<FaUsers className='text-lg' />} name={'Customers'} />

                        {/* Suppliers - visible to admin and superadmin only */}
                        {(userRole === 'admin' || userRole === 'superadmin') && (
                            <DetailsComponent
                                icon={<TbTruckDelivery className='text-lg' />}
                                name={'Suppliers'}
                                subMenus={
                                    [
                                        <LinkComponents
                                            to={'suppliers/lists'}
                                            icon={<FaThList className='text-md' />}
                                            name={'Lists'} />,

                                        <LinkComponents
                                            to={'suppliers/payments'}
                                            icon={<BsCreditCard2BackFill className='text-lg' />}
                                            name={'Payments'} />,

                                        <LinkComponents
                                            to={'suppliers/documents'}
                                            icon={<HiDocumentText className='text-lg' />}
                                            name={'Documents'} />
                                    ]
                                } />
                        )}

                        {/* POS - visible to all roles */}
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

export default Dashboard;