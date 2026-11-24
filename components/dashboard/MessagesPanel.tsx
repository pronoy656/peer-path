"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { sendDirectMessage } from "@/lib/services/people";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MessagesPanel({
  allowedRecipientIds,
}: {
  allowedRecipientIds?: string[];
}) {
  const { state, dispatch, currentUser, showToast } = useAppStore();
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [newRecipientId, setNewRecipientId] = useState("");

  const myMessages = useMemo(() => {
    if (!currentUser) return [];
    return state.messages.filter(
      (m) => m.senderId === currentUser.id || m.recipientId === currentUser.id
    );
  }, [state.messages, currentUser]);

  const peerIds = useMemo(() => {
    if (!currentUser) return [];
    const set = new Set<string>();
    for (const m of myMessages) {
      set.add(m.senderId === currentUser.id ? m.recipientId : m.senderId);
    }
    return Array.from(set);
  }, [myMessages, currentUser]);

  const activePeerId = selectedPeerId || peerIds[0] || null;
  const activeThread = useMemo(() => {
    if (!currentUser || !activePeerId) return [];
    return myMessages
      .filter(
        (m) =>
          (m.senderId === currentUser.id && m.recipientId === activePeerId) ||
          (m.senderId === activePeerId && m.recipientId === currentUser.id)
      )
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [myMessages, currentUser, activePeerId]);

  const availableContacts = useMemo(() => {
    if (!currentUser) return [];
    return state.users.filter(
      (u) =>
        u.id !== currentUser.id &&
        (!allowedRecipientIds || allowedRecipientIds.includes(u.id))
    );
  }, [state.users, currentUser, allowedRecipientIds]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !activePeerId || !replyText.trim()) return;
    sendDirectMessage(state, dispatch, {
      senderId: currentUser.id,
      recipientId: activePeerId,
      content: replyText,
    });
    setReplyText("");
    showToast("Message sent!");
  };

  const handleStartNew = () => {
    if (!newRecipientId) return;
    setSelectedPeerId(newRecipientId);
    setNewRecipientId("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-base mb-2">Conversations</h3>
          <div className="flex gap-2">
            <select
              aria-label="Start new conversation"
              value={newRecipientId}
              onChange={(e) => setNewRecipientId(e.target.value)}
              className="flex-1 text-xs px-2.5 py-2 border rounded-lg bg-background"
            >
              <option value="">Start new chat...</option>
              {availableContacts.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleStartNew}
              disabled={!newRecipientId}
            >
              Open
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          {peerIds.length === 0 && !selectedPeerId ? (
            <p className="text-xs text-muted-foreground py-6 text-center">
              No messages yet. Pick a contact above to start a thread.
            </p>
          ) : (
            Array.from(
              new Set(
                selectedPeerId && !peerIds.includes(selectedPeerId)
                  ? [selectedPeerId, ...peerIds]
                  : peerIds
              )
            ).map((pid) => {
              const peer = state.users.find((u) => u.id === pid);
              const last = myMessages
                .filter((m) => m.senderId === pid || m.recipientId === pid)
                .slice(-1)[0];
              const active = activePeerId === pid;
              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => setSelectedPeerId(pid)}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    active
                      ? "bg-primary/5 border-primary"
                      : "bg-background border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">
                      {peer?.name ?? "User"}
                    </span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-secondary font-medium">
                      {peer?.role ?? "member"}
                    </span>
                  </div>
                  {last && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {last.subject ? `[${last.subject}] ` : ""}
                      {last.content}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </Card>

      <Card className="lg:col-span-2 p-5 flex flex-col min-h-[420px]">
        {activePeerId ? (
          <>
            <div className="pb-3 mb-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {state.users.find((u) => u.id === activePeerId)?.name ??
                    "Conversation"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {state.users.find((u) => u.id === activePeerId)?.email}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[340px] pr-1 mb-4">
              {activeThread.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  No messages in this thread yet. Say hello below!
                </p>
              ) : (
                activeThread.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                          isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {msg.subject && (
                          <p className="text-xs font-bold mb-1 underline">
                            {msg.subject}
                          </p>
                        )}
                        <p>{msg.content}</p>
                        <p className="text-[10px] opacity-65 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
              />
              <Button type="submit" variant="default">
                <Send className="w-4 h-4" />
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
            <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
            <p className="font-medium">Select or start a conversation</p>
          </div>
        )}
      </Card>
    </div>
  );
}
