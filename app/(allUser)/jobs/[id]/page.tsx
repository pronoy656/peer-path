"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  MapPin,
  Users,
} from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getJobById } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast } = useAppStore();

  const job = getJobById(state, id as string);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Job Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This job listing may have been removed or closed.
        </p>
        <Link
          href="/jobs"
          className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          Browse All Jobs
        </Link>
      </div>
    );
  }

  const poster = state.users.find((u) => u.id === job.postedById);
  const hasApplied = currentUser
    ? job.applicants.some((a) => a.userId === currentUser.id)
    : false;

  const handleApply = () => {
    if (!currentUser) {
      showToast("Please sign in to apply for this role.", "info");
      router.push("/signIn");
      return;
    }
    if (hasApplied) {
      showToast("You already applied to this position.", "info");
      return;
    }
    dispatch({ type: "APPLY_JOB", jobId: job.id, userId: currentUser.id });
    dispatch({
      type: "ADD_NOTIFICATION",
      notification: {
        id: `notif-${Date.now()}`,
        userId: job.postedById,
        title: `New Applicant for ${job.title}`,
        body: `${currentUser.name} applied for ${job.title} at ${job.company}.`,
        read: false,
        createdAt: new Date().toISOString(),
        link: "/dashboard/alumni",
      },
    });
    showToast(`Application submitted to ${job.company}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Alumni Job Board
        </Link>

        <Card className="p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-amber-900 text-xs font-semibold">
                {job.type}
              </span>
              <h1 className="text-3xl font-bold mt-3">{job.title}</h1>
              <p className="text-lg font-medium text-muted-foreground mt-1">
                {job.company}
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleApply}
              disabled={hasApplied || job.status === "closed"}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
            >
              {hasApplied ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Applied
                </span>
              ) : job.status === "closed" ? (
                "Position Closed"
              ) : (
                "Apply Now"
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Briefcase className="w-4 h-4 text-primary shrink-0" />
              <span>
                BDT {job.salaryMin.toLocaleString()} –{" "}
                {job.salaryMax.toLocaleString()}/mo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <span>{job.applicants.length} applicant(s)</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Role Description</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {poster && (
            <div className="pt-6 border-t flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Posted by ULAB Alumni</p>
                <p className="font-semibold">{poster.name}</p>
              </div>
              <Link href={`/alumni/${poster.id}`}>
                <Button variant="outline">View Alumni Mentor Profile</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
