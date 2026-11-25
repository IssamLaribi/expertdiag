'use client';

import { useRef, type PointerEvent } from 'react';
import Image from 'next/image';
import { Molecule } from '@/components/Molecule';

export type LensSlide = { slug: string; name: string; count: number };

/**
 * Microscope-lens illustration for the homepage hero. The slide under the lens
 * follows the specialty the visitor points at; the parent owns `active`.
 * Purely visual: the specialty links next to it carry the same information.
 */
export function HeroLens({ slides, active }: { slides: LensSlide[]; active: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const current = slides[active];

  // Pointer parallax through CSS variables, so moving the mouse never re-renders.
  function track(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || !stage.current) return;
    const box = stage.current.getBoundingClientRect();
    stage.current.style.setProperty('--px', (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(3));
    stage.current.style.setProperty('--py', (((event.clientY - box.top) / box.height) * 2 - 1).toFixed(3));
  }

  function reset() {
    stage.current?.style.setProperty('--px', '0');
    stage.current?.style.setProperty('--py', '0');
  }

  const depth = (x: number, y: number) => ({ translate: `calc(var(--px, 0) * ${x}px) calc(var(--py, 0) * ${y}px)` });

  return (
    <div ref={stage} aria-hidden="true" onPointerMove={track} onPointerLeave={reset} className="relative mx-auto aspect-[6/5] w-full max-w-[36rem] select-none">
      <div className="absolute top-[1%] right-[-2%] w-[42%] text-white/75 transition-[translate] duration-500 ease-out motion-reduce:transition-none" style={depth(-14, -10)}>
        <Molecule className="w-full" />
      </div>

      <div className="absolute top-[7%] left-[17%] aspect-square w-[62%] transition-[translate] duration-500 ease-out motion-reduce:transition-none" style={depth(6, 5)}>
        {/* Focus ring: fine graduations that turn slowly, like a microscope's focus knob. */}
        <div className="absolute -inset-[7%] animate-[spin_90s_linear_infinite] rounded-full bg-[repeating-conic-gradient(rgb(255_255_255/0.45)_0deg_0.7deg,transparent_0.7deg_7.5deg)] [mask:radial-gradient(circle,transparent_63%,#000_64%,#000_69%,transparent_70%)] motion-reduce:animate-none" />
        <div className="absolute -inset-[3%] rounded-full bg-[radial-gradient(circle,rgb(124_196_240/0.28)_55%,transparent_72%)] blur-2xl" />

        <div className="absolute inset-0 overflow-hidden rounded-full bg-[#c8dbee] shadow-[0_30px_70px_-20px_rgb(0_0_0/0.6)] ring-[7px] ring-white">
          {slides.map(({ slug }, index) => (
            <Image
              key={slug}
              src={`/art/slide-${slug}.webp`}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 24rem, 70vw"
              className={`object-cover transition duration-[900ms] ease-out motion-reduce:transition-none ${
                index === active ? 'scale-100 opacity-100 blur-0' : 'scale-[1.18] opacity-0 blur-[6px]'
              }`}
            />
          ))}
          {/* Glare on the glass. */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_24%,rgb(255_255_255/0.4),transparent_38%)]" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgb(14_45_99/0.35)]" />
        </div>

        {/* Label styled as a glass slide: frosted end with the name, clear glass after it. */}
        {current && (
          <div className="absolute -bottom-[9%] left-1/2 flex -translate-x-1/2 overflow-hidden rounded-md shadow-[0_14px_30px_-12px_rgb(0_0_0/0.7)] ring-1 ring-white/40">
            <div key={current.slug} className="rise bg-white/95 px-3.5 py-2 text-ink">
              <p className="text-[0.8125rem] leading-tight font-bold whitespace-nowrap">{current.name}</p>
              <p className="text-[0.6875rem] leading-tight whitespace-nowrap text-mute">{current.count} référence{current.count > 1 ? 's' : ''}</p>
            </div>
            <div className="w-16 bg-white/15 backdrop-blur-sm" />
          </div>
        )}
      </div>

      <div className="absolute bottom-[3%] left-[-2%] w-[33%] transition-[translate] duration-500 ease-out motion-reduce:transition-none" style={depth(16, 10)}>
        <Image src="/art/hero-tubes.webp" alt="" width={520} height={520} unoptimized className="h-auto w-full drop-shadow-[0_20px_25px_rgb(0_0_0/0.45)]" />
      </div>
      <div className="absolute right-[-1%] bottom-[-1%] w-[36%] transition-[translate] duration-500 ease-out motion-reduce:transition-none" style={depth(20, 12)}>
        <Image src="/art/hero-petri.webp" alt="" width={520} height={520} unoptimized className="h-auto w-full drop-shadow-[0_20px_25px_rgb(0_0_0/0.45)]" />
      </div>
    </div>
  );
}
