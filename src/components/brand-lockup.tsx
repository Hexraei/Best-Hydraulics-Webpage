import Image from "next/image";
import { Saira } from "next/font/google";
import mark from "../../images/brand/best-hydraulics-mark.webp";

// Saira Italic is the closest Google Font to the logo's wordmark: expanded width
// matches "BEST", semi-condensed matches "HYDRAULICS", light matches the tagline.
const saira = Saira({ subsets: ["latin"], style: "italic", axes: ["wdth"], display: "swap" });

/** Hero logo lockup: the emblem is the only image; the wordmark and tagline are live text. */
export function BrandLockup() {
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <Image
        src={mark}
        alt=""
        loading="eager"
        sizes="(min-width: 1280px) 206px, (min-width: 640px) 157px, 106px"
        className="h-[88px] w-auto shrink-0 sm:h-[130px] xl:h-[170px]"
      />

      <div className={`${saira.className} inline-flex flex-col`}>
        <h1 className="whitespace-nowrap text-[1.55rem] leading-none uppercase sm:text-[2.35rem] xl:text-[3.1rem]">
          <span className="font-black text-brand-red-bright [font-stretch:125%]">Best</span>{" "}
          <span className="font-extrabold text-white [font-stretch:90%]">Hydraulics</span>
        </h1>
        <p className="mt-[0.55em] flex items-center gap-[0.6em] text-[0.74rem] font-light tracking-[0.06em] whitespace-nowrap text-slate-200 [font-stretch:87%] sm:text-[1.13rem] xl:text-[1.49rem]">
          <span aria-hidden="true" className="h-px flex-1 bg-brand-red-bright/80" />
          Solution of Hydraulics
          <span aria-hidden="true" className="h-px flex-1 bg-brand-red-bright/80" />
        </p>
      </div>
    </div>
  );
}
