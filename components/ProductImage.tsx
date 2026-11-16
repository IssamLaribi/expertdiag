'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

export function ProductImage({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string>();
  const validSource = src && /^(https?:\/\/|\/(?!\/)|data:image\/)/i.test(src) && failedSource !== src;

  return (
    <div className={`@container relative grid place-items-center overflow-hidden bg-paper bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#ffffff_22%,var(--color-paper)_78%)] ${className}`}>
      {validSource ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          loading={eager ? 'eager' : 'lazy'}
          className="object-contain p-[9%] mix-blend-multiply"
          onError={() => setFailedSource(src)}
        />
      ) : (
        <span className="flex flex-col items-center gap-1.5 text-xs text-mute">
          <ImageOff size={18} strokeWidth={1.5} aria-hidden="true" />
          <span className="hidden @[9rem]:inline">Pas de photo</span>
        </span>
      )}
    </div>
  );
}
