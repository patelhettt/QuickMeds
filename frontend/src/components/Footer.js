import React from 'react';
import { AiFillLinkedin, AiFillGithub, AiFillFacebook } from 'react-icons/ai';
import logo from '../Assets/logo.png';

const Footer = () => {
    const footerLinks = [
        {
            "id": 1,
            "sectionName": "Services",
            "links": [
                {
                    "id": 1,
                    "link": "",
                    "linkName": "Warehouse Management"
                },
                {
                    "id": 2,
                    "link": "",
                    "linkName": "Inventory Tracking"
                },
                {
                    "id": 3,
                    "link": "",
                    "linkName": "Local Store Support"
                },
                {
                    "id": 4,
                    "link": "",
                    "linkName": "Revenue Analysis"
                },
                {
                    "id": 5,
                    "link": "",
                    "linkName": "Order Processing"
                }
            ]
        },
        {
            "id": 2,
            "sectionName": "Company",
            "links": [
                {
                    "id": 1,
                    "link": "",
                    "linkName": "About QuickMeds"
                },
                {
                    "id": 2,
                    "link": "/about",
                    "linkName": "Our Team"
                },
                {
                    "id": 3,
                    "link": "",
                    "linkName": "Our Mission"
                },
                {
                    "id": 4,
                    "link": "",
                    "linkName": "Careers"
                }
            ]
        },
        {
            "id": 3,
            "sectionName": "Support",
            "links": [
                {
                    "id": 1,
                    "link": "",
                    "linkName": "Contact Us"
                },
                {
                    "id": 2,
                    "link": "",
                    "linkName": "FAQs"
                },
                {
                    "id": 3,
                    "link": "",
                    "linkName": "Technical Support"
                }
            ]
        },
        {
            "id": 4,
            "sectionName": "Legal",
            "links": [
                {
                    "id": 1,
                    "link": "",
                    "linkName": "Terms of Service"
                },
                {
                    "id": 2,
                    "link": "",
                    "linkName": "Refund Policy"
                },
                {
                    "id": 3,
                    "link": "",
                    "linkName": "Privacy Statement"
                },
                {
                    "id": 4,
                    "link": "",
                    "linkName": "Compliance Info"
                }
            ]
        },
        {
            "id": 5,
            "sectionName": "Resources",
            "links": [
                {
                    "id": 1,
                    "link": "",
                    "linkName": "User Manuals"
                },
                {
                    "id": 2,
                    "link": "",
                    "linkName": "Training Videos"
                }
            ]
        },
    ];

    const socialMediaLinks = [
        {
            "id": 1,
            "name": "LinkedIn",
            "link": "https://www.linkedin.com/",
            "icon": <AiFillLinkedin />
        },
        {
            "id": 2,
            "name": "GitHub",
            "link": "https://github.com/",
            "icon": <AiFillGithub />
        },
        {
            "id": 3,
            "name": "Facebook",
            "link": "https://www.facebook.com/",
            "icon": <AiFillFacebook />
        }
    ];

    const bottomLinks = [
        {
            "id": 1,
            "name": "Terms & Conditions",
            "link": "terms-and-conditions"
        },
        {
            "id": 2,
            "name": "Privacy Policy",
            "link": "privacy-policy"
        },
        {
            "id": 3,
            "name": "Cookies Policy",
            "link": "cookies-policy"
        }
    ];

    return (
        <footer className="bg-gray-900">
            <div className="max-w-screen-xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
                <div className="lg:flex lg:gap-8">
                    <div className="lg:block md:hidden hidden">
                        <a href='/'>
                            <img
                                width={85}
                                height={85}
                                src={logo}
                                alt="QuickMeds logo" />
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16">
                        <div className="col-span-2">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Stay updated on inventory!
                                </h2>

                                <p className="mt-6 text-gray-400">
                                    Subscribe to our newsletter for inventory updates, new medicines, and exclusive warehouse deals.
                                </p>
                            </div>
                        </div>

                        <div className="col-span-2 lg:col-span-3 lg:flex lg:items-end">
                            <form className="w-full text-white">
                                <label htmlFor="email" className="sr-only"> Email </label>

                                <div className="p-2 border sm:flex sm:items-center border-white/10">
                                    <input className="w-full h-12 p-3 text-sm font-medium tracking-widest placeholder-gray-400 uppercase bg-transparent border-none" type="email" id="email" placeholder="Enter your email" />

                                    <button className="w-full h-12 px-6 py-3 mt-1 text-sm font-bold tracking-wide uppercase bg-secondary sm:ml-4 sm:flex-shrink-0 sm:w-auto sm:mt-0" type="submit">
                                        Subscribe
                                    </button>
                                </div>
                            </form>
                        </div>

                        {
                            footerLinks.map(footerLink =>
                                <div key={footerLink.id} className="col-span-2 pt-6 border-t sm:col-span-1 border-white/10">
                                    <p className="font-bold text-white"> {footerLink.sectionName} </p>

                                    <nav className="flex flex-col mt-6 space-y-4 text-sm text-gray-300">
                                        {
                                            footerLink.links.map(link => <a key={link.id} className="inline-block hover:text-secondary" href={link.link}> {link.linkName} </a>)
                                        }
                                    </nav>
                                </div>)
                        }

                        <div className="flex col-span-2 space-x-4 text-gray-300 lg:col-span-5">
                            {
                                socialMediaLinks.map(socialMediaLink =>
                                    <a key={socialMediaLink.id} className="hover:text-secondary" href={socialMediaLink.link} target="_blank" rel="noreferrer">
                                        <span className="sr-only"> {socialMediaLink.name} </span>

                                        <span className='text-2xl'>
                                            {socialMediaLink.icon}
                                        </span>
                                    </a>)
                            }
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-12 border-t border-white/10">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <p className="text-xs text-center text-gray-400 hover:text-secondary lg:text-left">
                            Copyright &copy; 2025. QuickMeds. All rights reserved.
                        </p>

                        <nav className="flex justify-center space-x-4 text-gray-400 text-xs lg:justify-end">
                            {
                                bottomLinks.map(bottomLink => <a key={bottomLink.id} href={bottomLink.link}>
                                    <span className='hover:text-secondary'>
                                        {bottomLink.name}
                                    </span>
                                </a>)
                            }
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;