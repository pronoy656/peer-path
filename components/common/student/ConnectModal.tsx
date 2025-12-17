"use client";

import React from "react";
import { X, Linkedin, Facebook, Mail, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
}

export default function ConnectModal({
    isOpen,
    onClose,
    studentName,
}: ConnectModalProps) {
    if (!isOpen) return null;

    const socialLinks = [
        {
            name: "LinkedIn",
            icon: <Linkedin className="w-6 h-6 text-blue-600" />,
            color: "bg-blue-50 hover:bg-blue-100",
            textColor: "text-blue-700",
            action: () => console.log("Connect via LinkedIn"),
        },
        {
            name: "Facebook",
            icon: <Facebook className="w-6 h-6 text-blue-500" />,
            color: "bg-blue-50 hover:bg-blue-100",
            textColor: "text-blue-600",
            action: () => console.log("Connect via Facebook"),
        },
        {
            name: "Email",
            icon: <Mail className="w-6 h-6 text-red-500" />,
            color: "bg-red-50 hover:bg-red-100",
            textColor: "text-red-600",
            action: () => console.log("Connect via Email"),
        },
        {
            name: "WhatsApp",
            icon: <MessageCircle className="w-6 h-6 text-green-500" />,
            color: "bg-green-50 hover:bg-green-100",
            textColor: "text-green-600",
            action: () => console.log("Connect via WhatsApp"),
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-yellow-400 p-6 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-black transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <h2 className="text-xl font-bold text-black mb-1">
                                    Connect with
                                </h2>
                                <p className="text-black/80 font-medium truncate">
                                    {studentName}
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-3">
                                {socialLinks.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={link.action}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border border-transparent ${link.color} group`}
                                    >
                                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                            {link.icon}
                                        </div>
                                        <span className={`font-semibold ${link.textColor}`}>
                                            {link.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
