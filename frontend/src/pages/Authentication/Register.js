import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import registerGif from '../../Assets/GIF/register.gif';
import DefaultNavbar from '../../components/DefaultNavbar';
import Footer from '../../components/Footer';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (event) => {
        event.preventDefault();
    
        const { password, confirmPassword } = formData;
    
        // Password validation rules
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert(
                "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
            );
            return;
        }
    
        // Confirm password validation
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:5000/api/products/auth/register", formData);
            alert(response.data.message);
            navigate('/home'); // Redirect to home page after successful registration
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    };
    
    return (
        <div>
            <DefaultNavbar />
            <section className="relative flex flex-wrap lg:h-screen lg:items-center mb-6">
                <div className="w-full px-4 py-12 lg:w-1/2 sm:px-6 lg:px-8 sm:py-16 lg:py-24 mb-6">
                    <div className="max-w-lg mx-auto text-center">
                        <h1 className="text-2xl font-bold sm:text-3xl">Create Your Inventory Account</h1>

                        <p className="mt-4 text-gray-500">
                            Sign up today and unlock intelligent inventory management solution, feel the power of automation and more.
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="card-body">
                        <div className='grid grid-cols-2 gap-4 justify-between'>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">First Name</span>
                                </label>
                                <input name="firstName" onChange={handleChange} type="text" placeholder="First Name" className="input input-bordered" />

                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Last Name</span>
                                </label>
                                <input name="lastName" onChange={handleChange} type="text" placeholder="Last Name" className="input input-bordered" />

                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input name="email" onChange={handleChange} type="email" placeholder="Email" className="input input-bordered" />

                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input name="password" onChange={handleChange} type="password" placeholder="Password" className="input input-bordered" />

                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input name="confirmPassword" onChange={handleChange} type="password" placeholder="Confirm Password" className="input input-bordered" />

                            <div className="form-control mt-4">
                                <label className="label cursor-pointer flex items-center">
                                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
                                    <p className="label-text">By signing up with a third party service, you agree to accept QuickMeds <Link to='/terms-and-conditions' className='underline'>Terms of service</Link> and <Link to='/privacy-policy' className='underline'>Privacy policy</Link></p>
                                </label>
                            </div>
                        </div>
                        <div className="form-control mt-6">
                            <button type='submit' className="btn btn-primary text-white">Register</button>
                            <div className="form-control mt-6">
                                <p className='flex justify-between'>Already a member? <span onClick={() => navigate('/login')} className='text-[black] underline'>Login Here</span></p>
                            </div>
                        </div>



                    </form>
                </div>

                <div className="relative w-full h-64 sm:h-96 lg:w-1/2 lg:h-full">
                    <img
                        className="absolute inset-0 object-cover w-full h-full"
                        src={registerGif}
                        alt=""
                    />
                </div>
            </section>
            <div className='mt-40'></div>
            <Footer />
        </div>
    );
};

export default Register;