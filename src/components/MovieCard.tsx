import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface MovieCardProps {
  title: string
  price: string
  posterSrc: string
  posterAlt?: string
  movieTimes?: string[]
  selectedTime?: string
  onTimeSelect?: (time: string) => void
  ctaLabel?: string
  onCtaClick?: () => void
  className?: string
}

export function MovieCard({
  title,
  price,
  posterSrc,
  posterAlt,
  movieTimes,
  selectedTime,
  onTimeSelect,
  ctaLabel = "Book Tickets",
  onCtaClick,
  className,
}: MovieCardProps) {
  return (
    <Card className={cn("w-76.75", className)}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-center">
          <img
            src={posterSrc}
            alt={posterAlt ?? title}
            className="w-59.75 h-78.25 rounded-lg object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-heading text-xl font-medium">{title}</p>
          <p className="text-lg">{price}</p>
        </div>
        {movieTimes && movieTimes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movieTimes.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect?.(time)}
                className={cn(
                  "rounded-md border px-2 py-1 text-sm transition-colors",
                  time === selectedTime
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        )}
        <Button
          className="w-fit bg-foreground text-background hover:bg-foreground/80"
          onClick={onCtaClick}
        >
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
