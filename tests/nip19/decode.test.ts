import { expect, test, describe, vi, beforeEach } from 'vitest'
import handler from '../../api/nip19/[action]'
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createMockRequest, createMockResponse } from '../test-utils';

vi.mock('nostr-tools', () => ({
    nip19: {
        decode: vi.fn()
    },
}))

describe('nip19/decode', () => {
    let mockDecode: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        const { nip19 } = await import('nostr-tools');
        mockDecode = vi.mocked(nip19.decode);
    });

    test('should decode nsec successfully', () => {
        mockDecode.mockReturnValue({
            type: 'nsec',
            data: new Uint8Array(32).fill(1)
        });

        const req = createMockRequest({ action: 'decode' }, {
            n: 'nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('type', 'nsec');
        expect(getJsonData()).toHaveProperty('data');
        expect(mockDecode).toHaveBeenCalledWith('nsec1j4c6269y9w0q2er2xjw8sv2ehyrtfxq3jwgdlxj8d2v3r2z9qnqq9t3g96');
    });

    test('should decode npub successfully', () => {
        mockDecode.mockReturnValue({
            type: 'npub',
            data: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c'
        });

        const req = createMockRequest({ action: 'decode' }, {
            n: 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('type', 'npub');
        expect(getJsonData()).toHaveProperty('data', '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c');
    });

    test('should decode note successfully', () => {
        mockDecode.mockReturnValue({
            type: 'note',
            data: 'test-event-id'
        });

        const req = createMockRequest({ action: 'decode' }, {
            n: 'note1test'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('type', 'note');
        expect(getJsonData()).toHaveProperty('data', 'test-event-id');
    });

    test('should handle decode error', () => {
        mockDecode.mockImplementation(() => {
            throw new Error('Invalid format');
        });

        const req = createMockRequest({ action: 'decode' }, {
            n: 'invalid-format'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(500);
        expect(getJsonData()).toHaveProperty('error', 'error');
    });

    test('should return 404 for invalid action', () => {
        const req = createMockRequest({ action: 'invalid' }, {});
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(404);
        expect(getJsonData()).toHaveProperty('error', 'Not Found');
    });

    test('should return 404 for missing action', () => {
        const req = createMockRequest({}, {});
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(404);
        expect(getJsonData()).toHaveProperty('error', 'Not Found');
    });
})
