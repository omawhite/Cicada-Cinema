interface LetterboxdIconProps {
  className?: string;
}

export function LetterboxdIcon({ className }: LetterboxdIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 46 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#40BCF4" />
      <circle cx="23" cy="10" r="10" fill="#00C030" />
      <circle cx="36" cy="10" r="10" fill="#FF8000" />
    </svg>
  );
}
