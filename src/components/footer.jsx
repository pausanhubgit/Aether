"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import subscriberAPI from "@/api/subscriber";
import facebookIcon from "@/assets/images/s_media/image.png";
import instaIcon from "@/assets/images/s_media/insta.png";
import twitterIcon from "@/assets/images/s_media/twitter.png";
import youtubeIcon from "@/assets/images/s_media/youtube.png";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await subscriberAPI.subscribe(email);
            toast.success("Subscribed successfully! Thank you for joining our newsletter.");
            setEmail("");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to subscribe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-white dark:bg-[#0d0118] text-black dark:text-slate-50 py-8 sm:py-12 mt-10 border-t border-purple-100 dark:border-purple-900/40 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
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
                            <li><Link href="/terms" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/shipping" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/returns" className="text-gray-600 dark:text-purple-300 hover:text-primary transition-colors">Return Policy</Link></li>
                        </ul>
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className="font-bold mb-4 dark:text-slate-50">Newsletter</h4>
                        <p className="text-sm text-gray-600 dark:text-purple-300 mb-4 font-medium">Subscribe to receive updates on new artworks, music releases, and exclusive offers.</p>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address" 
                                required
                                className="flex-grow px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-purple-900/40 bg-white dark:bg-[#0f021b] text-slate-800 dark:text-slate-50 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {loading ? "..." : "Join"}
                            </button>
                        </form>
                        <div className="flex space-x-4 items-center mt-8">
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