/**
 * Point d'entrée du paquet `@shop-pagne/mocks` : données de démonstration et simulation de l'API.
 * Les types sont dans `@shop-pagne/types`.
 */

export { demoCatalogResponse, demoDesignResponse, demoShopResponse } from './api'
export { getDesign, listCatalog } from './catalog'
export { demoGetDesign, demoListCatalog, demoPatternSvg } from './demo'
export { DEMO_DESIGNS } from './fixtures/designs'
export { DEMO_SHOP } from './fixtures/shop'
export { PATTERN_KINDS, patternDataUri, patternSvg } from './pattern'
export { SLOW_DELAY_MS, parseScenario, scenarioEffect } from './scenario'
