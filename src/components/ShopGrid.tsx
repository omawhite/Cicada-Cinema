import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/money";
import { addToCart } from "@/stores/cart";
import type { ShopItem } from "@/lib/catalog";

interface ShopGridProps {
  items: ShopItem[];
}

export function ShopGrid({ items }: ShopGridProps) {
  if (items.length === 0) {
    return (
      <p className="text-muted-foreground">
        The shop is temporarily unavailable. Please check back soon.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-6">
      {items.map((item) => (
        <ShopItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ShopItemCard({ item }: { item: ShopItem }) {
  const [selectedId, setSelectedId] = useState(item.variations[0].id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const selected =
    item.variations.find((v) => v.id === selectedId) ?? item.variations[0];

  function handleAddToCart() {
    addToCart(
      {
        catalogObjectId: selected.id,
        kind: "merch",
        name: item.name,
        variationName: selected.name,
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
    <Card className="w-76.75">
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-heading text-xl font-medium">{item.name}</p>
          {item.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}
          <p className="text-lg">{formatPrice(selected.price)}</p>
        </div>
        {item.variations.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {item.variations.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                className={cn(
                  "rounded-md border px-2 py-1 text-sm transition-colors",
                  v.id === selectedId
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus />
            </Button>
            <span className="w-4 text-center tabular-nums">{quantity}</span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus />
            </Button>
          </div>
          <Button
            className="w-fit bg-foreground text-background hover:bg-foreground/80"
            onClick={handleAddToCart}
          >
            {added ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
