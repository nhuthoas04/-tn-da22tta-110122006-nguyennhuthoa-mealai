'use client';

import { useEffect, useState } from 'react';
import { HiPhotograph } from 'react-icons/hi';
import { getRecipeImageUrl } from '@/lib/images';

interface RecipeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  iconClassName?: string;
}

export default function RecipeImage({
  src,
  alt,
  className = 'h-full w-full object-cover',
  fallbackClassName = 'flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 text-brand-primary',
  iconClassName = 'text-5xl',
}: RecipeImageProps) {
  const [failed, setFailed] = useState(false);
  const imageUrl = getRecipeImageUrl(src);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!imageUrl || failed) {
    return (
      <div className={fallbackClassName}>
        <HiPhotograph className={iconClassName} />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
