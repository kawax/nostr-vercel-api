import { expect, test, describe, vi, beforeEach } from 'vitest'
import handler from '../../api/nip19/[action]'
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createMockRequest, createMockResponse, mockProfilePointer, mockEventPointer, mockAddressPointer } from '../test-utils';

vi.mock('nostr-tools', () => ({
    nip19: {
        nsecEncode: vi.fn(),
        npubEncode: vi.fn(),
        noteEncode: vi.fn(),
        nprofileEncode: vi.fn(),
        neventEncode: vi.fn(),
        naddrEncode: vi.fn(),

    },
}))

vi.mock('@noble/hashes/utils', () => ({
    hexToBytes: vi.fn().mockReturnValue(new Uint8Array(32).fill(1))
}))

describe('nip19 encoding', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        
        const { nip19 } = await import('nostr-tools');
        vi.mocked(nip19.nsecEncode).mockReturnValue('nsec1test');
        vi.mocked(nip19.npubEncode).mockReturnValue('npub1test');
        vi.mocked(nip19.noteEncode).mockReturnValue('note1test');
        vi.mocked(nip19.nprofileEncode).mockReturnValue('nprofile1test');
        vi.mocked(nip19.neventEncode).mockReturnValue('nevent1test');
        vi.mocked(nip19.naddrEncode).mockReturnValue('naddr1test');

    });

    test('should encode nsec successfully', async () => {
        const req = createMockRequest({ action: 'nsec' }, {
            sk: '0101010101010101010101010101010101010101010101010101010101010101'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        const { hexToBytes } = await import('@noble/hashes/utils');
        vi.mocked(hexToBytes).mockReturnValue(new Uint8Array(32).fill(1));

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('nsec', 'nsec1test');
        const { nip19 } = await import('nostr-tools');
        expect(vi.mocked(nip19.nsecEncode)).toHaveBeenCalledWith(expect.any(Uint8Array));
    });

    test('should encode npub successfully', async () => {
        const req = createMockRequest({ action: 'npub' }, {
            pk: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('npub', 'npub1test');
        const { nip19 } = await import('nostr-tools');
        expect(vi.mocked(nip19.npubEncode)).toHaveBeenCalledWith('1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c');
    });

    test('should encode note successfully', async () => {
        const req = createMockRequest({ action: 'note' }, {
            note: 'test-event-id'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('note', 'note1test');
        const { nip19 } = await import('nostr-tools');
        expect(vi.mocked(nip19.noteEncode)).toHaveBeenCalledWith('test-event-id');
    });

    test('should encode nprofile successfully', async () => {
        const req = createMockRequest({ action: 'nprofile' }, {
            profile: mockProfilePointer
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('nprofile', 'nprofile1test');
        const { nip19 } = await import('nostr-tools');
        expect(vi.mocked(nip19.nprofileEncode)).toHaveBeenCalledWith(mockProfilePointer);
    });

    test('should encode nevent successfully', async () => {
        const req = createMockRequest({ action: 'nevent' }, {
            event: mockEventPointer
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('nevent', 'nevent1test');
        const { nip19 } = await import('nostr-tools');
        expect(vi.mocked(nip19.neventEncode)).toHaveBeenCalledWith(mockEventPointer);
    });

    test('should encode naddr successfully', async () => {
        const req = createMockRequest({ action: 'naddr' }, {
            addr: mockAddressPointer
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('naddr', 'naddr1test');
        const { nip19 } = await import('nostr-tools');
        expect(vi.mocked(nip19.naddrEncode)).toHaveBeenCalledWith(mockAddressPointer);
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
