"use client"

import Image from "next/image"
import { useState } from "react"

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  fallback?: React.ReactNode
}

/** next/image wrapper with React state–based error fallback. */
export function SafeImage({ src, alt, className, sizes, fallback }: SafeImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <>{fallback ?? null}</>
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className ?? "object-cover"}
      sizes={sizes ?? "128px"}
      onError={() => setHasError(true)}
    />
  )
}
