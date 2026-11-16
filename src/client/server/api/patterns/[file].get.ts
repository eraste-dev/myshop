import { demoPatternSvg } from '@shop-pagne/mocks'

/** `GET /api/patterns/<coloris>.svg` : image de démonstration d'un coloris, avec `?zoom=2` pour la vue détail. */
export default defineEventHandler((event) => {
  const zoomParam = getQuery(event).zoom
  const zoom = typeof zoomParam === 'string' ? Number(zoomParam) : undefined
  const svg = demoPatternSvg(getRouterParam(event, 'file') ?? '', zoom)

  if (svg === undefined) {
    throw createError({ statusCode: 404, statusMessage: 'Image introuvable' })
  }

  setHeader(event, 'content-type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=300')
  // Durcissement : jamais interprété comme autre chose qu'une image, aucun script ni contenu externe autorisé.
  setHeader(event, 'x-content-type-options', 'nosniff')
  setHeader(event, 'content-security-policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox")
  return svg
})
