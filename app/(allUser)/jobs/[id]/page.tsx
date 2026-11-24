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
import { Badge } from "@/components/ui/badge";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { state, dispatch, currentUser, showToast } = useAppStore();

  const job = getJobById(state, id as string);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center bg-background">
        <h1 className="text-3xl font-bold font-display mb-2">Job not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          This job listing may have been removed or closed.
        </p>
        <Link href="/jobs">
          <Button variant="default">Browse all jobs</Button>
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
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to alumni job board
        </Link>

        <Card className="p-6 sm:p-8 gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="saved">{job.type}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold font-display">
                {job.title}
              </h1>
              <p className="text-base font-medium text-muted-foreground">
                {job.company}
              </p>
            </div>

            <Button
              size="lg"
              variant="accent"
              onClick={handleApply}
              disabled={hasApplied || job.status === "closed"}
            >
              {hasApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Applied
                </>
              ) : job.status === "closed" ? (
                "Position closed"
              ) : (
                "Apply for this role"
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-background border border-border text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Briefcase className="w-4 h-4 text-primary shrink-0" />
              <span>
                BDT {job.salaryMin.toLocaleString()}–
                {job.salaryMax.toLocaleString()}/mo
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 text-primary shrink-0" />
              <span className="text-foreground">
                {job.applicants.length} applicant(s)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold font-display">Role description</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {poster && (
            <div className="pt-5 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Posted by ULAB alumni
                </p>
                <p className="font-semibold text-sm">{poster.name}</p>
              </div>
              <Link href={`/alumni/${poster.id}`}>
                <Button variant="outline" size="sm">
                  View mentor profile
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
