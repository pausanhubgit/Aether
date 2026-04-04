"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LEGAL_PAGES } from '@/constants/legalContent';
import { FiChevronRight, FiClock, FiArrowLeft, FiFileText, FiShield, FiTruck, FiRotateCcw } from 'react-icons/fi';

const LegalPage = () => {
    const { slug } = useParams();
    const page = LEGAL_PAGES[slug];

    if (!page) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">The legal document you are looking for does not exist.</p>
                <Link href="/">
                    <span className="inline-flex items-center gap-2 bg-primary !text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all cursor-pointer">
                        <FiArrowLeft /> Back to Home
                    </span>
                </Link>
            </div>
        );
    }

    const navItems = [
        { id: 'terms', label: 'Terms of Service', icon: <FiFileText /> },
        { id: 'privacy', label: 'Privacy Policy', icon: <FiShield /> },
        { id: 'shipping', label: 'Shipping Policy', icon: <FiTruck /> },
        { id: 'returns', label: 'Return Policy', icon: <FiRotateCcw /> },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Sticky Sidebar Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">Legal Center</h3>
                    {navItems.map((item) => (
                        <Link 
                            key={item.id} 
                            href={`/legal/${item.id}`}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                slug === item.id 
                                ? 'bg-primary shadow-lg shadow-primary/20 scale-105' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#160327] hover:text-primary transition'
                            }`}
                        >
                            <span className={`${slug === item.id ? '!text-white' : ''} text-lg`}>{item.icon}</span>
                            <span className={`${slug === item.id ? '!text-white font-bold' : 'font-semibold'} text-sm`}>{item.label}</span>
                            {slug === item.id && <FiChevronRight className="ml-auto text-xs !text-white" />}
                        </Link>
                    ))}
                    
                    <div className="mt-12 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 hidden lg:block">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                            Need help with something else? Reach out to our support team.
                        </p>
                        <Link href="/contact" className="text-xs font-bold text-primary hover:underline">Contact Support →</Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <article className="flex-1 min-w-0">
                <div className="bg-white dark:bg-[#160327] rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-purple-900/40">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-10 border-b border-gray-100 dark:border-purple-900/20">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
                                {page.title}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                <FiClock className="text-primary" />
                                <span>Last Updated: <strong>{page.lastUpdated}</strong></span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                        prose-p:text-gray-600 dark:prose-p:text-purple-200/70 prose-p:leading-relaxed prose-p:mb-6
                        prose-strong:text-gray-900 dark:prose-strong:text-white
                        prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6
                    "
                    dangerouslySetInnerHTML={{ __html: page.content }} />

                    <div className="mt-16 pt-10 border-t border-gray-100 dark:border-purple-900/20 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Questions about our {page.title}? We&apos;re here to help.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                             <Link href="/contact" className="hover:shadow-lg transition-all">
                                <span className="inline-block px-8 py-3 bg-primary !text-white rounded-full font-bold shadow-sm shadow-primary/30">
                                    Contact Us
                                </span>
                            </Link>
                            <Link href="/">
                                <span className="inline-block px-8 py-3 bg-primary !text-white rounded-full font-bold hover:shadow-lg transition-all cursor-pointer">
                                    Back to Home
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default LegalPage;
