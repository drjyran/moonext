import Image from "next/image";

type Photo = {
  src: string;
  alt: string;
};

type Props = {
  photos: readonly Photo[];
};

export function PagePhotoGrid({ photos }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {photos.map((photo, index) => (
        <div
          key={photo.src}
          className={`group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-100 shadow-[0_20px_55px_rgba(15,23,42,0.08)] ${
            index === 0 ? "md:col-span-2 md:row-span-2 min-h-[320px]" : "min-h-[180px] md:min-h-[152px]"
          }`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.18)_55%,rgba(15,23,42,0.56)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="inline-flex rounded-full border border-white/12 bg-slate-950/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-md">
              Moonext Site Visual
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
