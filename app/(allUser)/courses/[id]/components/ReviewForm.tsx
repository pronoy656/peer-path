"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState } from "react";

export default function ReviewForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { rating: number; title: string; text: string }) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, title, text });
  };

  return (
    <Card className="p-6 border-2 border-blue-200 bg-blue-50/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Review title (e.g. Life-changing course!)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Share your experience..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          required
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <div className="flex gap-3">
          <Button type="submit" size="lg" className="flex-1">
            Submit Review
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
