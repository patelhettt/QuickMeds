import React from 'react';
import { AiFillCreditCard, AiFillCopyrightCircle, AiFillSetting } from 'react-icons/ai';
import { BiCategory, BiUnite, BiGitPullRequest } from 'react-icons/bi';
import { BsCreditCard2BackFill } from 'react-icons/bs';
import { FaUsers, FaThList, FaUser, FaSignOutAlt, FaStore } from 'react-icons/fa';
import { HiDocumentText, HiMenuAlt3 } from 'react-icons/hi';
import { MdLocalPharmacy, MdSpaceDashboard, MdInventory2 } from 'react-icons/md';
import { TbTruckReturn, TbTruckDelivery } from 'react-icons/tb';
import { RiProductHuntFill, RiAdminFill, RiShoppingCartFill, RiProfileFill, RiFileDamageFill, RiMedicineBottleFill } from 'react-icons/ri';
import { Link, Outlet, Navigate, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LinkComponents from '../../components/navbar/LinkComponents';
import logo from '../../Assets/logo.png';
import DetailsComponent from '../../components/navbar/DetailsComponent';
import DashboardPageHeading from '../../components/headings/DashboardPageHeading';
import RefreshButton from '../../components/buttons/RefreshButton';
import PrintButton from '../../components/buttons/PrintButton';
import NewButton from '../../components/buttons/NewButton';
import SaveButton from '../../components/buttons/SaveButton';
import SearchButton from '../../components/buttons/SearchButton';
import CancelButton from '../../components/buttons/CancelButton';
import EditButton from '../../components/buttons/EditButton';

// Helper functions for use in child components
export const openModal = (modalId) => {
    if (document.getElementById(modalId)) {
        document.getElementById(modalId).checked = true;
    }
};

export const closeModal = (modalId) => {
    if (document.getElementById(modalId)) {
        document.getElementById(modalId).checked = false;
    }
};

export function useDashboardContext() {
    return useOutletContext();
}

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Function to handle opening a modal
    const handleOpenModal = (modalId) => {
        // Simple guard for direct string ID usage
        if (typeof modalId === 'string') {
            if (document.getElementById(modalId)) {
                document.getElementById(modalId).checked = true;
            }
            return;
        }

        // Handle event object from button click
        if (modalId && modalId.target) {
            const target = modalId.target.closest('label');
            if (target && target.getAttribute('for')) {
                const id = target.getAttribute('for');
                if (document.getElementById(id)) {
                    document.getElementById(id).checked = true;
                }
            }
        }
    };

    // Function to handle closing a modal
    const handleCloseModal = (modalId) => {
        if (document.getElementById(modalId)) {
            document.getElementById(modalId).checked = false;
        }
    };

    // Function to handle refresh operations
    const handleRefresh = () => {
        toast.info("Refreshing data...");
        // This is a template function that will be overridden by component-specific handlers
    };
    
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
                const userData = JSON.parse(userString);
                setUserInfo(userData);
                
                // Redirect based on role
                if (userData.role === 'employee') {
                    navigate('/employee-dashboard');
                } else if (userData.role === 'admin') {
                    navigate('/admin-dashboard');
                } else if (userData.role !== 'superadmin') {
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
            } else if (path.length > 3 && path[3] === 'all-products') {
                return 'Complete Inventory';
            }
            return 'Inventory';
        }
        if (section.includes('products')) return 'Products';
        if (section.includes('orders')) return 'Orders';
        if (section.includes('purchases')) return 'Purchases';
        if (section.includes('returns')) return 'Returns';
        if (section.includes('setup')) return 'Settings';
        if (section.includes('suppliers')) return 'Suppliers';
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
        return <Navigate to="/login" state={{ from: '/dashboard' }} />;
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
                        <span className="ml-1 text-xs bg-red-500 text-white px-1 rounded">Super</span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <FaUser />
                        </div>
                        <div className="ml-3">
                            <p className="font-medium text-gray-800">{userInfo?.name || 'Super Admin'}</p>
                            <p className="text-xs text-gray-500">
                                {userInfo?.store_name || ''}
                                <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                                    {userInfo?.role || 'SuperAdmin'}
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
                            icon={<MdInventory2 className="text-lg" />}
                            name={'Complete Inventory'}
                            className="bg-primary/5 text-primary font-medium"
                        />

                        <DetailsComponent
                            icon={<RiProductHuntFill className="text-lg" />}
                            name={'Products'}
                            subMenus={[
                                    <LinkComponents
                                        to={'products/pharmacy'}
                                    icon={<MdLocalPharmacy className="text-lg" />}
                                        name={'Pharmacy'} />,
                                    <LinkComponents
                                        to={'products/non-pharmacy'}
                                    icon={<RiProfileFill className="text-lg" />}
                                        name={'Non Pharmacy'} />
                            ]}
                        />

                        <div className="pt-4 pb-2">
                            <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Orders & Purchases
                            </p>
                        </div>

                        <DetailsComponent
                            icon={<RiShoppingCartFill className="text-lg" />}
                            name={'Order Status'}
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
                            icon={<AiFillCreditCard className="text-lg" />}
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
                                People & Business
                            </p>
                        </div>

                                    <LinkComponents
                            to={'users'}
                            icon={<RiAdminFill className="text-lg" />}
                            name={'Users'}
                        />

                                    <LinkComponents
                            to={'customers'}
                            icon={<FaUsers className="text-lg" />}
                            name={'Customers'}
                        />
                        {/* 
                        <DetailsComponent
                            icon={<TbTruckDelivery className="text-lg" />}
                            name={'Suppliers'}
                            subMenus={[
                                    <LinkComponents
                                        to={'suppliers/lists'}
                                    icon={<FaThList className="text-md" />}
                                        name={'Lists'} />,
                                    <LinkComponents
                                        to={'suppliers/payments'}
                                    icon={<BsCreditCard2BackFill className="text-lg" />}
                                        name={'Payments'} />,
                                    <LinkComponents
                                        to={'suppliers/documents'}
                                    icon={<HiDocumentText className="text-lg" />}
                                        name={'Documents'} />
                            ]}
                        /> */}

                        <DetailsComponent
                            icon={<AiFillSetting className="text-lg" />}
                            name={'Settings'}
                            subMenus={[
                                <LinkComponents
                                    to={'setup/categories'}
                                    icon={<BiCategory className="text-lg" />}
                                    name={'Categories'} />,
                                <LinkComponents
                                    to={'setup/unit-types'}
                                    icon={<BiUnite className="text-lg" />}
                                    name={'Unit Types'} />,
                                <LinkComponents
                                    to={'setup/companies'}
                                    icon={<AiFillCopyrightCircle className="text-lg" />}
                                    name={'Companies'} />
                            ]}
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
                <input id="dashboard" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Mobile Header */}
                    <div className="sticky top-0 z-30 flex justify-between items-center bg-white p-4 border-b border-gray-200">
                        <Link to="/" className="flex items-center">
                            <img className="w-8 h-8 mr-2" src={logo} alt="QuickMeds Logo" />
                            <span className="font-bold text-xl">QuickMeds</span>
                            <span className="ml-1 text-xs bg-red-500 text-white px-1 rounded">Super</span>
                        </Link>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-3 font-medium hidden sm:block">
                                {getPageTitle()}
                            </span>
                            <label htmlFor="dashboard" className="btn btn-ghost drawer-button">
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
                    <label htmlFor="dashboard" className="drawer-overlay"></label>
                    <div className="w-64 bg-white h-full overflow-y-auto">
                        {/* Mobile Logo */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <Link to="/" className="flex items-center">
                                <img className="w-8 h-8 mr-2" src={logo} alt="QuickMeds Logo" />
                                <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    QuickMeds
                                </span>
                                <span className="ml-1 text-xs bg-red-500 text-white px-1 rounded">Super</span>
                            </Link>
                        </div>

                        {/* Mobile User Info */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FaUser />
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium text-gray-800">{userInfo?.name || 'Super Admin'}</p>
                                    <p className="text-xs text-gray-500">
                                        {userInfo?.store_name || ''}
                                        <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                                            {userInfo?.role || 'SuperAdmin'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="flex-1 px-4 py-4">
                            <div className="space-y-1">
                                <LinkComponents to={''} icon={<MdSpaceDashboard className="text-lg" />} name={'Dashboard'} />

                                <LinkComponents
                                    to={'inventory/all-products'}
                                    icon={<MdInventory2 className="text-lg" />}
                                    name={'Complete Inventory'}
                                />

                                <DetailsComponent
                                    icon={<RiProductHuntFill className="text-lg" />}
                                    name={'Products'}
                                    subMenus={[
                                        <LinkComponents to={'products/pharmacy'} icon={<MdLocalPharmacy className="text-lg" />} name={'Pharmacy'} />,
                                        <LinkComponents to={'products/non-pharmacy'} icon={<RiProfileFill className="text-lg" />} name={'Non Pharmacy'} />
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
                                    icon={<AiFillCreditCard className="text-lg" />}
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
                                        <LinkComponents to={'returns/expires-or-damages'} icon={<RiFileDamageFill className="text-lg" />} name={'Expires/Damages'} />
                                    ]}
                                />

                                <LinkComponents to={'employees'} icon={<RiAdminFill className="text-lg" />} name={'Employees'} />
                                <LinkComponents to={'customers'} icon={<FaUsers className="text-lg" />} name={'Customers'} />

                                <DetailsComponent
                                    icon={<TbTruckDelivery className="text-lg" />}
                                    name={'Suppliers'}
                                    subMenus={[
                                        <LinkComponents to={'suppliers/lists'} icon={<FaThList className="text-md" />} name={'Lists'} />,
                                        <LinkComponents to={'suppliers/payments'} icon={<BsCreditCard2BackFill className="text-lg" />} name={'Payments'} />,
                                        <LinkComponents to={'suppliers/documents'} icon={<HiDocumentText className="text-lg" />} name={'Documents'} />
                                    ]}
                                />

                                <DetailsComponent
                                    icon={<AiFillSetting className="text-lg" />}
                                    name={'Settings'}
                                    subMenus={[
                                        <LinkComponents to={'setup/categories'} icon={<BiCategory className="text-lg" />} name={'Categories'} />,
                                        <LinkComponents to={'setup/unit-types'} icon={<BiUnite className="text-lg" />} name={'Unit Types'} />,
                                        <LinkComponents to={'setup/companies'} icon={<AiFillCopyrightCircle className="text-lg" />} name={'Companies'} />
                                    ]}
                                />

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
                        <span className="text-sm text-gray-600">{userInfo?.store_name || ''}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            SuperAdmin
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <Outlet
                        context={{
                            handleOpenModal,
                            handleCloseModal,
                            handleRefresh,
                            userInfo
                        }}
                    />
                </div>
            </main>

            {/* Global button handlers used for child components */}
            <div className="hidden">
                {/* These are template components with the proper handlers attached */}
                <NewButton
                    key="global-new-button"
                    modalId="create-new-product"
                    onRefresh={() => handleOpenModal("create-new-product")}
                    btnSize="btn-sm"
                />
                <SaveButton
                    key="global-save-button"
                    extraClass=""
                />
                <CancelButton
                    key="global-cancel-create"
                    modalId="create-new-product"
                    onClick={() => handleCloseModal("create-new-product")}
                />
                <CancelButton
                    key="global-cancel-edit"
                    modalId="edit-product"
                    onClick={() => handleCloseModal("edit-product")}
                />
                <EditButton
                    key="global-edit-button"
                    onClick={() => handleOpenModal("edit-product")}
                />
                <RefreshButton
                    key="global-refresh-button"
                    onClick={handleRefresh}
                />
                <SearchButton
                    key="global-search-button"
                    onClick={() => {
                        toast.info("Search clicked");
                    }}
                />
            </div>
        </div>
    );
};

export default Dashboard;

// Add event listener to handle new-product button clicks globally
document.addEventListener('DOMContentLoaded', () => {
    // Create a MutationObserver to watch for new elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check for new buttons with specific modal IDs
                const newButtons = document.querySelectorAll('[for="create-new-product"]');
                newButtons.forEach(button => {
                    if (!button.getAttribute('data-initialized')) {
                        button.setAttribute('data-initialized', 'true');
                        button.addEventListener('click', (e) => {
                            // Make sure the modal is checked
                            const modalId = button.getAttribute('for');
                            if (document.getElementById(modalId)) {
                                document.getElementById(modalId).checked = true;
                            }
                        });
                    }
                });
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});