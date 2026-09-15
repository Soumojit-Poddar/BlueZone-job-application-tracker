"use client";

import { useTransition } from "react";
import { toggleFavorite } from "@/lib/actions/applications";

export function FavoriteButton({
  applicationId,
  isFavorite,
}: {
  applicationId: string;
  isFavorite: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          toggleFavorite(applicationId, isFavorite);
        });
      }}
      className="text-2xl disabled:opacity-50"
      title={isFavorite ? "Remove from favorites" : "Mark as favorite"}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}