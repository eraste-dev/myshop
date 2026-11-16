/** Nombre minimal de chiffres d'un numéro de téléphone international. */
const MIN_DIGITS = 8

/** Nombre maximal de chiffres d'un numéro de téléphone international (norme E.164). */
const MAX_DIGITS = 15

/** Début des liens WhatsApp. */
const WHATSAPP_BASE = 'https://wa.me'

/**
 * Construit un lien WhatsApp vers un numéro, avec un message préparé facultatif.
 * Seuls les chiffres du numéro sont gardés ; le message est encodé pour l'adresse.
 * Voir spec 004, LAY-R8.
 *
 * @param number - Numéro au format international, avec ou sans `+`, espaces ou tirets.
 * @param message - Message à préremplir, facultatif.
 * @returns Le lien, ou `null` si le numéro n'a pas entre 8 et 15 chiffres.
 */
export function whatsappLink(number: string, message?: string): string | null {
  const digits = number.replace(/\D/g, '')

  if (digits.length < MIN_DIGITS || digits.length > MAX_DIGITS) {
    return null
  }

  const base = `${WHATSAPP_BASE}/${digits}`
  return message === undefined || message === '' ? base : `${base}?text=${encodeURIComponent(message)}`
}
