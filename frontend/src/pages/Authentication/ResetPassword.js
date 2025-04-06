import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import { CgChevronDownR } from 'react-icons/cg';
import Footer from '../../components/Footer';
import DefaultNavbar from '../../components/DefaultNavbar';
import axios from 'axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error('Email information missing');
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                newPassword
            });
            toast.success(response.data.message || 'Password reset successfully');
            setIsLoading(false);
            // Navigate to login page after successful password reset
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setIsLoading(false);
            toast.error(err.response?.data?.message || 'Failed to reset password');
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
                                    New Password
                                </button>
                                <h1 className="text-4xl font-bold"><span className="text-secondary">Reset</span> your password</h1>
                                <p className="py-4 text-neutral">Create a new password for your account.</p>
                            </div>

                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">New Password</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FaLock className="text-gray-400" />
                                                </div>
                                                <input 
                                                    type="password" 
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Enter new password" 
                                                    className="input input-bordered w-full pl-10" 
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Confirm Password</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FaLock className="text-gray-400" />
                                                </div>
                                                <input 
                                                    type="password" 
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password" 
                                                    className="input input-bordered w-full pl-10" 
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control mt-6">
                                            <button 
                                                type="submit" 
                                                className={`btn border-0 bg-secondary hover:bg-primary text-white w-full ${isLoading ? 'loading' : ''}`}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Resetting...' : 'Reset Password'}
                                            </button>
                                        </div>
                                        
                                        <div className="divider text-xs text-gray-400">OR</div>
                                        
                                        <div className="text-center">
                                            <Link 
                                                to="/login" 
                                                className="inline-flex items-center text-secondary hover:text-primary transition-colors"
                                            >
                                                <FaArrowLeft className="mr-2" />
                                                Back to Login
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

export default ResetPassword;
