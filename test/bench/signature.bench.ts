import { bench } from 'vitest';
import { generateSignatureHtml } from '../../src/signature';

type SignatureData = {
  name: string;
  title: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  logoUrl: string;
  linkedinUrl?: string | null;
};

const sample: SignatureData = {
  name: 'Jane Developer',
  title: 'Software Engineer',
  email: 'jane@example.com',
  phone: '555-123-4567',
  website: 'https://example.com',
  logoUrl: 'https://example.com/logo.png',
  linkedinUrl: 'https://linkedin.com/in/jane',
};

bench('generateSignatureHtml - typical input', () => {
  const out = generateSignatureHtml(sample);
  void out;
});

bench('generateSignatureHtml - async (if returns Promise)', async () => {
  const maybePromise = generateSignatureHtml(sample) as unknown;
  if (maybePromise && typeof (maybePromise as any).then === 'function') {
    await (maybePromise as any);
  } else {
    void maybePromise;
  }
});
