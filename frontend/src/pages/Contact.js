import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DefaultNavbar from '../components/DefaultNavbar';
import Footer from '../components/Footer';

const Contact = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    // State to manage form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        sendCopy: false,
    });

    // State to manage submission status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value.trim(),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all required fields.');
                return;
            }

            const response = await fetch('http://localhost:5000/api/contactUs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage('Your message has been sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    message: '',
                    sendCopy: false,
                });
            } else {
                alert(result.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while sending your message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-accent">
            <DefaultNavbar />

            <section className="hero min-h-[50vh] bg-info">
                <div className="hero-content text-center">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl font-bold mb-4">
                            Get In <span className="text-secondary">Touch</span>
                        </h1>
                        <p className="text-xl text-neutral max-w-2xl mx-auto">
                            We're here to help and answer any questions you might have. 
                            Looking forward to hearing from you!
                        </p>
                    </div>
                </div>
            </section>

            <motion.main 
                className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Success Message */}
                {successMessage && (
                    <motion.div 
                        className="max-w-4xl mx-auto mb-8 bg-secondary/10 border-l-4 border-secondary p-4 rounded-md"
                        variants={itemVariants}
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-secondary font-medium">{successMessage}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <motion.div 
                        className="block p-8 transition border border-info shadow-xl rounded-xl hover:shadow-secondary hover:border-secondary"
                        variants={itemVariants}
                    >
                        <h2 className="text-2xl font-bold text-accent mb-6 pb-3 border-b border-info">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-accent mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-info rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-accent mb-1">
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-info rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                                    required
                                />
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-accent mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-info rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors resize-none"
                                    required
                                ></textarea>
                            </div>

                            {/* Send Copy Checkbox */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="sendCopy"
                                    name="sendCopy"
                                    checked={formData.sendCopy}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-secondary border-info rounded focus:ring-secondary"
                                />
                                <label htmlFor="sendCopy" className="ml-3 text-sm text-neutral">
                                    Send me a copy of this message
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-secondary hover:bg-primary text-white py-3 px-6 rounded-lg font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div 
                        className="block p-8 transition border border-info shadow-xl rounded-xl hover:shadow-secondary hover:border-secondary"
                        variants={itemVariants}
                    >
                        <h2 className="text-2xl font-bold text-accent mb-6 pb-3 border-b border-info">Contact Information</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-secondary mb-2">Office Address</h3>
                                <p className="text-neutral">BVM Engineering College<br />Vallabh Vidyanagar,Gujarat 388120</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-secondary mb-2">Email</h3>
                                <p className="text-neutral">hetworkshard@quickmeds.com<br />rahul@quickmeds.com<br />sidd@quickmeds.com</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-secondary mb-2">Phone</h3>
                                <p className="text-neutral">+91 7485906699</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-secondary mb-2">Business Hours</h3>
                                <p className="text-neutral">Monday - Friday: 10:30 AM - 6:00 PM<br />Saturday: 10:30 AM - 2:00 PM</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default Contact;