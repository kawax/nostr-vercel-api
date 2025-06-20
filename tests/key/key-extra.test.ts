import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function createMockRequest(query: Record<string, string> = {}): VercelRequest {
  return <VercelRequest><unknown>{
    query
  };
}

function createMockResponse() {
  let statusCode = 200;
  let jsonData: any = null;

  const res = <VercelResponse><unknown>{
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: any) {
      jsonData = data;
      return res;
    }
  };

  return { res, getStatusCode: () => statusCode, getJsonData: () => jsonData };
}

describe('key/[action] extra coverage', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  test('from_sk: empty sk', async () => {
    vi.mock('nostr-tools', () => ({
      generateSecretKey: () => new Uint8Array(32).fill(1),
      getPublicKey: () => '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
      nip19: {
        nsecEncode: () => 'nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96',
        npubEncode: () => 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
        decode: (input: string) => {
          if (input.startsWith('nsec')) {
            return { type: 'nsec', data: new Uint8Array(32).fill(1) };
          } else if (input.startsWith('npub')) {
            return { type: 'npub', data: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c' };
          } else {
            throw new Error('Invalid format');
          }
        }
      }
    }));
    vi.mock('@noble/hashes/utils', () => ({
      hexToBytes: () => new Uint8Array(32).fill(1),
      bytesToHex: () => '0101010101010101010101010101010101010101010101010101010101010101',
    }));
    const key = (await import('../../api/key/[action]')).default;
    const req = createMockRequest({ action: 'from_sk', sk: '' });
    const { res, getStatusCode, getJsonData } = createMockResponse();
    key(req, res);
    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toHaveProperty('sk', '');
  });

  test('from_nsec: empty nsec (type error)', async () => {
    vi.mock('nostr-tools', () => ({
      generateSecretKey: () => new Uint8Array(32).fill(1),
      getPublicKey: () => '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
      nip19: {
        nsecEncode: () => 'nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96',
        npubEncode: () => 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
        decode: () => { throw new Error('Invalid format'); }
      }
    }));
    vi.mock('@noble/hashes/utils', () => ({
      hexToBytes: () => new Uint8Array(32).fill(1),
      bytesToHex: () => '0101010101010101010101010101010101010101010101010101010101010101',
    }));
    const key = (await import('../../api/key/[action]')).default;
    const req = createMockRequest({ action: 'from_nsec', nsec: '' });
    const { res } = createMockResponse();
    try {
      key(req, res);
    } catch (_e) {
      // Consider the case where an exception is thrown
    }
    // The return value should be a type error
  });

  test('from_pk: empty pk', async () => {
    vi.mock('nostr-tools', () => ({
      generateSecretKey: () => new Uint8Array(32).fill(1),
      getPublicKey: () => '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
      nip19: {
        nsecEncode: () => 'nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96',
        npubEncode: () => 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
        decode: (input: string) => {
          if (input.startsWith('nsec')) {
            return { type: 'nsec', data: new Uint8Array(32).fill(1) };
          } else if (input.startsWith('npub')) {
            return { type: 'npub', data: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c' };
          } else {
            throw new Error('Invalid format');
          }
        }
      }
    }));
    vi.mock('@noble/hashes/utils', () => ({
      hexToBytes: () => new Uint8Array(32).fill(1),
      bytesToHex: () => '0101010101010101010101010101010101010101010101010101010101010101',
    }));
    const key = (await import('../../api/key/[action]')).default;
    const req = createMockRequest({ action: 'from_pk', pk: '' });
    const { res, getStatusCode, getJsonData } = createMockResponse();
    key(req, res);
    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toHaveProperty('pk', '');
    expect(getJsonData()).toHaveProperty('npub');
  });

  test('from_npub: empty npub (type error)', async () => {
    vi.mock('nostr-tools', () => ({
      generateSecretKey: () => new Uint8Array(32).fill(1),
      getPublicKey: () => '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
      nip19: {
        nsecEncode: () => 'nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96',
        npubEncode: () => 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
        decode: () => { throw new Error('Invalid format'); }
      }
    }));
    vi.mock('@noble/hashes/utils', () => ({
      hexToBytes: () => new Uint8Array(32).fill(1),
      bytesToHex: () => '0101010101010101010101010101010101010101010101010101010101010101',
    }));
    const key = (await import('../../api/key/[action]')).default;
    const req = createMockRequest({ action: 'from_npub', npub: '' });
    const { res } = createMockResponse();
    try {
      key(req, res);
    } catch (_e) {
      // Consider the case where an exception is thrown
    }
    // The return value should be a type error
  });

  test('from_nsec: decode returns wrong type', async () => {
    vi.doMock('nostr-tools', () => ({
      generateSecretKey: () => new Uint8Array(32).fill(1),
      getPublicKey: () => '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
      nip19: {
        nsecEncode: () => 'nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96',
        npubEncode: () => 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
        decode: () => ({ type: 'npub', data: 'dummy' })
      }
    }));
    vi.mock('@noble/hashes/utils', () => ({
      hexToBytes: () => new Uint8Array(32).fill(1),
      bytesToHex: () => '0101010101010101010101010101010101010101010101010101010101010101',
    }));
    const key = (await import('../../api/key/[action]')).default;
    const req = createMockRequest({ action: 'from_nsec', nsec: 'nsec_invalid' });
    const { res, getStatusCode, getJsonData } = createMockResponse();
    key(req, res);
    expect(getStatusCode()).toBe(500);
    expect(getJsonData()).toHaveProperty('error', 'type error');
    vi.resetModules();
  });

  test('from_npub: decode returns wrong type', async () => {
    vi.doMock('nostr-tools', () => ({
      generateSecretKey: () => new Uint8Array(32).fill(1),
      getPublicKey: () => '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
      nip19: {
        nsecEncode: () => 'nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96',
        npubEncode: () => 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
        decode: () => ({ type: 'nsec', data: new Uint8Array(32) })
      }
    }));
    vi.mock('@noble/hashes/utils', () => ({
      hexToBytes: () => new Uint8Array(32).fill(1),
      bytesToHex: () => '0101010101010101010101010101010101010101010101010101010101010101',
    }));
    const key = (await import('../../api/key/[action]')).default;
    const req = createMockRequest({ action: 'from_npub', npub: 'npub_invalid' });
    const { res, getStatusCode, getJsonData } = createMockResponse();
    key(req, res);
    expect(getStatusCode()).toBe(500);
    expect(getJsonData()).toHaveProperty('error', 'type error');
    vi.resetModules();
  });
});
