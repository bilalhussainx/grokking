import { describe, expect, it } from 'vitest';
import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { config } from './middleware';

describe('public Daybreak font assets', () => {
  const matches = (url: string) => unstable_doesMiddlewareMatch({ config, nextConfig: {}, url });

  it('serves the self-hosted font files without an auth redirect', () => {
    expect(matches('/fonts/daybreak/atkinson-hyperlegible-400.woff2')).toBe(false);
    expect(matches('/fonts/daybreak/noto-nastaliq-urdu.woff2?v=1')).toBe(false);
    expect(matches('/opengraph-image?preview=1')).toBe(false);
  });

  it('keeps application routes and other paths inside the middleware boundary', () => {
    for (const path of ['/', '/cc/dashboard', '/api/cc/schools', '/fonts/private.woff2', '/fonts/daybreak/account', '/fonts/daybreak/nested/account.woff2', '/cc/opengraph-image', '/opengraph-image/account']) {
      expect(matches(path), path).toBe(true);
    }
  });
});
