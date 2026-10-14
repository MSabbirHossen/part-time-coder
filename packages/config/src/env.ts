import { z } from 'zod';

export const APP_ENVIRONMENTS = ['local', 'test', 'staging', 'production'] as const;
export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

export const NODE_ENVIRONMENTS = ['development', 'test', 'production'] as const;
export type NodeEnvironment = (typeof NODE_ENVIRONMENTS)[number];

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Server-side environment variables schema.
 * NEVER expose these to the browser client.
 */
export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(NODE_ENVIRONMENTS).default('development'),
    APP_ENV: z.enum(APP_ENVIRONMENTS).default('local'),
    PORT: z.coerce.number().int().min(1024).max(65535).default(3000),
    WORKER_PORT: z.coerce.number().int().min(1024).max(65535).default(3001),
    PUBLIC_APP_URL: z.string().url(),

    // Logging
    LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),

    // MongoDB Database
    MONGODB_URI: z.string().min(1),

    // Session & Cookie Security
    SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
    SESSION_COOKIE_NAME: z.string().min(1).default('ptc_session'),
    SESSION_COOKIE_SECURE: z
      .string()
      .transform((val) => val === 'true')
      .default('false'),

    // Firebase Admin (Server-side identity verification)
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().email(),
    FIREBASE_PRIVATE_KEY: z.string().min(1),

    // Worker Runtime Config
    WORKER_POLL_INTERVAL_MS: z.coerce.number().int().min(100).default(2000),
    WORKER_LEASE_DURATION_MS: z.coerce.number().int().min(5000).default(60000),
    WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(20).default(5),

    // Optional Cloudinary Media Storage
    ENABLE_CLOUDINARY: z
      .string()
      .optional()
      .transform((val) => val === 'true'),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // Integration Credential Encryption (AES-256 for OAuth tokens in MongoDB)
    INTEGRATION_ENCRYPTION_KEY: z
      .string()
      .min(32, 'INTEGRATION_ENCRYPTION_KEY must be at least 32 characters')
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Helper to detect common insecure placeholder values
    const isPlaceholder = (val?: string) => {
      if (!val) return false;
      const lower = val.toLowerCase();
      return (
        lower.includes('replace_with') ||
        lower.includes('dummy') ||
        lower.includes('placeholder') ||
        lower.includes('your-project') ||
        lower.includes('example.com')
      );
    };

    // Firebase PEM structure check
    if (
      !data.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----') ||
      !data.FIREBASE_PRIVATE_KEY.includes('-----END PRIVATE KEY-----')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'FIREBASE_PRIVATE_KEY must contain valid PEM headers (-----BEGIN PRIVATE KEY----- / -----END PRIVATE KEY-----)',
        path: ['FIREBASE_PRIVATE_KEY'],
      });
    }

    // Production Hardened Invariants
    if (data.APP_ENV === 'production') {
      if (!data.PUBLIC_APP_URL.startsWith('https://')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'PUBLIC_APP_URL must use https:// in production',
          path: ['PUBLIC_APP_URL'],
        });
      }
      if (data.MONGODB_URI.includes('localhost') || data.MONGODB_URI.includes('127.0.0.1')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'MONGODB_URI cannot point to localhost in production',
          path: ['MONGODB_URI'],
        });
      }
      if (isPlaceholder(data.MONGODB_URI)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'MONGODB_URI cannot contain placeholder values in production',
          path: ['MONGODB_URI'],
        });
      }
      if (!data.SESSION_COOKIE_SECURE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'SESSION_COOKIE_SECURE must be true in production',
          path: ['SESSION_COOKIE_SECURE'],
        });
      }
      if (!data.INTEGRATION_ENCRYPTION_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'INTEGRATION_ENCRYPTION_KEY is required in production for OAuth token encryption',
          path: ['INTEGRATION_ENCRYPTION_KEY'],
        });
      } else if (isPlaceholder(data.INTEGRATION_ENCRYPTION_KEY)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'INTEGRATION_ENCRYPTION_KEY cannot contain insecure placeholder values in production',
          path: ['INTEGRATION_ENCRYPTION_KEY'],
        });
      }

      // Rejection of placeholder credentials in production
      if (isPlaceholder(data.SESSION_SECRET)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'SESSION_SECRET cannot contain placeholder values in production',
          path: ['SESSION_SECRET'],
        });
      }
      if (isPlaceholder(data.FIREBASE_PRIVATE_KEY)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'FIREBASE_PRIVATE_KEY cannot contain placeholder values in production',
          path: ['FIREBASE_PRIVATE_KEY'],
        });
      }
      if (isPlaceholder(data.FIREBASE_CLIENT_EMAIL)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'FIREBASE_CLIENT_EMAIL cannot contain placeholder values in production',
          path: ['FIREBASE_CLIENT_EMAIL'],
        });
      }
    }

    // Cloudinary conditional validation
    if (data.ENABLE_CLOUDINARY) {
      if (!data.CLOUDINARY_CLOUD_NAME) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CLOUDINARY_CLOUD_NAME is required when ENABLE_CLOUDINARY is true',
          path: ['CLOUDINARY_CLOUD_NAME'],
        });
      }
      if (!data.CLOUDINARY_API_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CLOUDINARY_API_KEY is required when ENABLE_CLOUDINARY is true',
          path: ['CLOUDINARY_API_KEY'],
        });
      }
      if (!data.CLOUDINARY_API_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CLOUDINARY_API_SECRET is required when ENABLE_CLOUDINARY is true',
          path: ['CLOUDINARY_API_SECRET'],
        });
      }
    }
  });

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Public client-side environment variables schema.
 * ONLY allowlisted NEXT_PUBLIC_ variables can be included here.
 */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['en', 'bn']).default('en'),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

/**
 * Formats Zod validation issues into sanitized error reports
 * NEVER echoes actual secret values in error messages.
 */
export function formatEnvErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.');
    return `[Config Error] Variable "${path}": ${issue.message}`;
  });
}

/**
 * Validates server environment variables.
 * Fails closed with sanitized error output if validation fails.
 */
export function validateServerEnv(
  rawEnv: Record<string, unknown> = process.env
): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL: validateServerEnv called in client/browser context. Server secrets must never be exposed to the browser.');
  }

  const result = serverEnvSchema.safeParse(rawEnv);

  if (!result.success) {
    const formattedErrors = formatEnvErrors(result.error);
    const errorMessage = [
      '=================================================================',
      'CRITICAL: Server configuration validation failed at startup.',
      ...formattedErrors,
      '=================================================================',
    ].join('\n');

    console.error(errorMessage);
    throw new Error(`Server configuration validation failed: ${result.error.issues.map(i => i.path.join('.')).join(', ')}`);
  }

  // Normalize Firebase private key line breaks
  const env = result.data;
  if (env.FIREBASE_PRIVATE_KEY) {
    env.FIREBASE_PRIVATE_KEY = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
  }

  return env;
}

/**
 * Validates public client environment variables.
 */
export function validatePublicEnv(
  rawEnv: Record<string, unknown> = process.env
): PublicEnv {
  const result = publicEnvSchema.safeParse(rawEnv);

  if (!result.success) {
    const formattedErrors = formatEnvErrors(result.error);
    console.error('Public client configuration validation failed:\n' + formattedErrors.join('\n'));
    throw new Error(`Public client configuration validation failed: ${result.error.issues.map(i => i.path.join('.')).join(', ')}`);
  }

  return result.data;
}
