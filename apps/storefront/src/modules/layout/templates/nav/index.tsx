import { Suspense } from "react"
import Image from "next/image"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import {
  SideMenuDesktop,
  SideMenuMobile,
} from "@modules/layout/components/side-menu"

async function CustomerName() {
  const customer = await retrieveCustomer()

  return (
    <LocalizedClientLink
      className="hover:text-ui-fg-base"
      href="/account"
      data-testid="nav-account-link"
    >
      {customer?.first_name || "Compte"}
    </LocalizedClientLink>
  )
}

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative py-4 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular gap-x-4">
          <div className="flex items-center h-full shrink-0">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase flex items-center gap-x-2"
              data-testid="nav-store-link"
            >
              <Image src="/logo.svg" alt="Logo" width={30} height={30} />
              Jewels & Co
            </LocalizedClientLink>
          </div>

          <div className="hidden small:flex flex-1 justify-center">
            <SideMenuDesktop />
          </div>

          <div className="flex items-center gap-x-4 small:gap-x-6 h-full justify-end ml-auto">
            <Search />
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    className="hover:text-ui-fg-base"
                    href="/account"
                    data-testid="nav-account-link"
                  >
                    Compte
                  </LocalizedClientLink>
                }
              >
                <CustomerName />
              </Suspense>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="relative flex items-center justify-center w-12 h-12 rounded-full hover:text-ui-fg-base"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <span className="sr-only">Panier</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            <SideMenuMobile
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>
        </nav>
      </header>
    </div>
  )
}
