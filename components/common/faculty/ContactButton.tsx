"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";
import ContactModal from "./ContactModal";

interface ContactButtonProps {
    facultyName: string;
    facultyEmail: string;
}

export default function ContactButton({
    facultyName,
    facultyEmail,
}: ContactButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
                <Mail className="w-4 h-4" />
                Contact Me
            </button>
            <ContactModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                facultyName={facultyName}
                facultyEmail={facultyEmail}
            />
        </>
    );
}
