import { Star } from "lucide-react";
import { Avatar } from "./avatar";

export interface ReviewSnippetProps {
  avatarUrl?: string;
  author: string;
  quote: string;
  rating: number;
}

export function ReviewSnippet({
  avatarUrl,
  author,
  quote,
  rating,
}: ReviewSnippetProps) {
  return (
    <figure className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-center gap-1 text-accent">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            aria-hidden="true"
            className="h-4 w-4 fill-current"
            key={index}
            opacity={index + 1 <= Math.round(rating) ? 1 : 0.35}
          />
        ))}
        <span className="sr-only">{rating} de 5 estrelas</span>
      </div>
      <blockquote className="text-sm leading-6 text-muted-strong">
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar alt="" fallback={author} size="sm" src={avatarUrl} />
        <span className="text-sm font-bold text-foreground">{author}</span>
      </figcaption>
    </figure>
  );
}
