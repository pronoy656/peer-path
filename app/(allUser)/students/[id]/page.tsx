"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Hash,
  Mail,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getMyEnrollments } from "@/lib/services/enrollment";
import {
  getStudentById,
  sendConnectionRequest,
  sendDirectMessage,
} from "@/lib/services/people";
import { Card } from "@/components/ui/card";

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [messageText, setMessageText] = useState("");
  const [showMsgBox, setShowMsgBox] = useState(false);

  const student = getStudentById(state, id as string);

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Student Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This ULAB student profile could not be found.
        </p>
        <Link
          href="/students"
          className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          Back to Students
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
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/students"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 h-fit">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-200 flex items-center justify-center text-3xl font-bold text-amber-800 mb-4">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-sm font-semibold text-amber-700 mt-1">
              {student.department} • Batch {student.batch}
            </p>
          </div>

          <div className="space-y-3 text-sm border-t pt-4 mb-6">
            {student.studentId && (
              <div className="flex items-center gap-2 text-gray-600">
                <Hash className="w-4 h-4 text-gray-400" />
                <span>ID: {student.studentId}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate">{student.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Batch {student.batch}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleConnect}
              className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-semibold flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Connect
            </button>
            <button
              type="button"
              onClick={() => setShowMsgBox(!showMsgBox)}
              className="w-full py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </button>
          </div>

          {showMsgBox && (
            <form onSubmit={handleSendMessage} className="mt-4 space-y-2">
              <textarea
                required
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Write a message to ${student.name}...`}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold"
              >
                Send Message
              </button>
            </form>
          )}
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {student.bio ||
                `ULAB ${student.department} student exploring courses and peer study groups.`}
            </p>
            {student.interests && student.interests.length > 0 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Academic Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 rounded-full bg-yellow-100 text-amber-900 text-xs font-semibold"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Current Courses ({enrollments.length})
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
                    className="p-4 rounded-xl border hover:border-primary hover:bg-primary/5 transition"
                  >
                    <p className="text-xs font-bold text-primary">
                      {course.code}
                    </p>
                    <p className="font-semibold text-foreground mt-0.5">
                      {course.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {course.department} • {course.credits} Credits
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
