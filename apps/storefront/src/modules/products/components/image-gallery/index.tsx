"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const emblaOptions = useMemo(
    () => ({
      align: "start" as const,
      loop: images.length > 1,
      skipSnaps: false,
    }),
    [images.length]
  )

  const [mainViewportRef, embla] = useEmblaCarousel(emblaOptions)
  const [thumbViewportRef, thumbEmbla] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
    thumbEmbla?.scrollTo(embla.selectedScrollSnap())
  }, [embla, thumbEmbla])

  const scrollTo = useCallback(
    (index: number) => {
      embla?.scrollTo(index)
    },
    [embla]
  )

  const scrollPrev = useCallback(() => {
    embla?.scrollPrev()
  }, [embla])

  const scrollNext = useCallback(() => {
    embla?.scrollNext()
  }, [embla])

  useEffect(() => {
    if (!embla) return
    onSelect()
    embla.on("select", onSelect)
    embla.on("reInit", onSelect)
  }, [embla, onSelect])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col items-start relative w-full">
      <div className="relative w-full mb-4">
        <div className="overflow-hidden rounded-rounded" ref={mainViewportRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex-[0_0_100%] min-w-0 relative aspect-[29/34]"
              >
                {!!image.url && (
                  <div className="relative w-full h-full overflow-hidden rounded-rounded">
                    <Image
                      src={image.url}
                      priority={index <= 2}
                      className={`absolute inset-0 rounded-rounded transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        selectedIndex === index
                          ? "scale-100"
                          : "scale-95 opacity-90"
                      } hover:scale-110`}
                      style={{
                        objectFit: "contain",
                        animation:
                          selectedIndex === index
                            ? "scaleIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                            : "none",
                      }}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all hover:scale-110"
              aria-label="Image précédente"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all hover:scale-110"
              aria-label="Image suivante"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="w-full">
          <div className="overflow-hidden" ref={thumbViewportRef}>
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => scrollTo(index)}
                  className={`flex-[0_0_80px] sm:flex-[0_0_100px] relative aspect-square rounded-md overflow-hidden transition-all duration-300 ${
                    selectedIndex === index
                      ? " scale-105 shadow-md"
                      : " opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  aria-label={`Voir l'image ${index + 1}`}
                >
                  {!!image.url && (
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGallery
