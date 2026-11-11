'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

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
    <div className={`relative grid place-items-center overflow-hidden bg-white ${className}`}>
      {validSource ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          loading={eager ? 'eager' : 'lazy'}
          className="object-contain p-3"
          onError={() => setFailedSource(src)}
        />
      ) : (
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <Package size={18} aria-hidden="true" /> Photo indisponible
        </span>
      )}
    </div>
  );
}
