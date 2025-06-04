import { expect, test, describe, vi, beforeEach } from 'vitest'
import key from '../../api/key/[action]'
import type { VercelRequest, VercelResponse } from "@vercel/node";

vi.mock('nostr-tools', () => {
  return {
    generateSecretKey: () => new Uint8Array(32).fill(1),
    getPublicKey: () => '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
    nip19: {
      nsecEncode: () => 'nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96',
      npubEncode: () => 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m',
      decode: (input: string) => {
        if (input.startsWith('nsec')) {
          return {
            type: 'nsec',
            data: new Uint8Array(32).fill(1)
          };
        } else if (input.startsWith('npub')) {
          return {
            type: 'npub',
            data: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c'
          };
        } else {
          throw new Error('Invalid format');
        }
      }
    }
  };
});

vi.mock('@noble/hashes/utils', () => ({
  hexToBytes: () => new Uint8Array(32).fill(1),
  bytesToHex: () => '0101010101010101010101010101010101010101010101010101010101010101',
}));

function createMockRequest(query: Record<string, string> = {}): VercelRequest {
  return <VercelRequest><unknown>{
    query
  };
}

function createMockResponse() {
  let statusCode = 200;
  let jsonData: any = null;
  
  const res = <VercelResponse><unknown>{
    status: function(code: number) {
      statusCode = code;
      return res;
    },
    json: function(data: any) {
      jsonData = data;
      return res;
    }
  };
  
  return { res, getStatusCode: () => statusCode, getJsonData: () => jsonData };
}

describe('key/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('should generate valid key formats', () => {
    const req = createMockRequest({ action: 'generate' });
    const { res, getStatusCode, getJsonData } = createMockResponse();
    
    key(req, res);
    
    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toHaveProperty('sk');
    expect(getJsonData()).toHaveProperty('nsec');
    expect(getJsonData()).toHaveProperty('pk');
    expect(getJsonData()).toHaveProperty('npub');
    
    expect(getJsonData().sk).toBe('0101010101010101010101010101010101010101010101010101010101010101');
    expect(getJsonData().nsec).toBe('nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96');
    expect(getJsonData().pk).toBe('1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c');
    expect(getJsonData().npub).toBe('npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m');
  });
  
  test('should return object type', () => {
    const req = createMockRequest({ action: 'generate' });
    const { res } = createMockResponse();
    
    expect(key(req, res)).toBeTypeOf('object');
  });
});

describe('key/error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return 404 for invalid action', () => {
    const req = createMockRequest({ action: 'invalid_action' });
    const { res, getStatusCode, getJsonData } = createMockResponse();
    
    key(req, res);
    
    expect(getStatusCode()).toBe(404);
    expect(getJsonData()).toHaveProperty('error');
    expect(getJsonData().error).toBe('Not Found');
  });
  
  test('should return 404 when no action is provided', () => {
    const req = createMockRequest({});
    const { res, getStatusCode, getJsonData } = createMockResponse();
    
    key(req, res);
    
    expect(getStatusCode()).toBe(404);
    expect(getJsonData()).toHaveProperty('error');
    expect(getJsonData().error).toBe('Not Found');
  });
});
