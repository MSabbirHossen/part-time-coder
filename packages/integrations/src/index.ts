/**
 * @ptc/integrations - Social platform adapters, email providers, and storage interfaces
 */

export const SOCIAL_PROVIDERS = [
  'facebook',
  'instagram',
  'linkedin',
  'youtube',
  'x',
  'tiktok',
] as const;

export type SocialProviderKey = (typeof SOCIAL_PROVIDERS)[number];

export interface SocialPublishResult {
  provider: SocialProviderKey;
  success: boolean;
  externalPostId?: string;
  externalPostUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  publishedAt: string;
}
