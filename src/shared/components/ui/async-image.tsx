import { useState, useEffect } from 'react';
import { imageRequestQueue } from '@/shared/utils/request-queue';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface AsyncImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
}

/**
 * Image component that loads via a throttled queue to prevent 429 errors.
 * Fetches image as Blob and creates ObjectURL.
 */
export function AsyncImage({ src, alt, className, fallback, ...props }: AsyncImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        // Use src as dedupe key to prevent double-fetching same URL
        const blob = await imageRequestQueue.add(async () => {
          const response = await fetch(src);
          if (!response.ok) throw new Error('Failed to load image');
          return response.blob();
        }, src);

        if (active) {
          const objectUrl = URL.createObjectURL(blob);
          setImageSrc(objectUrl);
          setIsLoading(false);
        }
      } catch (err) {
        if (active) {
          console.warn(`Failed to load image ${src}`, err);
          setError(true);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      active = false;
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [src]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-neutral-100 text-neutral-400 ${className}`}>
        <span className="text-xs">Error</span>
      </div>
    );
  }

  if (isLoading) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <Skeleton className={`h-full w-full ${className}`} />
    );
  }

  return (
    <img
      src={imageSrc!}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
