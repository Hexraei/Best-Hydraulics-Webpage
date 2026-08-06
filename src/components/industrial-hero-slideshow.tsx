import Image from "next/image";
import bg4 from "../../images/bg/bg4.webp";

export function IndustrialHeroSlideshow() {
  return (
    <div className="relative h-full min-h-[36rem] overflow-hidden bg-slate-900 lg:min-h-[calc(100vh-4rem)]">
      <Image
        src={bg4}
        alt="Industrial fitting and maintenance workspace"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.08)_100%)]" />
    </div>
  );
}
