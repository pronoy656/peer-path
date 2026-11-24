"use client";

import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, MapPin, Users } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getEvents } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function EventsPage() {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const router = useRouter();
  const events = getEvents(state);

  const handleRsvp = (eventId: string, title: string, isGoing: boolean) => {
    if (!currentUser) {
      showToast("Please sign in to RSVP for events.", "info");
      router.push("/signIn");
      return;
    }
    dispatch({ type: "TOGGLE_EVENT_RSVP", eventId, userId: currentUser.id });
    showToast(
      isGoing ? `Cancelled RSVP for ${title}` : `RSVP confirmed for ${title}!`,
      isGoing ? "info" : "success"
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Campus calendar
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground">
            Upcoming ULAB events
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Networking sessions, mock interviews, and semester advising hosted
            by ULAB alumni and advisors.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {events.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="No upcoming events right now"
            description="Check back soon or ask alumni mentors in the Community feed."
            actionLabel="Visit community"
            actionHref="/community"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => {
              const organizer = state.users.find(
                (u) => u.id === event.organizerId
              );
              const isGoing = currentUser
                ? event.attendees.includes(currentUser.id)
                : false;

              return (
                <Card key={event.id} className="p-6 justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="saved">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {event.attendees.length} going
                      </span>
                    </div>

                    <h2 className="text-lg font-bold font-display">
                      {event.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {event.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Organizer: {organizer?.name ?? "ULAB Alumni"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant={isGoing ? "secondary" : "accent"}
                    onClick={() => handleRsvp(event.id, event.title, isGoing)}
                    className="w-full"
                  >
                    {isGoing ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-success" />{" "}
                        Attending (Cancel)
                      </>
                    ) : (
                      "RSVP for event"
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
