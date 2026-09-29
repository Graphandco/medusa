"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { Locale } from "@lib/data/locales"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"

const SideMenuItems = {
  Accueil: "/",
  Boutique: "/store",
  Compte: "/account",
  Contact: "/contact",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

export const SideMenuDesktop = () => {
  return (
    <nav className="hidden small:flex items-center gap-x-6 h-full">
      {Object.entries(SideMenuItems).map(([name, href]) => (
        <LocalizedClientLink
          key={name}
          href={href}
          className="hover:text-ui-fg-base transition-colors"
          data-testid={`${name.toLowerCase()}-link`}
        >
          {name}
        </LocalizedClientLink>
      ))}
    </nav>
  )
}

export const SideMenuMobile = ({
  regions,
  locales,
  currentLocale,
}: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="small:hidden h-full flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base p-2"
        data-testid="nav-menu-button"
        aria-label="Ouvrir le menu"
      >
        <div className="flex flex-col gap-1.5 w-6">
          <span className="block h-0.5 w-full bg-current transition-all" />
          <span className="block h-0.5 w-full bg-current transition-all" />
          <span className="block h-0.5 w-full bg-current transition-all" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              data-testid="menu-overlay"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="fixed right-0 top-0 bottom-0 w-[300px] sm:w-[350px] bg-white z-[9999] shadow-2xl"
              data-testid="nav-menu-popup"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    data-testid="close-menu-button"
                    aria-label="Fermer le menu"
                  >
                    <XMark className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-6">
                  <ul className="flex flex-col gap-4">
                    {Object.entries(SideMenuItems).map(
                      ([name, href], index) => (
                        <motion.li
                          key={name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <LocalizedClientLink
                            href={href}
                            className="block text-2xl py-3 text-gray-900 hover:text-ui-fg-base transition-colors"
                            onClick={() => setIsOpen(false)}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </motion.li>
                      )
                    )}
                  </ul>
                </nav>

                <div className="border-t border-gray-200 p-6 space-y-4">
                  {!!locales?.length && (
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onMouseEnter={languageToggleState.open}
                      onMouseLeave={languageToggleState.close}
                    >
                      <LanguageSelect
                        toggleState={languageToggleState}
                        locales={locales}
                        currentLocale={currentLocale}
                      />
                      <ArrowRightMini
                        className={clx(
                          "transition-transform duration-150",
                          languageToggleState.state ? "-rotate-90" : ""
                        )}
                      />
                    </div>
                  )}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onMouseEnter={countryToggleState.open}
                    onMouseLeave={countryToggleState.close}
                  >
                    {regions && (
                      <CountrySelect
                        toggleState={countryToggleState}
                        regions={regions}
                      />
                    )}
                    <ArrowRightMini
                      className={clx(
                        "transition-transform duration-150",
                        countryToggleState.state ? "-rotate-90" : ""
                      )}
                    />
                  </div>
                  <Text className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Graph and Shop
                  </Text>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

const SideMenu = (props: SideMenuProps) => {
  return (
    <>
      <SideMenuDesktop />
      <SideMenuMobile {...props} />
    </>
  )
}

export default SideMenu
