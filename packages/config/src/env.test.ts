import { describe, it, expect } from 'vitest';
import {
  serverEnvSchema,
  validateServerEnv,
  validatePublicEnv,
  formatEnvErrors,
} from './env';

const validLocalEnv = {
  NODE_ENV: 'development',
  APP_ENV: 'local',
  PORT: '3000',
  WORKER_PORT: '3001',
  PUBLIC_APP_URL: 'http://localhost:3000',
  LOG_LEVEL: 'info',
  MONGODB_URI: 'mongodb://localhost:27017/ptc_test',
  SESSION_SECRET: 'this_is_a_secure_session_secret_with_over_32_characters',
  SESSION_COOKIE_NAME: 'ptc_session',
  SESSION_COOKIE_SECURE: 'false',
  FIREBASE_PROJECT_ID: 'ptc-local-test',
  FIREBASE_CLIENT_EMAIL: 'test@ptc-local-test.iam.gserviceaccount.com',
  FIREBASE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgk...\\n-----END PRIVATE KEY-----',
  WORKER_POLL_INTERVAL_MS: '2000',
  WORKER_LEASE_DURATION_MS: '60000',
  WORKER_CONCURRENCY: '5',
};

const validProdEnv = {
  NODE_ENV: 'production',
  APP_ENV: 'production',
  PORT: '3000',
  WORKER_PORT: '3001',
  PUBLIC_APP_URL: 'https://parttimecoder.com',
  LOG_LEVEL: 'info',
  MONGODB_URI: 'mongodb+srv://app_user:strongpassword@cluster0.mongodb.net/ptc_prod',
  SESSION_SECRET: 'super_secure_production_secret_32_chars_minimum_here!',
  SESSION_COOKIE_NAME: 'ptc_session',
  SESSION_COOKIE_SECURE: 'true',
  FIREBASE_PROJECT_ID: 'ptc-production',
  FIREBASE_CLIENT_EMAIL: 'admin@ptc-production.iam.gserviceaccount.com',
  FIREBASE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgk...\\n-----END PRIVATE KEY-----',
  INTEGRATION_ENCRYPTION_KEY: 'aes_encryption_key_32_characters_long_minimum',
};

