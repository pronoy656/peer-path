"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
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
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export default function AlumniProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");
  const [mentorNote, setMentorNote] = useState("");
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [showMsgForm, setShowMsgForm] = useState(false);

  const alumni = getAlumniById(state, id as string);

  if (!alumni) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center bg-background">
        <h1 className="text-3xl font-bold font-display mb-2">
          Alumni mentor not found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          This alumni profile does not exist.
        </p>
        <Link href="/alumni">
          <Button variant="default">Back to alumni directory</Button>
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
    <div className="min-h-screen bg-background pb-20 pt-16">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <Link
            href="/alumni"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to alumni directory
          </Link>

          <div className="flex items-center gap-5">
            <Avatar
              src={alumni.avatar}
              name={alumni.name}
              size="xl"
              department={alumni.department}
              avatarColor={alumni.avatarColor}
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge department={alumni.department}>
                  {alumni.department}
                </Badge>
                <Badge
                  variant={
                    alumni.availability === "Available" ? "enrolled" : "pending"
                  }
                >
                  {alumni.availability}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Batch {alumni.batch}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                {alumni.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>
                  {alumni.currentRole} · {alumni.company}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  {alumni.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-t border-border pt-4">
            {(
              [
                { id: "about", label: "About & journey" },
                { id: "jobs", label: `Posted jobs (${postedJobs.length})` },
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
            <Card className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold font-display mb-2">
                  Biography
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {alumni.bio}
                </p>
              </div>
              <div className="border-l-4 border-accent pl-4 py-2 bg-background rounded-r-lg">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  ULAB to industry journey
                </p>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {alumni.journey}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Expertise areas</h3>
                <div className="flex flex-wrap gap-2">
                  {alumni.expertise.map((exp) => (
                    <Badge key={exp} variant="neutral">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === "jobs" && (
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-bold font-display">
                Jobs posted by {alumni.name}
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
                      className="block p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/40 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{job.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.company} · {job.location} · {job.type}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          BDT {job.salaryMin.toLocaleString()}–
                          {job.salaryMax.toLocaleString()}/mo
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        <aside className="lg:col-span-4">
          <Card className="p-6 space-y-4">
            <h2 className="font-display font-bold text-lg">
              Connect with mentor
            </h2>
            <div className="space-y-2.5">
              <Button
                type="button"
                variant="accent"
                className="w-full"
                onClick={() => setShowMentorForm(!showMentorForm)}
              >
                <UserCheck className="w-4 h-4" />
                Request mentorship
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowMsgForm(!showMsgForm)}
              >
                <MessageCircle className="w-4 h-4" />
                Send message
              </Button>
            </div>

            {showMentorForm && (
              <form onSubmit={handleRequestMentorship} className="space-y-3 pt-2">
                <textarea
                  required
                  rows={3}
                  value={mentorNote}
                  onChange={(e) => setMentorNote(e.target.value)}
                  placeholder="Tell the mentor what guidance you are looking for..."
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none"
                />
                <Button type="submit" size="sm" className="w-full">
                  <Send className="w-4 h-4" />
                  Submit request
                </Button>
              </form>
            )}

            {showMsgForm && (
              <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
                <textarea
                  required
                  rows={3}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  placeholder={`Write a message to ${alumni.name}...`}
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none"
                />
                <Button type="submit" variant="default" size="sm" className="w-full">
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
