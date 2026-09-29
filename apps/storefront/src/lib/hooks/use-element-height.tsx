"use client"

import { useEffect, useState, useRef, RefObject } from "react"

type UseElementHeightOptions = {
  // Soit une ref React passée depuis l'extérieur
  ref?: RefObject<HTMLElement>
  // Soit un sélecteur CSS
  selector?: string
  // Nom de la CSS variable à créer (optionnel)
  cssVariable?: string
}

export const useElementHeight = ({
  ref,
  selector,
  cssVariable,
}: UseElementHeightOptions) => {
  const [height, setHeight] = useState(0)
  // Ref interne pour stocker l'élément trouvé
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const updateHeight = () => {
      // Récupère l'élément depuis la ref externe ou trouve-le avec le selector
      const element =
        ref?.current ||
        elementRef.current ||
        (selector ? document.querySelector<HTMLElement>(selector) : null)

      // Stocke l'élément trouvé dans la ref interne pour les prochaines fois
      if (element && !elementRef.current) {
        elementRef.current = element
      }

      if (element) {
        const newHeight = element.offsetHeight
        setHeight(newHeight)

        // Définit la CSS variable si demandée
        if (cssVariable) {
          document.documentElement.style.setProperty(
            cssVariable,
            `${newHeight}px`
          )
        }
      }
    }

    // Mesure initiale avec un léger délai pour s'assurer que le DOM est prêt
    const timeoutId = setTimeout(updateHeight, 0)

    // Écoute le redimensionnement
    window.addEventListener("resize", updateHeight)

    // Observer les changements de taille de l'élément
    let resizeObserver: ResizeObserver | null = null

    // Utilise la ref externe, ou la ref interne, ou cherche l'élément
    const observedElement =
      ref?.current ||
      elementRef.current ||
      (selector ? document.querySelector<HTMLElement>(selector) : null)

    if (observedElement) {
      elementRef.current = observedElement
      resizeObserver = new ResizeObserver(updateHeight)
      resizeObserver.observe(observedElement)
    }

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", updateHeight)
      resizeObserver?.disconnect()
    }
  }, [ref, selector, cssVariable])

  return height
}

// Hook spécialisé pour le header
export const useHeaderHeight = () => {
  return useElementHeight({
    selector: "header",
    cssVariable: "--header-height",
  })
}
