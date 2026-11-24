"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Briefcase,
  MessageCircle,
  Send,
  Star,
  UserCheck,
} from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import {
  getAlumniById,
  getJobs,
  requestMentorship,
  sendDirectMessage,
} from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AlumniProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast } = useAppStore();

  const [mentorNote, setMentorNote] = useState("");
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [showMsgForm, setShowMsgForm] = useState(false);

  const alumni = getAlumniById(state, id as string);

  if (!alumni) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Alumni Mentor Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This alumni profile does not exist.
        </p>
        <Link
          href="/alumni"
          className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          Back to Alumni Directory
        </Link>
      </div>
    );
  }

  const postedJobs = getJobs(state).filter((j) => j.postedById === alumni.id);

  const handleRequestMentorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please sign in to request mentorship.", "info");
      router.push("/signIn");
      return;
    }
    const res = requestMentorship(state, dispatch, {
      studentId: currentUser.id,
      alumniId: alumni.id,
      message:
        mentorNote.trim() ||
        "Hi! I would love to learn from your experience and seek career advice.",
    });
    showToast(res.message, res.ok ? "success" : "info");
    if (res.ok) {
      setMentorNote("");
      setShowMentorForm(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please sign in to message alumni.", "info");
      router.push("/signIn");
      return;
    }
    if (!msgText.trim()) return;
    sendDirectMessage(state, dispatch, {
      senderId: currentUser.id,
      recipientId: alumni.id,
      content: msgText,
    });
    showToast(`Message sent to ${alumni.name}!`);
    setMsgText("");
    setShowMsgForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-20">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Alumni Directory
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 h-fit">
          <div className="flex flex-col items-center text-center mb-6">
            <Image
              src={alumni.avatar || "/avater-1.jpg"}
              alt={alumni.name}
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover border-4 border-yellow-200 mb-4"
            />
            <h1 className="text-2xl font-bold">{alumni.name}</h1>
            <p className="text-sm font-semibold text-amber-700 mt-1">
              {alumni.currentRole}
            </p>
            <p className="text-sm text-muted-foreground">{alumni.company}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-amber-900 text-xs font-semibold">
                {alumni.department} • Batch {alumni.batch}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {alumni.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowMentorForm(!showMentorForm)}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Request Mentorship
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowMsgForm(!showMsgForm)}
              className="w-full gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Send Message
            </Button>
          </div>

          {showMentorForm && (
            <form onSubmit={handleRequestMentorship} className="mt-4 space-y-3">
              <textarea
                required
                rows={3}
                value={mentorNote}
                onChange={(e) => setMentorNote(e.target.value)}
                placeholder="Tell the mentor what guidance you are looking for..."
                className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
              />
              <Button type="submit" className="w-full gap-2">
                Submit Request <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          {showMsgForm && (
            <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
              <textarea
                required
                rows={3}
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder={`Write a message to ${alumni.name}...`}
                className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
              />
              <Button type="submit" variant="secondary" className="w-full">
                Send Direct Message
              </Button>
            </form>
          )}
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">About &amp; Career Journey</h2>
            <p className="text-foreground/80 leading-relaxed">{alumni.bio}</p>
            <div className="border-l-4 border-yellow-400 pl-4 py-1 bg-yellow-50/50 rounded-r-lg">
              <p className="text-sm font-semibold text-foreground mb-1">
                ULAB to Industry Journey
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {alumni.journey}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Expertise Areas</h3>
              <div className="flex flex-wrap gap-2">
                {alumni.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="px-3 py-1 rounded-full bg-yellow-100 text-amber-900 text-xs font-semibold"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Jobs Posted by {alumni.name} ({postedJobs.length})
            </h2>
            {postedJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active job postings from this mentor right now.
              </p>
            ) : (
              <div className="space-y-3">
                {postedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block p-4 rounded-xl border hover:border-primary hover:bg-primary/5 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.company} • {job.location} • {job.type}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        BDT {job.salaryMin.toLocaleString()} –{" "}
                        {job.salaryMax.toLocaleString()}
                      </span>
                    </div>
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
