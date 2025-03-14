import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { BiDesktop } from 'react-icons/bi';
import { CgChevronDownR } from 'react-icons/cg';
import { FaReact, FaNodeJs, FaLongArrowAltRight, FaMedkit, FaWarehouse, FaStore } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { MdSecurity, MdInventory, MdMonitorWeight } from 'react-icons/md';
import { SiMongodb, SiHackthebox } from 'react-icons/si';
import DefaultNavbar from '../components/DefaultNavbar';
import Footer from '../components/Footer';

export default function Home() {
    const features = [
        {
            id: 1,
            icon: <MdInventory />,
            title: "Centralized Inventory",
            description: "Real-time tracking of medicine stock levels."
        },
        {
            id: 2,
            icon: <FaWarehouse />,
            title: "Warehouse Management",
            description: "Efficiently manage your main medicine warehouse."
        },
        {
            id: 3,
            icon: <FaStore />,
            title: "Local Store Management",
            description: "Track performance of all sub-branches in one place."
        },
        {
            id: 4,
            icon: <FaMedkit />,
            title: "Medicine Ordering",
            description: "Seamless ordering system for local stores."
        },
        {
            id: 5,
            icon: <MdMonitorWeight />,
            title: "Custom Pricing & Margins",
            description: "Set flexible pricing strategies for each store"
        },
        {
            id: 6,
            icon: <MdSecurity />,
            title: "Secure Role-Based Access",
            description: "Different access levels for warehouse and store staff."
        }
    ];

    const summary = [
        {
            id: 1,
            number: 10000,
            name: "Medicines Managed"
        },
        {
            id: 2,
            number: 100,
            name: "Local Stores Connected"
        },
        {
            id: 3,
            number: 24,
            name: "Hour Support"
        }
    ];

    const reviews = [
        {
            id: 1,
            icon: "",
            title: "Store Type: Hospital Pharmacy",
            description: "QuickMeds has transformed how we manage our hospital pharmacy. The centralized ordering system saves hours each week, and we always know exactly what's in stock at the warehouse.",
            reviewer: "City Medical Center"
        },
        {
            id: 2,
            icon: "",
            title: "Store Type: Retail Pharmacy",
            description: "I can check inventory levels, place orders, and track revenue from anywhere. The margin setting feature has helped us optimize pricing for different neighborhoods while maintaining profitability.",
            reviewer: "HealthFirst Pharmacy"
        },
        {
            id: 3,
            icon: "",
            title: "Store Type: Online Pharmacy",
            description: "QuickMeds integrates perfectly with our online store. We're never out of stock since we can see real-time inventory from our warehouse, and processing offline sales is simple for our staff.",
            reviewer: "MediDirect"
        }
    ];

    const faqs = [
        {
            id: 1,
            title: "How does the medicine ordering system work?",
            description: "The ordering system allows local store owners (sub-admins) to view the main warehouse inventory and place orders directly. The warehouse admin (super admin) receives notifications of new orders, approves them, and updates the system once fulfilled. This ensures seamless stock transfer between warehouse and local stores."
        },
        {
            id: 2,
            title: "Can I set different prices for different stores?",
            description: "Yes, QuickMeds allows sub-admins to set custom pricing with flexible margins for each medicine in their local store. You can adjust prices based on local market conditions, competition, and customer demographics while the system automatically calculates your profit margins."
        },
        {
            id: 3,
            title: "How are offline sales recorded in the system?",
            description: "Store staff can record offline sales through a simple interface. Each transaction updates your local inventory and syncs with the central database. The system generates daily, weekly, and monthly revenue reports, allowing warehouse admins to track performance across all stores."
        }
    ];

    return (
        <div>
            <DefaultNavbar />
            <div className='text-accent'>
                <section className="hero min-h-screen bg-info">
                    <div className="hero-content text-center">
                        <div className="max-w-4xl">
                            <button className="btn border-0 rounded-full bg-base-100 mb-8 text-accent px-8 font-bold text-md hover:bg-base-100">
                                <CgChevronDownR className='mr-4 text-xl text-secondary' />
                                Medicine Management
                            </button>
                            <h1 className="text-6xl font-bold text-accent"><span className='text-secondary'>Medicine warehouse</span> management that's seamless, easy and efficient.</h1>
                            <p className="py-6 text-neutral text-lg">Our MERN stack platform empowers medicine warehouses and local stores with real-time inventory tracking, simplified ordering, and comprehensive revenue analytics.</p>
                            <a href='pricing' className="btn btn-primary border-0 bg-secondary hover:bg-primary text-base-100">Get Started</a>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
                        <div className="max-w-xl mx-auto text-center">
                            <h2 className="text-3xl font-bold sm:text-4xl">Features of QuickMeds</h2>

                            <p className="mt-4 text-neutral">
                                QuickMeds provides powerful features to streamline medicine warehouse and local store operations. Discover how our platform can transform your pharmaceutical business.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3">
                            {
                                features.map(feature => (
                                    <a key={feature.id}
                                        className="block p-8 transition border border-info shadow-xl rounded-xl hover:shadow-secondary hover:border-secondary"
                                        href="/services/digital-campaigns"
                                    >
                                        <span className='text-secondary text-4xl'>
                                            {feature.icon}
                                        </span>

                                        <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>

                                        <p className="mt-1 text-sm text-neutral">
                                            {feature.description}
                                        </p>
                                    </a>
                                ))
                            }
                        </div>

                        <div className="mt-12 text-center">
                            <a
                                className="inline-flex items-center px-8 py-3 mt-8 text-white bg-secondary border-0 rounded hover:bg-primary"
                                href="/get-started"
                            >
                                <span className="text-sm font-medium"> Learn More </span>

                                <svg
                                    className="w-5 h-5 ml-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* start summary */}
                <section className='max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8 mb-32'>
                    <ul
                        className='mt-8 border-2 border-secondary border-opacity-25 divide-y-2 divide-secondary sm:grid sm:divide-y-0 sm:divide-x-2 sm:border-l-0 sm:border-r-0 divide-opacity-25 sm:grid-cols-3 text-center'
                    >
                        {
                            summary.map((s, index) => (
                                <li key={index} className='p-8'>
                                    <p className='text-3xl font-extrabold text-secondary'>{s.number}+</p>
                                    <p className='mt-1 text-xl font-medium'>{s.name}</p>
                                </li>
                            ))
                        }
                    </ul>
                </section>
                {/* end summary */}

                <section className="bg-gray-100">
                    <div className="px-4 py-16 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
                        <div className="items-end justify-between sm:flex">
                            <div className="max-w-xl">
                                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Read trusted reviews from our pharmacy partners</h2>

                                <p className="max-w-lg mt-8 text-gray-500">
                                    Here's what pharmacy owners and medicine retailers are saying about QuickMeds. See how our platform is transforming medicine management across the industry.
                                </p>
                            </div>

                            <a
                                className="inline-flex items-center flex-shrink-0 px-5 py-3 mt-8 font-medium bg-secondary text-white border-0 rounded-full sm:mt-0 lg:mt-8"
                                href=""
                            >
                                Read all reviews

                                <FaLongArrowAltRight className='text-xl ml-4' />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                            {
                                reviews.map(review => (
                                    <blockquote key={review.id} className="flex flex-col justify-between h-full p-12 bg-white">
                                        <div>
                                            <div className="flex space-x-0.5 text-primary">
                                                <AiFillStar />
                                                <AiFillStar />
                                                <AiFillStar />
                                                <AiFillStar />
                                                <AiFillStar />
                                            </div>

                                            <div className="mt-4">
                                                <h5 className="text-xl font-bold text-secondary sm:text-2xl">{review.title}</h5>

                                                <p className="mt-4 text-gray-600">
                                                    {review.description}
                                                </p>
                                            </div>
                                        </div>

                                        <footer className="mt-8 text-gray-500"> - {review.reviewer}</footer>
                                    </blockquote>
                                ))
                            }
                        </div>
                    </div>
                </section>

                <section className="bg-gray-100">
                    <div className="px-4 py-16 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
                        <div className="items-end justify-between sm:flex">
                            <div className="max-w-3xl">
                                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Frequently Asked Questions</h2>

                                <p className="max-w-lg mt-8 text-gray-500">
                                    Learn about how QuickMeds can transform your medicine warehouse and local store operations. Can't find your answer? Contact our team for personalized support.
                                </p>
                            </div>

                            <a
                                className="inline-flex items-center flex-shrink-0 px-5 py-3 mt-8 font-medium bg-secondary text-white border-0 rounded-full sm:mt-0 lg:mt-8"
                                href=""
                            >
                                View all FAQs

                                <FaLongArrowAltRight className='text-xl ml-4' />
                            </a>
                        </div>

                        <div className="space-y-4 mt-20">
                            {
                                faqs.map(faq => (
                                    <details key={faq.id} className="p-6 border-l-4 border-secondary bg-gray-50 group">
                                        <summary className="flex items-center justify-between cursor-pointer">
                                            <h5 className="text-lg font-medium text-gray-900">
                                                {faq.title}
                                            </h5>

                                            <span
                                                className="flex-shrink-0 ml-1.5 p-1 text-secondary bg-white rounded-full sm:p-2"
                                            >
                                                <FiPlusCircle className='text-xl' />
                                            </span>
                                        </summary>

                                        <p className="mt-4 leading-relaxed text-gray-700">
                                            {faq.description}
                                        </p>
                                    </details>
                                ))
                            }
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}