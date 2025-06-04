import { expect, test, describe, vi, beforeEach } from 'vitest'
import sign from '../../api/event/sign.js'
import { createMockRequest, createMockResponse, mockEventData } from '../test-utils';

vi.mock('@noble/curves/secp256k1', () => ({
    schnorr: {
        sign: vi.fn()
    }
}));

vi.mock('@noble/hashes/utils', () => ({
    bytesToHex: vi.fn(),
    hexToBytes: vi.fn()
}));

vi.mock('nostr-tools/pure', () => ({
    getEventHash: vi.fn()
}));

describe('event/sign', () => {
    let mockSchnorrSign: any;
    let mockGetEventHash: any;
    let mockBytesToHex: any;
    let mockHexToBytes: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        const { schnorr } = await import('@noble/curves/secp256k1');
        const { bytesToHex, hexToBytes } = await import('@noble/hashes/utils');
        const { getEventHash } = await import('nostr-tools/pure');
        
        mockSchnorrSign = vi.mocked(schnorr.sign);
        mockGetEventHash = vi.mocked(getEventHash);
        mockBytesToHex = vi.mocked(bytesToHex);
        mockHexToBytes = vi.mocked(hexToBytes);
    });

    test('should sign event successfully', () => {
        const mockHash = 'event-hash';
        const mockSecretKeyBytes = new Uint8Array(32).fill(1);
        const mockSignatureBytes = new Uint8Array(64).fill(2);
        const expectedSignature = 'signature-hex';

        mockGetEventHash.mockReturnValue(mockHash);
        mockHexToBytes.mockReturnValue(mockSecretKeyBytes);
        mockSchnorrSign.mockReturnValue(mockSignatureBytes);
        mockBytesToHex.mockReturnValue(expectedSignature);

        const req = createMockRequest({}, {
            event: mockEventData,
            sk: '0101010101010101010101010101010101010101010101010101010101010101'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        sign(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('sign', expectedSignature);
        expect(mockGetEventHash).toHaveBeenCalledWith(mockEventData);
        expect(mockHexToBytes).toHaveBeenCalledWith('0101010101010101010101010101010101010101010101010101010101010101');
        expect(mockSchnorrSign).toHaveBeenCalledWith(mockHash, mockSecretKeyBytes);
        expect(mockBytesToHex).toHaveBeenCalledWith(mockSignatureBytes);
    });

    test('should handle different event types', () => {
        const textNoteEvent = { ...mockEventData, kind: 1, content: 'Hello Nostr!' };
        const mockHash = 'text-note-hash';
        const expectedSignature = 'text-note-signature';

        mockGetEventHash.mockReturnValue(mockHash);
        mockHexToBytes.mockReturnValue(new Uint8Array(32).fill(1));
        mockSchnorrSign.mockReturnValue(new Uint8Array(64).fill(2));
        mockBytesToHex.mockReturnValue(expectedSignature);

        const req = createMockRequest({}, {
            event: textNoteEvent,
            sk: '0101010101010101010101010101010101010101010101010101010101010101'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        sign(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('sign', expectedSignature);
        expect(mockGetEventHash).toHaveBeenCalledWith(textNoteEvent);
    });

    test('should handle event with tags', () => {
        const eventWithTags = {
            ...mockEventData,
            tags: [['e', 'referenced-event'], ['p', 'mentioned-pubkey']]
        };
        const mockHash = 'tagged-event-hash';
        const expectedSignature = 'tagged-event-signature';

        mockGetEventHash.mockReturnValue(mockHash);
        mockHexToBytes.mockReturnValue(new Uint8Array(32).fill(1));
        mockSchnorrSign.mockReturnValue(new Uint8Array(64).fill(2));
        mockBytesToHex.mockReturnValue(expectedSignature);

        const req = createMockRequest({}, {
            event: eventWithTags,
            sk: '0101010101010101010101010101010101010101010101010101010101010101'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        sign(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('sign', expectedSignature);
        expect(mockGetEventHash).toHaveBeenCalledWith(eventWithTags);
    });
});
