"use client";

import React, { useState } from "react";
import { Mail, Hash, BookOpen, Calendar, MessageSquare } from "lucide-react";
import ConnectModal from "./ConnectModal";

export interface StudentProps {
  id: string; // Internal ID
  name: string;
  email: string;
  studentId: string; // The display ID e.g., 223014073
  department: string;
  batch: string;
}

export default function StudentCard({
  name,
  email,
  studentId,
  department,
  batch,
}: StudentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-xl font-bold border-2 border-yellow-200 group-hover:scale-105 transition-transform duration-300">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-yellow-600 transition-colors">
                {name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">Student</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="font-medium bg-gray-50 px-2 py-0.5 rounded text-gray-700">
              {studentId}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="truncate">{email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span>{department}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Batch {batch}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-50">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Connect
          </button>
        </div>
      </div>

      <ConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentName={name}
      />
    </>
  );
}
