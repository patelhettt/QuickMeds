import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { CgChevronDownR } from 'react-icons/cg';
import DefaultNavbar from '../../components/DefaultNavbar';
import Footer from '../../components/Footer';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        city: '',
        store_name: '',
        role: ''// Add phone to the state
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        const { firstName, lastName, email, password, confirmPassword, phone, city, store_name, role } = formData;

        // Basic validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !role || !city || !store_name || !phone) {
            toast.error('Please fill in all fields');
            return;
        }

        // Password validation rules
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error(
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
            );
            return;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            // This should match the route in backend/index.js
            const response = await axios.post("http://localhost:5000/api/products/auth/register", formData); 
            toast.success(response.data.message || 'Registration successful!');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
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
                        <div className="w-full max-w-md">
                            <div className="text-center mb-10 pt-20">
                                <button className="btn border-0 rounded-full bg-base-100 mb-6 text-accent px-8 font-bold text-md hover:bg-base-100">
                                    <CgChevronDownR className='mr-4 text-xl text-secondary' />
                                    New Account
                                </button>
                                <h1 className="text-4xl font-bold"><span className="text-secondary">Join</span> QuickMeds</h1>
                                <p className="py-4 text-neutral">Create your account to access our medicine management platform.</p>
                            </div>

                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">First Name</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <FaUser className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        type="text"
                                                        placeholder="First Name"
                                                        className="input input-bordered w-full pl-10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">Last Name</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                        <FaUser className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        type="text"
                                                        placeholder="Last Name"
                                                        className="input input-bordered w-full pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Email</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <FaEnvelope className="text-gray-400" />
                                                </div>
                                                <input
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className="input input-bordered w-full pl-10"
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
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    type="password"
                                                    placeholder="Create Password"
                                                    className="input input-bordered w-full pl-10"
                                                />
                                            </div>
                                            <label className="label">
                                                <span className="label-text-alt text-gray-500">Must be at least 8 characters with uppercase, lowercase, number and special character</span>
                                            </label>
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
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    className="input input-bordered w-full pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Phone Number</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    className="input input-bordered w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">City</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    type="text"
                                                    placeholder="Enter your city"
                                                    className="input input-bordered w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Store Name</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    name="store_name"
                                                    value={formData.store_name}
                                                    onChange={handleChange}
                                                    type="text"
                                                    placeholder="Enter store name"
                                                    className="input input-bordered w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Request For Role</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                    className="select select-bordered w-full"
                                                >
                                                    <option value="">Select Role</option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="Employee">Employee</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-control mt-6">
                                            <button
                                                type="submit"
                                                className={`btn border-0 bg-secondary hover:bg-primary text-white w-full ${isLoading ? 'loading' : ''}`}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Creating Account...' : 'Register'}
                                            </button>
                                        </div>

                                        <div className="divider text-xs text-gray-400">OR</div>

                                        <div className="text-center">
                                            <Link
                                                to='/login'
                                                className="inline-flex items-center text-secondary hover:text-primary transition-colors"
                                            >
                                                <FaSignInAlt className="mr-2" />
                                                Already have an account? Login
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

export default Register;



//@Dmin123