import { useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { formatPrice } from "@/lib/money";
import { addToCart } from "@/stores/cart";
import type { ScreeningMovie, ScreeningVariation } from "@/lib/catalog";

interface ShowtimesGridProps {
  movies: ScreeningMovie[];
}

/** Formats a screening's showtime for display, falling back to its catalog name when there's no parsed date. */
function getScreeningLabel(screening: ScreeningVariation): string {
  if (screening.screeningStart) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(screening.screeningStart));
  }
  return screening.name || "Showtime";
}

export function ShowtimesGrid({ movies }: ShowtimesGridProps) {
  if (movies.length === 0) {
    return (
      <p className="text-muted-foreground">
        No screenings are currently listed. Please check back soon.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-6">
      {movies.map((movie) => (
        <MovieScreeningCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

function MovieScreeningCard({ movie }: { movie: ScreeningMovie }) {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const labelsById = new Map(
    movie.screenings.map((s) => [s.id, getScreeningLabel(s)]),
  );
  const idsByLabel = new Map(
    movie.screenings.map((s) => [getScreeningLabel(s), s.id]),
  );
  const selected = movie.screenings.find((s) => s.id === selectedId);

  function handleAddToCart() {
    if (!selected) return;
    addToCart(
      {
        catalogObjectId: selected.id,
        kind: "ticket",
        name: movie.name,
        variationName: labelsById.get(selected.id) ?? "",
        amountCents: selected.price.amountCents,
        currency: selected.price.currency,
      },
      quantity,
    );
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <MovieCard
      title={movie.name}
      price={formatPrice((selected ?? movie.screenings[0]).price)}
      movieTimes={movie.screenings.map((s) => labelsById.get(s.id)!)}
      selectedTime={selectedId ? labelsById.get(selectedId) : undefined}
      onTimeSelect={(label) => setSelectedId(idsByLabel.get(label))}
      quantity={quantity}
      onQuantityChange={setQuantity}
      ctaLabel={added ? "Added!" : "Add to Cart"}
      ctaDisabled={!selected}
      onCtaClick={handleAddToCart}
    />
  );
}
