"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, UserPlus } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getMyEnrollments } from "@/lib/services/enrollment";
import {
  getStudentById,
  sendConnectionRequest,
  sendDirectMessage,
} from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<"about" | "courses">("about");
  const [messageText, setMessageText] = useState("");
  const [showMsgBox, setShowMsgBox] = useState(false);

  const student = getStudentById(state, id as string);

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center bg-background">
        <h1 className="text-3xl font-bold font-display mb-2">
          Student not found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          This ULAB student profile could not be found.
        </p>
        <Link href="/students">
          <Button variant="default">Back to students</Button>
        </Link>
      </div>
    );
  }

  const enrollments = getMyEnrollments(state, student.id);

  const handleConnect = () => {
    if (!currentUser) {
      showToast("Please sign in to connect with peers.", "info");
      router.push("/signIn");
      return;
    }
    if (currentUser.id === student.id) {
      showToast("This is your own profile.", "info");
      return;
    }
    const res = sendConnectionRequest(state, dispatch, currentUser.id, student.id);
    showToast(res.message, res.ok ? "success" : "info");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please sign in to send messages.", "info");
      router.push("/signIn");
      return;
    }
    if (!messageText.trim()) return;
    sendDirectMessage(state, dispatch, {
      senderId: currentUser.id,
      recipientId: student.id,
      content: messageText,
    });
    setMessageText("");
    setShowMsgBox(false);
    showToast(`Message sent to ${student.name}!`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <Link
            href="/students"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to students
          </Link>

          <div className="flex items-center gap-5">
            <Avatar
              src={student.avatar}
              name={student.name}
              size="xl"
              department={student.department}
              avatarColor={student.avatarColor}
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge department={student.department}>
                  {student.department}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Batch {student.batch} · ID {student.studentId}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                {student.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {enrollments.length} enrolled course
                {enrollments.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 border-t border-border pt-4">
            {(
              [
                { id: "about", label: "About" },
                { id: "courses", label: `Courses (${enrollments.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 px-4 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {activeTab === "about" && (
            <Card className="p-6 sm:p-8 space-y-5">
              <div>
                <h2 className="text-xl font-bold font-display mb-2">About</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {student.bio ||
                    `ULAB ${student.department} student exploring courses and peer study groups.`}
                </p>
              </div>
              {student.interests && student.interests.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Academic interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {student.interests.map((interest) => (
                      <Badge key={interest} variant="neutral">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {activeTab === "courses" && (
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold font-display">
                Current courses ({enrollments.length})
              </h2>
              {enrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No public course enrollments listed yet.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {enrollments.map(({ course }) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      className="p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/40 transition"
                    >
                      <Badge department={course.department}>
                        {course.code}
                      </Badge>
                      <p className="font-semibold text-sm mt-2">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {course.credits} credits
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        <aside className="lg:col-span-4">
          <Card className="p-6 space-y-4">
            <h2 className="font-display font-bold text-lg">Peer actions</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate text-foreground">{student.email}</span>
            </div>
            <div className="space-y-2.5">
              <Button
                type="button"
                variant="accent"
                className="w-full"
                onClick={handleConnect}
              >
                <UserPlus className="w-4 h-4" />
                Send connect request
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowMsgBox(!showMsgBox)}
              >
                <MessageSquare className="w-4 h-4" />
                Message directly
              </Button>
            </div>

            {showMsgBox && (
              <form onSubmit={handleSendMessage} className="space-y-2.5 pt-2">
                <textarea
                  required
                  rows={3}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Write a message to ${student.name}...`}
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none"
                />
                <Button type="submit" className="w-full" size="sm">
                  Send message
                </Button>
              </form>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
