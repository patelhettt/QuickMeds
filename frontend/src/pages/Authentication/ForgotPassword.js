import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { CgChevronDownR } from 'react-icons/cg';
import Footer from '../../components/Footer';
import DefaultNavbar from '../../components/DefaultNavbar';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            toast.success('Password reset link sent to your email');
            setIsLoading(false);
            // In a real app, you would call an API endpoint here
        }, 1500);
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
                                    Account Recovery
                                </button>
                                <h1 className="text-4xl font-bold"><span className="text-secondary">Reset</span> your password</h1>
                                <p className="py-4 text-neutral">Enter your email address and we'll send you instructions to reset your password.</p>
                            </div>

                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Email Address</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input 
                                                    type="email" 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email address" 
                                                    className="input input-bordered w-full pl-10" 
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control mt-6">
                                            <button 
                                                type="submit" 
                                                className={`btn border-0 bg-secondary hover:bg-primary text-white w-full ${isLoading ? 'loading' : ''}`}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;