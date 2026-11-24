"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import ConnectModal from "./ConnectModal";
import type { User as PeerUser } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentCard({ student }: { student: PeerUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-card border border-border rounded-2xl p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4 h-full">
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <Avatar
              src={student.avatar}
              name={student.name}
              size="md"
              department={student.department}
              avatarColor={student.avatarColor}
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-semibold text-base text-foreground truncate">
                {student.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                ID {student.studentId ?? "ULAB"} · Batch {student.batch ?? "241"}
              </p>
              <div className="mt-1.5">
                <Badge department={student.department}>
                  {student.department ?? "CSE"}
                </Badge>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {student.bio ||
              `ULAB ${student.department} student open to study groups and peer advising.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Connect
          </Button>
          <Link href={`/students/${student.id}`}>
            <Button variant="default" size="sm" className="w-full">
              View profile
            </Button>
          </Link>
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
