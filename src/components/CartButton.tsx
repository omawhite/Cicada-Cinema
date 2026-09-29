import { useState } from "react";
import { useStore } from "@nanostores/react";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/money";
import {
  cartItems,
  cartCount,
  cartTotalCents,
  updateQuantity,
  removeFromCart,
} from "@/stores/cart";

/** Cart icon with item count badge; opens a drawer to review the cart and start checkout. */
export function CartButton() {
  const [open, setOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = useStore(cartItems);
  const count = useStore(cartCount);
  const totalCents = useStore(cartTotalCents);

  async function handleCheckout() {
    setError(null);
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            catalogObjectId: item.catalogObjectId,
            quantity: item.quantity,
          })),
        }),
      });
      const data: { url: string } | { error: string } = await res.json();
      if ("url" in data) {
        window.location.href = data.url;
      } else {
        setError(data.error);
      }
    } catch {
      setError("Could not start checkout. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
        className="relative inline-flex items-center justify-center p-2"
      >
        <ShoppingBag aria-hidden="true" />
        {count > 0 && (
          <span className="absolute top-0 right-0 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {count}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.catalogObjectId}
                className="flex items-start justify-between gap-3"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.variationName}
                  </p>
                  <p className="text-sm">
                    {formatPrice({
                      amountCents: item.amountCents,
                      currency: item.currency,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      updateQuantity(item.catalogObjectId, item.quantity - 1)
                    }
                  >
                    <Minus />
                  </Button>
                  <span className="w-4 text-center tabular-nums">
                    {item.quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Increase quantity"
                    onClick={() =>
                      updateQuantity(item.catalogObjectId, item.quantity + 1)
                    }
                  >
                    <Plus />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeFromCart(item.catalogObjectId)}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <SheetFooter>
          <div className="flex items-center justify-between text-lg font-medium">
            <span>Total</span>
            <span>
              {formatPrice({
                amountCents: totalCents,
                currency: items[0]?.currency ?? "USD",
              })}
            </span>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            className="w-full bg-foreground text-background hover:bg-foreground/80"
            disabled={items.length === 0 || checkingOut}
            onClick={handleCheckout}
          >
            {checkingOut ? "Starting checkout…" : "Checkout"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
