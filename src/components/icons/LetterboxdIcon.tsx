interface LetterboxdIconProps {
  className?: string;
}

export function LetterboxdIcon({ className }: LetterboxdIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="7" cy="15" r="8" fill="#40BCF4" />
      <circle cx="15" cy="15" r="8" fill="#00C030" />
      <circle cx="23" cy="15" r="8" fill="#FF8000" />
    </svg>
  );
}
