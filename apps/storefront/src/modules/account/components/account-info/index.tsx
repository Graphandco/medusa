"use client"

import { Badge, Button, clx } from "@modules/common/components/ui"
import { useEffect } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  "data-testid"?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "Une erreur est survenue, veuillez réessayer",
  children,
  "data-testid": dataTestid,
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    toggle()
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="text-small-regular" data-testid={dataTestid}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="uppercase text-ui-fg-base">{label}</span>
          <div className="flex items-center gap-x-4">
            {typeof currentInfo === "string" ? (
              <span className="font-semibold" data-testid="current-info">
                {currentInfo}
              </span>
            ) : (
              currentInfo
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          size="small"
          className="shrink-0"
          onClick={handleToggle}
          type={state ? "reset" : "button"}
          data-testid="edit-button"
          data-active={state}
        >
          {state ? "Annuler" : "Modifier"}
        </Button>
      </div>

      <div
        className={clx(
          "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
          isSuccess ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
        data-testid="success-message"
      >
        <Badge className="p-2 my-4" color="green">
          <span>{label} mis à jour</span>
        </Badge>
      </div>

      <div
        className={clx(
          "transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden",
          isError ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
        data-testid="error-message"
      >
        <Badge className="p-2 my-4" color="red">
          <span>{errorMessage}</span>
        </Badge>
      </div>

      {state && (
        <div className="flex flex-col gap-y-2 py-4">
          <div>{children}</div>
          <div className="flex items-center justify-end mt-2">
            <Button
              isLoading={pending}
              className="w-full small:max-w-[140px]"
              type="submit"
              data-testid="save-button"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountInfo
