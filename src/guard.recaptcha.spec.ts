import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { RecaptchaGuard } from './guard.recaptcha';

describe('reCAPTCHA verification with native fetch', () => {
  const guard = new RecaptchaGuard();
  const originalSecret = process.env.RECAPTCH_V3_SECRET;
  const context = (token?: string) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ body: { token } }) }),
    }) as ExecutionContext;

  beforeEach(() => {
    process.env.RECAPTCH_V3_SECRET = 'test-secret';
    jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalSecret === undefined) delete process.env.RECAPTCH_V3_SECRET;
    else process.env.RECAPTCH_V3_SECRET = originalSecret;
  });

  it('verifies a token using a POST body and a request timeout', async () => {
    jest.mocked(fetch).mockResolvedValue(Response.json({ success: true }));
    await expect(guard.canActivate(context('test-token'))).resolves.toBe(true);
    const [url, options] = jest.mocked(fetch).mock.calls[0];
    expect(url).toBe('https://www.google.com/recaptcha/api/siteverify');
    expect(options?.method).toBe('POST');
    expect(options?.body?.toString()).toBe(
      'response=test-token&secret=test-secret',
    );
    expect(options?.signal).toBeInstanceOf(AbortSignal);
  });

  it('rejects unsuccessful verification', async () => {
    jest.mocked(fetch).mockResolvedValue(Response.json({ success: false }));
    await expect(guard.canActivate(context('test-token'))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('rejects an HTTP error before reading the response', async () => {
    jest
      .mocked(fetch)
      .mockResolvedValue(new Response('Unavailable', { status: 503 }));
    await expect(guard.canActivate(context('test-token'))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('does not contact Google without a token or configured secret', async () => {
    await expect(guard.canActivate(context())).rejects.toThrow(
      ForbiddenException,
    );
    delete process.env.RECAPTCH_V3_SECRET;
    await expect(guard.canActivate(context('test-token'))).rejects.toThrow(
      ForbiddenException,
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('does not authorize an enquiry after a network failure', async () => {
    jest.mocked(fetch).mockRejectedValue(new Error('Network unavailable'));
    await expect(guard.canActivate(context('test-token'))).rejects.toThrow(
      ForbiddenException,
    );
  });
});
