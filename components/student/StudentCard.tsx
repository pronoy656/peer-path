"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Hash, BookOpen, Calendar, MessageSquare, User } from "lucide-react";
import ConnectModal from "./ConnectModal";
import type { User as PeerUser } from "@/lib/types";

export default function StudentCard({ student }: { student: PeerUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 text-xl font-bold border-2 border-yellow-200 shrink-0">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight truncate group-hover:text-amber-600 transition-colors">
                {student.name}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {student.department || "ULAB"} • Batch {student.batch || "241"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 flex-1">
          {student.studentId && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Hash className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="font-medium bg-gray-50 px-2 py-0.5 rounded text-gray-700">
                {student.studentId}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{student.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Department of {student.department || "CSE"}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>Batch {student.batch || "241"}</span>
          </div>

          {student.interests && student.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {student.interests.slice(0, 3).map((interest) => (
                <span
                  key={interest}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-50 text-amber-800 border border-yellow-200 font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
          <Link
            href={`/students/${student.id}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 text-sm"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2.5 px-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Connect
          </button>
        </div>
      </div>

      <ConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={student}
      />
    </>
  );
}
