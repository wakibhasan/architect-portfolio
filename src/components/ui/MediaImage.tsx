import Image from 'next/image';
import { img, type ImageKey } from '@/lib/images';
import { cn } from '@/lib/cn';

type Props = {
  /** Key from the generated manifest (scripts/sources.mjs). */
  image: ImageKey | string;
  /** Overrides the manifest alt when context demands something specific. */
  alt?: string;
  className?: string;
  /** Wrapper class — the wrapper is what you size; the image fills it. */
  wrapperClassName?: string;
  /** REQUIRED unless priority — see TECH-PLAN §6.2. Without it Next ships desktop files to phones. */
  sizes?: string;
  priority?: boolean;
  quality?: number;
  /** Render at intrinsic size instead of filling a positioned wrapper. */
  intrinsic?: boolean;
};

/**
 * The only image primitive in the app — never use a raw <img>.
 * Wraps next/image with manifest-driven dimensions and blur placeholders.
 */
export function MediaImage({
  image,
  alt,
  className,
  wrapperClassName,
  sizes = '100vw',
  priority = false,
  quality = 82,
  intrinsic = false,
}: Props) {
  const asset = img(image);

  if (intrinsic) {
    return (
      <Image
        src={asset.src}
        alt={alt ?? asset.alt}
        width={asset.width}
        height={asset.height}
        placeholder="blur"
        blurDataURL={asset.blurDataURL}
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={className}
      />
    );
  }

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      <Image
        src={asset.src}
        alt={alt ?? asset.alt}
        fill
        placeholder="blur"
        blurDataURL={asset.blurDataURL}
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={cn('object-cover', className)}
      />
    </div>
  );
}
