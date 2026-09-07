"use client";

import { Image as ImageKitImage, ImageKitProvider } from "@imagekit/next";
import type { ImgHTMLAttributes } from "react";

interface IKImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> {
  path?: string;
  src?: string;
  urlEndpoint?: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  transformation?: Record<string, string | number | undefined>[];
}

const urlEndpoint =
  process.env.NEXT_PUBLIC_URL_ENDPOINT || "https://ik.imagekit.io/codernandan";

export default function IKImage({
  path,
  src,
  urlEndpoint: propUrlEndpoint,
  alt,
  width,
  height,
  className,
  loading,
  transformation = [],
  ...props
}: IKImageProps) {
  const imageSrc = path || src || "";
  const isExternal =
    imageSrc.startsWith("http") && !imageSrc.includes("ik.imagekit.io");

  if (isExternal) {
    return (
      <img
        src={imageSrc}
        alt={alt || ""}
        width={width}
        height={height}
        className={className}
        loading={loading}
        {...props}
      />
    );
  }

  const IKImageComponent = ImageKitImage as unknown as React.ElementType;

  const activeTransformation = [...transformation];
  if (width || height) {
    activeTransformation.push({ width, height });
  }

  return (
    <ImageKitProvider urlEndpoint={propUrlEndpoint || urlEndpoint}>
      {imageSrc.startsWith("http") ? (
        <IKImageComponent
          src={imageSrc}
          alt={alt || ""}
          width={width}
          height={height}
          className={className}
          loading={loading}
          transformation={
            activeTransformation.length > 0 ? activeTransformation : undefined
          }
          {...props}
        />
      ) : (
        <IKImageComponent
          path={imageSrc}
          alt={alt || ""}
          width={width}
          height={height}
          className={className}
          loading={loading}
          transformation={
            activeTransformation.length > 0 ? activeTransformation : undefined
          }
          {...props}
        />
      )}
    </ImageKitProvider>
  );
}
