type FormatDateParams = {
  date: string | Date
  locale?: string
  options?: Intl.DateTimeFormatOptions
}

export const formatDate = ({
  date,
  locale = "fr-FR",
  options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
}: FormatDateParams): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

// Fonction pour formater date + heure
export const formatDateTime = ({
  date,
  locale = "fr-FR",
  options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
}: FormatDateParams): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

