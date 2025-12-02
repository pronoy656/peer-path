/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import { ThumbsUp, MessageCircle, Star } from "lucide-react";

export default function ReviewCard({ review }: { review: any }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
            {review.author[0]}
          </div>
          <div>
            <p className="font-semibold">{review.author}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          Verified
        </span>
      </div>

      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
      <p className="text-foreground/80 leading-relaxed">{review.text}</p>

      <div className="flex items-center gap-6 mt-6 pt-4 border-t">
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ThumbsUp className="h-4 w-4" />
          Helpful ({review.helpful})
        </button>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <MessageCircle className="h-4 w-4" />
          Reply
        </button>
      </div>
    </Card>
  );
}
