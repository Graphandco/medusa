"use client"

import Image from "next/image"
import { useHeaderHeight } from "@lib/hooks/use-element-height"
import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  useHeaderHeight()

  return (
    <div className="md:h-[calc(100dvh-var(--header-height,4rem))] relative flex flex-col justify-center gap-4">
      <Image
        src="/hero.avif"
        alt="Hero"
        width={1900}
        height={1280}
        className="relative md:absolute inset-0 object-cover w-full h-full"
        priority
      />
      <div className="relative z-10 wrapper">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
          Jewels & Co
        </h1>
        <p className="text-xl md:text-2xl font-medium">
          Bienvenue sur notre boutique de bijoux
        </p>
        <LocalizedClientLink href="/store" className="mt-5 inline-block">
          <Button variant="primary" size="large" data-testid="hero-cta-button">
            Trouvez votre bijou préféré
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Hero
