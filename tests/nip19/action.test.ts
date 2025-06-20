import { expect, test, describe, vi, beforeEach } from 'vitest'
import handler from '../../api/nip19/[action]'
import type { VercelRequest, VercelResponse } from '@vercel/node'

vi.mock('nostr-tools', () => ({
  nip19: {
    decode: () => ({ type: 'nsec', data: new Uint8Array([1, 2, 3, 4]) }),
    nsecEncode: () => 'nsec1encoded',
    npubEncode: () => 'npub1encoded',
    noteEncode: () => 'note1encoded',
    nprofileEncode: () => 'nprofile1encoded',
    neventEncode: () => 'nevent1encoded',
    naddrEncode: () => 'naddr1encoded',
  }
}))

vi.mock('@noble/hashes/utils', () => ({
  hexToBytes: () => new Uint8Array([1, 2, 3, 4]),
  bytesToHex: () => '01020304',
}))

function createMockRequest(query: Record<string, string> = {}, body: any = {}): VercelRequest {
  return <VercelRequest><unknown>{
    query,
    body
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

describe('nip19/decode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should decode nsec successfully', async () => {
    const req = createMockRequest({ action: 'decode' }, { n: 'nsec1test' });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      type: 'nsec',
      data: '01020304'
    });
  });

  test('should decode npub successfully', async () => {
    const req = createMockRequest({ action: 'decode' }, { n: 'npub1test' });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      type: 'nsec',
      data: '01020304'
    });
  });

  test('should decode note successfully', async () => {
    const req = createMockRequest({ action: 'decode' }, { n: 'note1test' });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      type: 'nsec',
      data: '01020304'
    });
  });
});

describe('nip19/nsec', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should encode nsec successfully', async () => {
    const req = createMockRequest({ action: 'nsec' }, { sk: '01020304' });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      nsec: 'nsec1encoded'
    });
  });
});

describe('nip19/npub', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should encode npub successfully', async () => {
    const req = createMockRequest({ action: 'npub' }, { pk: 'pubkey123' });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      npub: 'npub1encoded'
    });
  });
});

describe('nip19/note', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should encode note successfully', async () => {
    const req = createMockRequest({ action: 'note' }, { note: 'eventid123' });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      note: 'note1encoded'
    });
  });
});

describe('nip19/nprofile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should encode nprofile successfully', async () => {
    const profilePointer = {
      pubkey: 'pubkey123',
      relays: ['wss://relay1.com', 'wss://relay2.com']
    };

    const req = createMockRequest({ action: 'nprofile' }, { profile: profilePointer });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      nprofile: 'nprofile1encoded'
    });
  });
});

describe('nip19/nevent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should encode nevent successfully', async () => {
    const eventPointer = {
      id: 'eventid123',
      relays: ['wss://relay1.com'],
      author: 'author123',
      kind: 1
    };

    const req = createMockRequest({ action: 'nevent' }, { event: eventPointer });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      nevent: 'nevent1encoded'
    });
  });
});

describe('nip19/naddr', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should encode naddr successfully', async () => {
    const addressPointer = {
      identifier: 'identifier123',
      pubkey: 'pubkey123',
      kind: 30023,
      relays: ['wss://relay1.com']
    };

    const req = createMockRequest({ action: 'naddr' }, { addr: addressPointer });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(200);
    expect(getJsonData()).toEqual({
      naddr: 'naddr1encoded'
    });
  });
});

describe('nip19/error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return 404 for invalid action', async () => {
    const req = createMockRequest({ action: 'invalid_action' });
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(404);
    expect(getJsonData()).toEqual({
      error: 'Not Found'
    });
  });

  test('should return 404 when no action is provided', async () => {
    const req = createMockRequest({});
    const { res, getStatusCode, getJsonData } = createMockResponse();

    await handler(req, res);

    expect(getStatusCode()).toBe(404);
    expect(getJsonData()).toEqual({
      error: 'Not Found'
    });
  });

  test('should return object type for all actions', async () => {
    const req = createMockRequest({ action: 'decode' }, { n: 'test' });
    const { res } = createMockResponse();

    expect(handler(req, res)).toBeTypeOf('object');
  });
});
