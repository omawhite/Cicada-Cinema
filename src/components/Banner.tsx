import bannerImage from "../assets/Cicada_Curtain_CROP_2.png";

export function Banner() {
  return (
    <div
      className="relative w-full h-80 md:h-96 lg:h-128 overflow-hidden border-t-2 border-b-2"
      style={{
        borderImage:
          "linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent) 1",
      }}
    >
      <img
        src={bannerImage.src ?? bannerImage}
        alt="Cicada Cinema Banner"
        className="object-cover object-center w-full h-full"
        loading="eager"
      />
    </div>
  );
}
