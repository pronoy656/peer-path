import { Star } from "lucide-react";

export default function RatingStars({
  rating = 0,
  reviews,
  size = "sm",
}: {
  rating?: number | string;
  reviews?: number;
  size?: "sm" | "lg";
}) {
  const numRating = Number(rating) || 0;
  const isLarge = size === "lg";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`font-bold ${
          isLarge ? "text-4xl text-blue-600" : "text-lg"
        }`}
      >
        {numRating.toFixed(1)}
      </div>
      <div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`${isLarge ? "h-6 w-6" : "h-4 w-4"} ${
                i < Math.floor(numRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        {reviews != null && (
          <p className="text-sm text-muted-foreground">
            {Number(reviews).toLocaleString()} reviews
          </p>
        )}
      </div>
    </div>
  );
}
