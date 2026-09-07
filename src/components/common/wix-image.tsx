import type { ImgHTMLAttributes } from "react";

interface WixImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  mediaIdentifier: string;
  alt?: string;
  width?: number;
  height?: number;
  scaleToFill?: boolean;
}

export default function WixImage({
  mediaIdentifier,
  alt,
  width,
  height,
  className,
  ...props
}: WixImageProps) {
  const imageUrl = mediaIdentifier.startsWith("http")
    ? mediaIdentifier
    : `https://static.wixstatic.com/media/${mediaIdentifier}`;

  return (
    <img
      src={imageUrl}
      alt={alt || ""}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
}
