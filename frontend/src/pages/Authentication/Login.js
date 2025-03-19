import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import { CgChevronDownR } from 'react-icons/cg';
import DefaultNavbar from '../../components/DefaultNavbar';
import Footer from '../../components/Footer';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/products/auth/login", { email, password });

            // Store token in local storage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            toast.success(response.data.message || 'Login successful');
            navigate('/dashboard');  // Redirect to dashboard after login
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <DefaultNavbar />
            <div className="text-accent">
                <section className="hero min-h-screen bg-info">
                    <div className="hero-content">
                        <div className="max-w-md w-full">
                            <div className="text-center mb-8">
                                <button className="btn border-0 rounded-full bg-base-100 mb-4 text-accent px-8 font-bold text-md hover:bg-base-100">
                                    <CgChevronDownR className='mr-4 text-xl text-secondary' />
                                    User Access
                                </button>
                                <h1 className="text-4xl font-bold"><span className="text-secondary">Login</span> to your account</h1>
                                <p className="py-4 text-neutral">Sign in to access your dashboard and manage your medicines.</p>
                            </div>

                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Email</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input 
                                                    type="email" 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)} 
                                                    placeholder="Enter your email" 
                                                    className="input input-bordered w-full pl-10" 
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Password</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FaLock className="text-gray-400" />
                                                </div>
                                                <input 
                                                    type="password" 
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)} 
                                                    placeholder="Enter your password" 
                                                    className="input input-bordered w-full pl-10" 
                                                    required 
                                                />
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <label className="label cursor-pointer inline-flex items-center">
                                                    <input 
                                                        type="checkbox" 
                                                        className="checkbox checkbox-secondary checkbox-sm mr-2" 
                                                        checked={rememberMe}
                                                        onChange={() => setRememberMe(!rememberMe)}
                                                    />
                                                    <span className="label-text text-sm">Remember me</span>
                                                </label>
                                                <Link to='/forgot-password' className='text-secondary text-sm hover:underline'>
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="form-control mt-6">
                                            <button 
                                                type='submit' 
                                                className={`btn border-0 bg-secondary hover:bg-primary text-white w-full ${isLoading ? 'loading' : ''}`}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Signing in...' : 'Login'}
                                            </button>
                                        </div>
                                        
                                        <div className="divider text-xs text-gray-400">OR</div>
                                        
                                        <div className="text-center">
                                            <Link 
                                                to='/register' 
                                                className="inline-flex items-center justify-center gap-2 w-full btn btn-outline border-secondary text-secondary hover:bg-secondary hover:text-white"
                                            >
                                                <FaUserPlus />
                                                Create New Account
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            
                            <div className="mt-6 text-center text-sm">
                                <p>Need help? <Link to="/contact" className="text-secondary hover:underline">Contact Support</Link></p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
