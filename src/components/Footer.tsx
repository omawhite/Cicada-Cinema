interface FooterProps {
  copyright?: string;
}

export function Footer({
  copyright = "© 2026, Cicada Cinema",
}: FooterProps) {
  return (
    <footer className="bg-black text-white py-4 px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-end">
        <span className="text-sm text-gray-300">{copyright}</span>
      </div>
    </footer>
  );
}
