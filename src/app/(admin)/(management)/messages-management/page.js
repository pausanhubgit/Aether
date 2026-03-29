"use client";
import React, { useEffect, useState } from "react";
import contactAPI from "@/api/contact";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { FaTrash, FaEnvelope, FaUser, FaPhone, FaHeading } from "react-icons/fa";

const MessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await contactAPI.getContacts();
            setMessages(response.data);
        } catch (error) {
            toast.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-slate-50 flex items-center gap-3">
                <FaEnvelope className="text-primary" /> Contact Messages
            </h1>

            <div className="grid grid-cols-1 gap-6">
                {messages.length > 0 ? messages.map((msg) => (
                    <div key={msg._id} className="bg-white dark:bg-[#160327] rounded-2xl p-6 border border-slate-200 dark:border-purple-900/40 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <FaUser size={14} /> <span>{msg.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-purple-300 text-sm">
                                    <FaEnvelope size={14} /> <span>{msg.email}</span>
                                </div>
                                {msg.phone && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-purple-300 text-sm">
                                        <FaPhone size={14} /> <span>{msg.phone}</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-400 dark:text-purple-500 font-medium">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 dark:border-purple-900/20 pt-4">
                            <h4 className="font-bold text-gray-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                                <FaHeading size={14} className="text-primary/70" /> {msg.subject}
                            </h4>
                            <p className="text-gray-600 dark:text-purple-100 text-sm leading-relaxed bg-slate-50 dark:bg-[#0f021b] p-4 rounded-xl italic">
                                "{msg.message}"
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white dark:bg-[#160327] rounded-2xl border border-slate-200 dark:border-purple-900/40">
                        <p className="text-gray-500 dark:text-purple-300">No messages found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
