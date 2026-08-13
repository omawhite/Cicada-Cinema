const DEFAULT_BANNER = "/Cicada_Curtain_CROP_2.webp";

/** Props for the full-width banner image component. */
interface BannerProps {
  /** Src for the banner image. Defaults to the Cicada curtain crop. */
  src?: string;
}

export function Banner({ src }: BannerProps) {
  return (
    <div
      className="relative w-full aspect-2618/1009 max-h-128 overflow-hidden border-b-2"
      style={{
        borderImage:
          "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1",
      }}
    >
      <img
        src={src ?? DEFAULT_BANNER}
        alt="Cicada Cinema Banner"
        className="object-cover object-center w-full h-full"
        loading="eager"
      />
    </div>
  );
}
