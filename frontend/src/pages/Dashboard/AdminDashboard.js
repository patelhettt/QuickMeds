import React, { useEffect, useState } from 'react';
import { Link, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// Icons
import { MdSpaceDashboard, MdLocalPharmacy, MdOutlineInventory2 } from 'react-icons/md';
import { FaUsers, FaUser, FaSignOutAlt, FaStore } from 'react-icons/fa';
import { HiMenuAlt3 } from 'react-icons/hi';
import { BiPurchaseTag } from 'react-icons/bi';
import { TbTruckReturn } from 'react-icons/tb';
import { RiShoppingCartFill, RiProfileFill, RiFileDamageFill, RiAdminFill } from 'react-icons/ri';

// Components
import LinkComponents from '../../components/navbar/LinkComponents';
import DetailsComponent from '../../components/navbar/DetailsComponent';
import logo from '../../Assets/logo.png';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    
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
            navigate('/login', { state: { from: '/admin-dashboard' } });
        } else {
            setIsAuthenticated(true);
            try {
                const userData = JSON.parse(userString);
                setUser(userData);
                
                // Redirect based on role
                if (userData.role === 'employee') {
                    navigate('/employee-dashboard');
                } else if (userData.role !== 'admin' && userData.role !== 'superadmin') {
                    // If not admin or superadmin
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                navigate('/login');
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

    // Get current page title
    const getPageTitle = () => {
        const path = location.pathname.split('/');
        if (path.length <= 2) return 'Dashboard';
        
        const section = path[2];
        if (section.includes('inventory')) {
            if (path.length > 3 && path[3] === 'pharmacy') {
                return 'Pharmacy Products Inventory';
            } else if (path.length > 3 && path[3] === 'non-pharmacy') {
                return 'Non-Pharmacy Products Inventory';
            }
            return 'Products Inventory';
        }
        if (section.includes('orders')) return 'Orders';
        if (section.includes('purchases')) return 'Purchases';
        if (section.includes('returns')) return 'Returns';
        if (section === 'employees') return 'Employees';
        if (section === 'customers') return 'Customers';
        if (section === 'POS') return 'Point of Sale';
        
        return section.charAt(0).toUpperCase() + section.slice(1);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: '/admin-dashboard' }} />;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
                {/* Logo */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <Link to="/" className="flex items-center">
                        <img className="w-8 h-8 mr-2" src={logo} alt="QuickMeds Logo" />
                        <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            QuickMeds
                        </span>
                    </Link>
                </div>
                
                {/* User Info */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <FaUser />
                        </div>
                        <div className="ml-3">
                            <p className="font-medium text-gray-800">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">
                                {user?.store_name || ''} 
                                <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                                    {user?.role || 'Administrator'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 overflow-y-auto">
                    <div className="space-y-1">
                        <LinkComponents 
                            to={''} 
                            icon={<MdSpaceDashboard className="text-lg" />} 
                            name={'Dashboard'} 
                            className="hover:bg-primary/10"
                        />
                        
                        <div className="pt-4 pb-2">
                            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Inventory Management
                            </p>
                        </div>
                        
                        <LinkComponents
                            to={'inventory/all-products'}
                            icon={<FaStore className="text-lg" />}
                            name={'Complete Inventory (79)'}
                            className="bg-primary/5 text-primary font-medium"
                        />
                        
                        <DetailsComponent
                            icon={<MdOutlineInventory2 className="text-lg" />}
                            name={'Products Inventory'}
                            subMenus={[
                                <LinkComponents
                                    to={'inventory/pharmacy'}
                                    icon={<MdLocalPharmacy className="text-lg" />}
                                    name={'Pharmacy Products'} />,
                                <LinkComponents
                                    to={'inventory/non-pharmacy'}
                                    icon={<RiProfileFill className="text-lg" />}
                                    name={'Non-Pharmacy Products'} />
                            ]}
                        />
                        
                        <div className="pt-4 pb-2">
                            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Order Management
                            </p>
                        </div>
                        
                        <DetailsComponent
                            icon={<RiShoppingCartFill className="text-lg" />}
                            name={'Orders'}
                            subMenus={[
                                <LinkComponents
                                    to={'orders/pharmacy'}
                                    icon={<MdLocalPharmacy className="text-lg" />}
                                    name={'Pharmacy'} />,
                                <LinkComponents
                                    to={'orders/non-pharmacy'}
                                    icon={<RiProfileFill className="text-lg" />}
                                    name={'Non Pharmacy'} />
                            ]}
                        />
                        
                        <DetailsComponent
                            icon={<BiPurchaseTag className="text-lg" />}
                            name={'Purchases'}
                            subMenus={[
                                <LinkComponents
                                    to={'purchases/pharmacy'}
                                    icon={<MdLocalPharmacy className="text-lg" />}
                                    name={'Pharmacy'} />,
                                <LinkComponents
                                    to={'purchases/non-pharmacy'}
                                    icon={<RiProfileFill className="text-lg" />}
                                    name={'Non Pharmacy'} />
                            ]}
                        />
                        
                        <DetailsComponent
                            icon={<TbTruckReturn className="text-lg" />}
                            name={'Returns'}
                            subMenus={[
                                <LinkComponents
                                    to={'returns/customers'}
                                    icon={<FaUser className="text-lg" />}
                                    name={'Customers'} />,
                                <LinkComponents
                                    to={'returns/expires-or-damages'}
                                    icon={<RiFileDamageFill className="text-lg" />}
                                    name={'Expires / Damages'} />
                            ]}
                        />
                        
                        <div className="pt-4 pb-2">
                            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                People
                            </p>
                        </div>
                        
                        <LinkComponents 
                            to={'employees'} 
                            icon={<RiAdminFill className="text-lg" />} 
                            name={'Employees'} 
                        />
                        
                        <LinkComponents 
                            to={'customers'} 
                            icon={<FaUsers className="text-lg" />} 
                            name={'Customers'} 
                        />
                        
                        <div className="pt-4 pb-2">
                            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Sales
                            </p>
                        </div>
                        
                        <LinkComponents 
                            to={'POS'} 
                            icon={<FaStore className="text-lg" />} 
                            name={'Point of Sale'} 
                        />
                    </div>
                </nav>
                
                {/* Logout Button */}
                <div className="px-4 py-4 border-t border-gray-200">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Drawer */}
            <div className="drawer drawer-mobile lg:hidden">
                <input id="admin-dashboard" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Mobile Header */}
                    <div className="sticky top-0 z-30 flex justify-between items-center bg-white p-4 border-b border-gray-200">
                        <Link to="/" className="flex items-center">
                            <img className="w-8 h-8 mr-2" src={logo} alt="QuickMeds Logo" />
                            <span className="font-bold text-xl">QuickMeds</span>
                        </Link>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-3 font-medium hidden sm:block">
                                {getPageTitle()}
                            </span>
                            <label htmlFor="admin-dashboard" className="btn btn-ghost drawer-button">
                                <HiMenuAlt3 className="text-2xl" />
                            </label>
                        </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="p-4">
                        <Outlet />
                    </div>
                </div>
                
                {/* Mobile Sidebar */}
                <div className="drawer-side">
                    <label htmlFor="admin-dashboard" className="drawer-overlay"></label>
                    <div className="w-64 bg-white h-full overflow-y-auto">
                        {/* Mobile Logo */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <Link to="/" className="flex items-center">
                                <img className="w-8 h-8 mr-2" src={logo} alt="QuickMeds Logo" />
                                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    QuickMeds
                                </span>
                            </Link>
                        </div>
                        
                        {/* Mobile User Info */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FaUser />
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium text-gray-800">{user?.name || 'Admin User'}</p>
                                    <p className="text-xs text-gray-500">
                                        {user?.store_name || ''}
                                        <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                                            {user?.role || 'Administrator'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mobile Navigation */}
                        <nav className="flex-1 px-4 py-4">
                            {/* Same navigation items as desktop but without section headers for simplicity */}
                            <div className="space-y-1">
                                <LinkComponents to={''} icon={<MdSpaceDashboard className="text-lg" />} name={'Dashboard'} />
                                
                                <LinkComponents
                                    to={'inventory/all-products'}
                                    icon={<FaStore className="text-lg" />}
                                    name={'Complete Inventory'}
                                />
                                
                                <DetailsComponent
                                    icon={<MdOutlineInventory2 className="text-lg" />}
                                    name={'Products Inventory'}
                                    subMenus={[
                                        <LinkComponents to={'inventory/pharmacy'} icon={<MdLocalPharmacy className="text-lg" />} name={'Pharmacy Products'} />,
                                        <LinkComponents to={'inventory/non-pharmacy'} icon={<RiProfileFill className="text-lg" />} name={'Non-Pharmacy Products'} />
                                    ]} 
                                />
                                
                                <DetailsComponent
                                    icon={<RiShoppingCartFill className="text-lg" />}
                                    name={'Orders'}
                                    subMenus={[
                                        <LinkComponents to={'orders/pharmacy'} icon={<MdLocalPharmacy className="text-lg" />} name={'Pharmacy'} />,
                                        <LinkComponents to={'orders/non-pharmacy'} icon={<RiProfileFill className="text-lg" />} name={'Non Pharmacy'} />
                                    ]} 
                                />
                                
                                <DetailsComponent
                                    icon={<BiPurchaseTag className="text-lg" />}
                                    name={'Purchases'}
                                    subMenus={[
                                        <LinkComponents to={'purchases/pharmacy'} icon={<MdLocalPharmacy className="text-lg" />} name={'Pharmacy'} />,
                                        <LinkComponents to={'purchases/non-pharmacy'} icon={<RiProfileFill className="text-lg" />} name={'Non Pharmacy'} />
                                    ]} 
                                />
                                
                                <DetailsComponent
                                    icon={<TbTruckReturn className="text-lg" />}
                                    name={'Returns'}
                                    subMenus={[
                                        <LinkComponents to={'returns/customers'} icon={<FaUser className="text-lg" />} name={'Customers'} />,
                                        <LinkComponents to={'returns/expires-or-damages'} icon={<RiFileDamageFill className="text-lg" />} name={'Expires / Damages'} />
                                    ]} 
                                />
                                
                                <LinkComponents to={'employees'} icon={<RiAdminFill className="text-lg" />} name={'Employees'} />
                                <LinkComponents to={'customers'} icon={<FaUsers className="text-lg" />} name={'Customers'} />
                                <LinkComponents to={'POS'} icon={<FaStore className="text-lg" />} name={'Point of Sale'} />
                            </div>
                        </nav>
                        
                        {/* Mobile Logout Button */}
                        <div className="px-4 py-4 border-t border-gray-200">
                            <button 
                                onClick={handleLogout}
                                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                <FaSignOutAlt className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content (Desktop) */}
            <main className="flex-1 overflow-y-auto hidden lg:block">
                {/* Desktop header */}
                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{user?.store_name || ''}</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {user?.role || 'Administrator'}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard; 