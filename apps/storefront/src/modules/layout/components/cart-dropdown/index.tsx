"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { XMark } from "@medusajs/icons"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  }
  if ((cart?.shipping_methods?.length ?? 0) === 0) {
    return "delivery"
  }
  return "payment"
}

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef(totalItems)

  const timedOpen = () => {
    open()
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    setActiveTimer(setTimeout(close, 5000))
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, pathname])

  useEffect(() => {
    if (pathname.includes("/cart") || pathname.includes("/checkout")) {
      close()
    }
  }, [pathname])

  const checkoutHref = cartState
    ? `/checkout?step=${getCheckoutStep(cartState)}`
    : "/checkout"

  return (
    <div className="h-full z-50 flex items-center">
      <button
        type="button"
        onClick={open}
        className="relative flex items-center justify-center size-12 rounded-full hover:text-ui-fg-base"
        data-testid="nav-cart-link"
        aria-label={`Panier${totalItems ? ` (${totalItems})` : ""}`}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="stroke-current"
        >
          <path
            d="M7 9V7a5 5 0 0 1 10 0v2"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 9h14l-.9 10.125A2 2 0 0 1 16.108 21H7.892a2 2 0 0 1-1.992-1.875L5 9Z"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ui-bg-base text-[11px] font-medium text-ui-fg-base border border-ui-border-strong px-1">
            {totalItems}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              data-testid="cart-drawer-overlay"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[min(100%,90vw)] sm:w-2/5 lg:w-1/3 bg-white z-[70] shadow-2xl text-ui-fg-base flex flex-col"
              data-testid="nav-cart-dropdown"
              role="dialog"
              aria-modal="true"
              aria-label="Panier"
            >
              <div className="flex items-center justify-between px-[5vw] py-4 border-b border-gray-200 shrink-0">
                <h3 className="text-lg font-semibold">
                  Panier{totalItems > 0 ? ` (${totalItems})` : ""}
                </h3>
                <button
                  type="button"
                  onClick={close}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Fermer le panier"
                  data-testid="close-cart-button"
                >
                  <XMark className="w-5 h-5" />
                </button>
              </div>

              {cartState && cartState.items?.length ? (
                <>
                  <div className="flex-1 overflow-y-auto px-[5vw] divide-y divide-gray-100 no-scrollbar">
                    {cartState.items
                      .sort((a, b) => {
                        return (a.created_at ?? "") > (b.created_at ?? "")
                          ? -1
                          : 1
                      })
                      .map((item) => (
                        <div
                          className="flex gap-3 py-3"
                          key={item.id}
                          data-testid="cart-item"
                        >
                          <LocalizedClientLink
                            href={`/products/${item.product_handle}`}
                            onClick={close}
                            className="shrink-0 w-1/5"
                          >
                            <Thumbnail
                              thumbnail={item.thumbnail}
                              images={item.variant?.product?.images}
                              size="square"
                              className="!p-0 !w-full !rounded-md shadow-none"
                            />
                          </LocalizedClientLink>

                          <div className="flex flex-1 min-w-0 flex-col gap-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <LocalizedClientLink
                                href={`/products/${item.product_handle}`}
                                onClick={close}
                                className="text-small-regular font-medium truncate"
                                data-testid="product-link"
                              >
                                {item.title}
                              </LocalizedClientLink>
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                            <LineItemOptions
                              variant={item.variant}
                              data-testid="cart-item-variant"
                              data-value={item.variant}
                            />
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className="text-xsmall-regular text-ui-fg-subtle"
                                data-testid="cart-item-quantity"
                                data-value={item.quantity}
                              >
                                Qté {item.quantity}
                              </span>
                              <DeleteButton
                                id={item.id}
                                data-testid="cart-item-remove-button"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="shrink-0 border-t border-gray-200 px-[5vw] py-4 flex flex-col gap-3 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-ui-fg-base font-semibold">
                        Sous-total{" "}
                        <span className="font-normal text-ui-fg-subtle">
                          (hors taxes)
                        </span>
                      </span>
                      <span
                        className="text-large-semi"
                        data-testid="cart-subtotal"
                        data-value={subtotal}
                      >
                        {convertToLocale({
                          amount: subtotal,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>

                    <LocalizedClientLink href={checkoutHref} onClick={close}>
                      <Button
                        className="w-full font-semibold"
                        size="large"
                        data-testid="checkout-button"
                      >
                        Commander
                      </Button>
                    </LocalizedClientLink>

                    <LocalizedClientLink
                      href="/cart"
                      onClick={close}
                      className="text-center text-small-regular text-ui-fg-subtle hover:text-ui-fg-base underline underline-offset-4"
                      data-testid="go-to-cart-button"
                    >
                      Voir le panier
                    </LocalizedClientLink>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col gap-3 items-center justify-center px-[5vw]">
                  <div className="bg-gray-900 text-small-regular flex items-center justify-center size-6 rounded-full text-white">
                    <span>0</span>
                  </div>
                  <span>Votre panier est vide.</span>
                  <LocalizedClientLink href="/store" onClick={close}>
                    <Button data-testid="explore-products-button">
                      Voir nos produits
                    </Button>
                  </LocalizedClientLink>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CartDropdown
