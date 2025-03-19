import React from 'react';
import { BsGithub, BsLinkedin, BsFacebook } from 'react-icons/bs';
import { motion } from 'framer-motion';
import het from '../Assets/Images/het.jpeg';
import rahul from '../Assets/Images/rahul.jpg';
import sidd from '../Assets/Images/sidd.jpg';
import DefaultNavbar from '../components/DefaultNavbar';
import Footer from '../components/Footer';

const About = () => {
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

    return (
        <div className="text-accent">
            <DefaultNavbar />
            
            <section className="hero min-h-[50vh] bg-info">
                <div className="hero-content text-center">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl font-bold mb-4">
                            Meet Our <span className="text-secondary">Development Team</span>
                        </h1>
                        <p className="text-xl text-neutral max-w-2xl mx-auto">
                            Passionate developers building innovative solutions for modern healthcare management
                        </p>
                    </div>
                </div>
            </section>

            <motion.div 
                className="container mx-auto px-4 py-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                >
                    {/* Team Member 1 */}
                    <motion.div 
                        className="block p-6 transition border border-info shadow-xl rounded-xl hover:shadow-secondary hover:border-secondary"
                        variants={itemVariants}
                    >
                        <div className="relative mb-6">
                            <img src={het} className="w-full h-96 object-cover rounded-lg transition-transform duration-500 hover:scale-105" alt="Het Patel" />
                            <div className="absolute inset-0 bg-gradient-to-t from-info/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-accent mb-2">Het Patel</h3>
                            <p className="text-secondary font-medium mb-4">Full Stack Developer</p>
                            <p className="text-neutral mb-6">
                                Lead developer responsible for system architecture, backend implementation, and frontend development.
                            </p>
                            <div className="flex justify-center space-x-4 text-secondary">
                                <a href="https://github.com/patelhettt" className="hover:text-primary transform hover:scale-110 transition-all hover:-translate-y-1">
                                    <BsGithub size={24} />
                                </a>
                                <a href="https://www.linkedin.com/in/hetpatel9" className="hover:text-primary transform hover:scale-110 transition-all hover:-translate-y-1">
                                    <BsLinkedin size={24} />
                                </a>
                                <a href="https://www.facebook.com/AwesomeHet1/" className="hover:text-primary transform hover:scale-110 transition-all hover:-translate-y-1">
                                    <BsFacebook size={24} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Team Member 2 */}
                    <motion.div 
                        className="block p-6 transition border border-info shadow-xl rounded-xl hover:shadow-secondary hover:border-secondary"
                        variants={itemVariants}
                    >
                        <div className="relative mb-6">
                            <img src={rahul} className="w-full h-96 object-cover rounded-lg transition-transform duration-500 hover:scale-105" alt="Rahul" />
                            <div className="absolute inset-0 bg-gradient-to-t from-info/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-accent mb-2">Rahul</h3>
                            <p className="text-secondary font-medium mb-4">Frontend Developer</p>
                            <p className="text-neutral mb-6">
                                Specialized in creating responsive UI components and implementing user-friendly interfaces.
                            </p>
                            <div className="flex justify-center space-x-4 text-secondary">
                                <a href="#" className="hover:text-primary transform hover:scale-110 transition-all hover:-translate-y-1">
                                    <BsGithub size={24} />
                                </a>
                                <a href="#" className="hover:text-primary transform hover:scale-110 transition-all hover:-translate-y-1">
                                    <BsLinkedin size={24} />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Team Member 3 */}
                    <motion.div 
                        className="block p-6 transition border border-info shadow-xl rounded-xl hover:shadow-secondary hover:border-secondary"
                        variants={itemVariants}
                    >
                        <div className="relative mb-6">
                            <img src={sidd} className="w-full h-96 object-cover rounded-lg transition-transform duration-500 hover:scale-105" alt="Sidd" />
                            <div className="absolute inset-0 bg-gradient-to-t from-info/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-accent mb-2">Sidd</h3>
                            <p className="text-secondary font-medium mb-4">Backend Developer</p>
                            <p className="text-neutral mb-6">
                                Focused on database management, API development, and system optimization.
                            </p>
                            <div className="flex justify-center space-x-4 text-secondary">
                                <a href="#" className="hover:text-primary transform hover:scale-110 transition-all hover:-translate-y-1">
                                    <BsGithub size={24} />
                                </a>
                                <a href="#" className="hover:text-primary transform hover:scale-110 transition-all hover:-translate-y-1">
                                    <BsLinkedin size={24} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
            
            <Footer />
        </div>
    );
};

export default About;