import { getMailerOptions } from './mail.config';

describe('SES mail configuration', () => {
  const env = {
    AWS_REGION: 'us-east-1',
    MAIL_FROM: 'website@flaviacanepa.cl',
    TARGET_EMAIL: 'artist@example.com',
  };

  it.each(['AWS_REGION', 'MAIL_FROM', 'TARGET_EMAIL'])(
    'rejects missing %s before accepting contact enquiries',
    (key) => {
      expect(() => getMailerOptions({ ...env, [key]: ' ' })).toThrow(
        `${key} is required`,
      );
    },
  );

  it('allows IAM roles without explicit access keys', async () => {
    const options = getMailerOptions(env);
    const client = options.transport.SES.sesClient;
    try {
      expect(await client.config.region()).toBe(env.AWS_REGION);
      expect(options.defaults.from).toBe(env.MAIL_FROM);
    } finally {
      client.destroy();
    }
  });
});
