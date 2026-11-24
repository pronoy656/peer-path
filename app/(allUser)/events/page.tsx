"use client";

import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, MapPin, Users } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { getEvents } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="rounded-2xl bg-yellow-400 p-8 sm:p-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-3">
            Upcoming Campus Events
          </h1>
          <p className="text-slate-900/80 text-lg max-w-2xl">
            Networking sessions, mock interviews, and semester advising hosted
            by ULAB alumni and advisors.
          </p>
        </div>

        {events.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="font-semibold text-lg">No upcoming events right now</p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back soon or ask alumni mentors in the Community feed.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const organizer = state.users.find(
                (u) => u.id === event.organizerId
              );
              const isGoing = currentUser
                ? event.attendees.includes(currentUser.id)
                : false;

              return (
                <Card
                  key={event.id}
                  className="p-6 flex flex-col justify-between border-t-4 border-t-yellow-400"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800 bg-yellow-100 px-2.5 py-1 rounded-full">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {event.attendees.length} going
                      </span>
                    </div>

                    <h2 className="text-xl font-bold">{event.title}</h2>
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
                    onClick={() => handleRsvp(event.id, event.title, isGoing)}
                    className={`w-full mt-6 ${
                      isGoing
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    }`}
                  >
                    {isGoing ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Attending (Cancel)
                      </span>
                    ) : (
                      "RSVP Now"
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
