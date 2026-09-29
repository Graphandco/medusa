"use client"

import { Button } from "@modules/common/components/ui"
import Input from "@modules/common/components/input"
import Textarea from "@modules/common/components/textarea"

const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Formulaire soumis")
  }

  return (
    <div className="content-container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl-semi mb-2" data-testid="contact-page-title">
            Nous contacter
          </h1>
          <p className="text-base-regular text-ui-fg-subtle">
            Remplissez le formulaire ci-dessous et nous vous répondrons dans les
            plus brefs délais.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <Input
            label="Nom"
            name="name"
            type="text"
            required
            autoComplete="name"
            data-testid="contact-name-input"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            data-testid="contact-email-input"
          />

          <Textarea
            label="Message"
            name="message"
            rows={6}
            required
            data-testid="contact-message-input"
          />

          <Button
            variant="primary"
            size="large"
            type="submit"
            className="mt-4"
            data-testid="contact-submit-button"
          >
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
