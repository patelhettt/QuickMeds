import React from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { RiArrowRightCircleFill } from 'react-icons/ri';
import DefaultNavbar from '../components/DefaultNavbar';
import Footer from '../components/Footer';

const Pricing = () => {
    const pricing = [
        {
            "id": 1,
            "planName": "Basic",
            "price": "$199/mo",
            "features": ['Centralized medicine inventory', 'Order management system', 'Basic revenue tracking', 'Single warehouse support', 'Standard reporting', 'Email support'],
            "description": "Perfect for small pharmacies and medical stores. Manage your inventory, process orders, and track basic revenue metrics with our starter plan."
        },
        {
            "id": 2,
            "planName": "Professional",
            "price": "$349/mo",
            "features": ['Advanced inventory management', 'Multi-store order processing', 'Comprehensive revenue analytics', 'Up to 5 sub-admin accounts', 'Expiry date tracking', 'Priority customer support'],
            "description": "Designed for growing pharmacy chains. Coordinate between warehouse and multiple local stores with advanced tracking and management features."
        },
        {
            "id": 3,
            "planName": "Enterprise",
            "price": "$599/mo",
            "features": ['Unlimited medicine inventory', 'Unlimited sub-admin accounts', 'Real-time sales & revenue dashboard', 'Advanced security features', 'Custom reporting', 'Dedicated account manager'],
            "description": "The complete solution for large pharmaceutical distributors. Manage unlimited inventory across multiple warehouses and local stores with premium support."
        },
    ]
    return (
        <div>
            <DefaultNavbar />
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-20">
                        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-secondary">QuickMeds Pricing Plans</h1>

                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">Choose the right plan for your medicine warehouse and local store management needs. Scale as your business grows.</p>

                        <div className="flex mx-auto border-2 border-primary rounded overflow-hidden mt-6">
                            <button className="py-1 px-4 bg-primary text-white focus:outline-none">Monthly</button>
                            <button className="py-1 px-4 focus:outline-none">Annually</button>
                        </div>
                    </div>

                    <div className="flex flex-wrap -m-4">
                        {
                            pricing.map(p =>
                                <div key={p.id} className="p-4 xl:w-2/6 md:w-1/2 w-full hover:shadow-lg hover:shadow-secondary">
                                    <div className="h-full p-6 rounded-lg border-2 border-info flex flex-col relative overflow-hidden">
                                        <h2 className="text-sm tracking-widest title-font mb-1 font-medium uppercase">{p.planName}</h2>
                                        <h1 className="text-5xl text-gray-900 pb-4 mb-4 border-b border-gray-200 leading-none">{p.price}</h1>

                                        {
                                            p.features.map((f, index) =>
                                                <p key={index} className="flex items-center text-gray-600 mb-2">
                                                    <RiArrowRightCircleFill className='text-xl text-primary mr-2' />
                                                    {f}
                                                </p>)
                                        }

                                        <button className="flex items-center justify-between text-white bg-secondary border-0 py-2 px-4 w-full focus:outline-none hover:bg-primary rounded my-4">Get Started
                                            <FaLongArrowAltRight />
                                        </button>

                                        <p className="text-xs text-gray-500 mt-3">{p.description}</p>
                                    </div>
                                </div>)
                        }
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Pricing;