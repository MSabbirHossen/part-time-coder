/**
 * @ptc/config - Central configuration and constants for Part-time Coder
 */

export const APP_CONFIG = {
  name: 'Part-time Coder',
  legalName: 'Part-time Coder',
  companySlug: 'part-time-coder',
  defaultLocale: 'en',
  supportedLocales: ['en', 'bn'] as const,
  defaultCurrency: 'USD',
  supportedCurrencies: ['USD', 'BDT'] as const,
  apiVersion: 'v1',
  apiPrefix: '/api/v1',
} as const;

export type SupportedLocale = (typeof APP_CONFIG.supportedLocales)[number];
export type SupportedCurrency = (typeof APP_CONFIG.supportedCurrencies)[number];

export const PORTS = {
  web: 3000,
  worker: 3001,
} as const;
