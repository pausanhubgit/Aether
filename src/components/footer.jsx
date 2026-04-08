"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import instaIcon from "@/assets/images/s_media/insta.png";
import facebookIcon from "@/assets/images/s_media/image.png";
import twitterIcon from "@/assets/images/s_media/twitter.png";
import youtubeIcon from "@/assets/images/s_media/youtube.png";
import khaltiIcon from "@/assets/images/payment/khalti.png";
import stripeIcon from "@/assets/images/payment/stripe.png";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-[#0d0118] text-black dark:text-slate-50 py-8 sm:py-12 border-t border-purple-100 dark:border-purple-900/40 transition-colors duration-300">
            <div className="container-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                    <div className="lg:col-span-1">
                        <h3 className="font-bold text-black dark:text-slate-50 mb-4 text-xl">Aether Hub</h3>
                        <p className="text-gray-600 dark:text-purple-300 text-sm leading-relaxed">Your ultimate destination for arts, music, and videos. Discover unique artworks, enjoy melodious tunes, and watch captivating videos all in one place. Join our community of creators and enthusiasts.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 dark:text-slate-50">Quick Links</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link href="/" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/about" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="/contact" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/dashboard-home" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 dark:text-slate-50">Legal</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><Link href="/legal/terms" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/privacy" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/shipping" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/legal/returns" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Return Policy</Link></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className="font-bold mb-4 dark:text-slate-50">Payments Accepted</h4>
                        <p className="text-sm text-gray-600 dark:text-purple-300 mb-4 font-medium">We support secure payments through verified mobile and card gateways.</p>
                        <div className="flex items-center gap-6 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-200 dark:border-purple-900/40 mb-6">
                            <Image src={khaltiIcon} alt="Khalti" className="h-8 w-auto object-contain" />
                            <Image src={stripeIcon} alt="Stripe" className="h-8 w-auto object-contain" />
                            <div className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest">+ COD</div>
                        </div>
                        
                        <h4 className="font-bold mb-4 dark:text-slate-50 mt-4">Connect With Us</h4>
                        <div className="flex space-x-4 items-center">
                            <Link href="#" className="hover:scale-110 transition-transform">
                                <Image src={facebookIcon} alt="Facebook" className="w-7 h-7 object-contain" />
                            </Link>
                            <Link href="#" className="hover:scale-110 transition-transform">
                                <Image src={twitterIcon} alt="Twitter" className="w-7 h-7 object-contain" />
                            </Link>
                            <Link href="#" className="hover:scale-110 transition-transform">
                                <Image src={instaIcon} alt="Instagram" className="w-7 h-7 object-contain" />
                            </Link>
                            <Link href="#" className="hover:scale-110 transition-transform">
                                <Image src={youtubeIcon} alt="YouTube" className="w-7 h-7 object-contain" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-gray-200 dark:border-purple-900/40">
                    <p className="text-sm font-medium dark:text-purple-300/60">&copy; {new Date().getFullYear()} Aether Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;