describe('Environment Configuration Validation (IMP-00-04)', () => {
  it('successfully validates a valid local development configuration', () => {
    const parsed = validateServerEnv(validLocalEnv);
    expect(parsed.APP_ENV).toBe('local');
    expect(parsed.PORT).toBe(3000);
    expect(parsed.SESSION_COOKIE_SECURE).toBe(false);
    expect(parsed.FIREBASE_PRIVATE_KEY).toContain('\n'); // Verifies newline replacement
  });

  it('successfully validates a valid production configuration', () => {
    const parsed = validateServerEnv(validProdEnv);
    expect(parsed.APP_ENV).toBe('production');
    expect(parsed.SESSION_COOKIE_SECURE).toBe(true);
    expect(parsed.MONGODB_URI).toContain('cluster0.mongodb.net');
  });

  it('fails closed when required server variables are missing', () => {
    const incompleteEnv = { ...validLocalEnv };
    delete (incompleteEnv as Record<string, unknown>).MONGODB_URI;

    expect(() => validateServerEnv(incompleteEnv)).toThrowError(
      /Server configuration validation failed: MONGODB_URI/
    );
  });

  it('fails closed when SESSION_SECRET is shorter than 32 characters', () => {
    const weakSecretEnv = { ...validLocalEnv, SESSION_SECRET: 'too_short' };
    const result = serverEnvSchema.safeParse(weakSecretEnv);
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatEnvErrors(result.error);
      expect(formatted.some((e) => e.includes('SESSION_SECRET'))).toBe(true);
      // Ensure the actual weak secret value is NOT echoed in the error
      expect(formatted.every((e) => !e.includes('too_short'))).toBe(true);
    }
  });

  it('rejects invalid URLs and ports', () => {
    const invalidUrlEnv = { ...validLocalEnv, PUBLIC_APP_URL: 'not-a-valid-url' };
    expect(() => validateServerEnv(invalidUrlEnv)).toThrowError(/PUBLIC_APP_URL/);

    const invalidPortEnv = { ...validLocalEnv, PORT: '99999' };
    expect(() => validateServerEnv(invalidPortEnv)).toThrowError(/PORT/);
  });

  it('enforces production security rules: localhost MongoDB rejected in production', () => {
    const invalidProd = {
      ...validProdEnv,
      MONGODB_URI: 'mongodb://localhost:27017/ptc_prod',
    };
    expect(() => validateServerEnv(invalidProd)).toThrowError(/MONGODB_URI/);
  });

  it('enforces production security rules: SESSION_COOKIE_SECURE must be true in production', () => {
    const insecureProd = {
      ...validProdEnv,
      SESSION_COOKIE_SECURE: 'false',
    };
    expect(() => validateServerEnv(insecureProd)).toThrowError(/SESSION_COOKIE_SECURE/);
  });

  it('enforces production security rules: INTEGRATION_ENCRYPTION_KEY required in production', () => {
    const missingEncKey = { ...validProdEnv };
    delete (missingEncKey as Record<string, unknown>).INTEGRATION_ENCRYPTION_KEY;
    expect(() => validateServerEnv(missingEncKey)).toThrowError(
      /INTEGRATION_ENCRYPTION_KEY/
    );
  });

  it('enforces conditional requirements when ENABLE_CLOUDINARY is true', () => {
    const cloudinaryEnabledMissingKeys = {
      ...validLocalEnv,
      ENABLE_CLOUDINARY: 'true',
    };
    expect(() => validateServerEnv(cloudinaryEnabledMissingKeys)).toThrowError(
      /CLOUDINARY_CLOUD_NAME/
    );
  });

  it('permits optional Cloudinary to be disabled in local development', () => {
    const cloudinaryDisabled = {
      ...validLocalEnv,
      ENABLE_CLOUDINARY: 'false',
    };
    const parsed = validateServerEnv(cloudinaryDisabled);
    expect(parsed.ENABLE_CLOUDINARY).toBe(false);
  });

  it('rejects unknown environment types', () => {
    const invalidEnvType = { ...validLocalEnv, APP_ENV: 'invalid_tier' };
    expect(() => validateServerEnv(invalidEnvType)).toThrowError(/APP_ENV/);
  });

  describe('Public Configuration Isolation', () => {
    it('validates allowlisted public client environment variables', () => {
      const validPublic = {
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyA_dummy_key',
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'ptc-local.firebaseapp.com',
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'ptc-local',
        NEXT_PUBLIC_DEFAULT_LOCALE: 'en',
      };
      const parsed = validatePublicEnv(validPublic);
      expect(parsed.NEXT_PUBLIC_FIREBASE_PROJECT_ID).toBe('ptc-local');
    });

    it('fails closed when public environment variable is missing', () => {
      const invalidPublic = {
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      };
      expect(() => validatePublicEnv(invalidPublic)).toThrowError(
        /NEXT_PUBLIC_FIREBASE_API_KEY/
      );
    });

    it('ensures server secrets are not recognized or required by public schema', () => {
      // serverEnvSchema requires MONGODB_URI and SESSION_SECRET, public schema must NOT
      const publicOnly = {
        NEXT_PUBLIC_APP_URL: 'https://parttimecoder.com',
        NEXT_PUBLIC_FIREBASE_API_KEY: 'test-key',
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'test-project',
      };
      const parsed = validatePublicEnv(publicOnly);
      expect((parsed as Record<string, unknown>).MONGODB_URI).toBeUndefined();
      expect((parsed as Record<string, unknown>).SESSION_SECRET).toBeUndefined();
    });
  });

  describe('Secret Sanitization in Error Reports', () => {
    it('never prints raw secret values in validation error output', () => {
      const rawSecret = 'SUPER_SECRET_VALUE_THAT_MUST_NEVER_LEAK';
      const invalidEnv = {
        ...validLocalEnv,
        SESSION_SECRET: 'short',
        PUBLIC_APP_URL: `http://localhost/${rawSecret}`, // invalid format or tested
        PORT: 'invalid_port',
      };

      const result = serverEnvSchema.safeParse(invalidEnv);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorStrings = formatEnvErrors(result.error);
        expect(errorStrings.join(' ')).not.toContain(rawSecret);
        expect(errorStrings.join(' ')).toContain('PORT');
        expect(errorStrings.join(' ')).toContain('SESSION_SECRET');
      }
    });
  });

  describe('Production Security Hardening & Placeholder Rejection', () => {
    it('rejects placeholder SESSION_SECRET in production', () => {
      const badEnv = {
        ...validProdEnv,
        SESSION_SECRET: 'replace_with_a_super_secret_key_32_characters_long',
      };
      expect(() => validateServerEnv(badEnv)).toThrowError(/SESSION_SECRET/);
    });

    it('rejects placeholder FIREBASE_PRIVATE_KEY in production', () => {
      const badEnv = {
        ...validProdEnv,
        FIREBASE_PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\\nplaceholder_key\\n-----END PRIVATE KEY-----',
      };
      expect(() => validateServerEnv(badEnv)).toThrowError(/FIREBASE_PRIVATE_KEY/);
    });

    it('rejects placeholder FIREBASE_CLIENT_EMAIL in production', () => {
      const badEnv = {
        ...validProdEnv,
        FIREBASE_CLIENT_EMAIL: 'user@example.com',
      };
      expect(() => validateServerEnv(badEnv)).toThrowError(/FIREBASE_CLIENT_EMAIL/);
    });

    it('rejects placeholder INTEGRATION_ENCRYPTION_KEY in production', () => {
      const badEnv = {
        ...validProdEnv,
        INTEGRATION_ENCRYPTION_KEY: 'dummy_encryption_key_with_over_32_characters_total',
      };
      expect(() => validateServerEnv(badEnv)).toThrowError(/INTEGRATION_ENCRYPTION_KEY/);
    });

    it('rejects placeholder MONGODB_URI in production', () => {
      const badEnv = {
        ...validProdEnv,
        MONGODB_URI: 'mongodb+srv://replace_with_user:pass@cluster.mongodb.net/ptc',
      };
      expect(() => validateServerEnv(badEnv)).toThrowError(/MONGODB_URI/);
    });

    it('rejects FIREBASE_PRIVATE_KEY without valid PEM headers', () => {
      const badEnv = {
        ...validLocalEnv,
        FIREBASE_PRIVATE_KEY: 'just-some-random-raw-private-key-string-without-headers',
      };
      expect(() => validateServerEnv(badEnv)).toThrowError(/FIREBASE_PRIVATE_KEY/);
    });

    it('rejects non-HTTPS PUBLIC_APP_URL in production', () => {
      const badEnv = {
        ...validProdEnv,
        PUBLIC_APP_URL: 'http://parttimecoder.com',
      };
      expect(() => validateServerEnv(badEnv)).toThrowError(/PUBLIC_APP_URL/);
    });

    it('throws error if validateServerEnv is invoked in browser context', () => {
      // Simulate browser window global
      (globalThis as unknown as { window: unknown }).window = {};
      try {
        expect(() => validateServerEnv(validLocalEnv)).toThrowError(
          /validateServerEnv called in client\/browser context/
        );
      } finally {
        delete (globalThis as unknown as { window?: unknown }).window;
      }
    });
  });
});
