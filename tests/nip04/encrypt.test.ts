import { expect, test, describe, vi, beforeEach } from 'vitest'
import handler from '../../api/nip04/[action]'
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createMockRequest, createMockResponse } from '../test-utils';

vi.mock('nostr-tools', () => ({
    nip04: {
        encrypt: vi.fn(),
    },
}))

describe('nip04/encrypt', () => {
    let mockEncrypt: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        const { nip04 } = await import('nostr-tools');
        mockEncrypt = vi.mocked(nip04.encrypt);
    });

    test('should encrypt message successfully', async () => {
        const encryptedContent = 'encrypted-message-content';
        mockEncrypt.mockResolvedValue(encryptedContent);

        const req = createMockRequest({ action: 'encrypt' }, {
            sk: '0101010101010101010101010101010101010101010101010101010101010101',
            pk: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            content: 'Hello, this is a secret message!'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        await handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('encrypt', encryptedContent);
        expect(mockEncrypt).toHaveBeenCalledWith(
            '0101010101010101010101010101010101010101010101010101010101010101',
            '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            'Hello, this is a secret message!'
        );
    });

    test('should handle empty content', async () => {
        const encryptedContent = 'encrypted-empty-content';
        mockEncrypt.mockResolvedValue(encryptedContent);

        const req = createMockRequest({ action: 'encrypt' }, {
            sk: '0101010101010101010101010101010101010101010101010101010101010101',
            pk: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            content: ''
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        await handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('encrypt', encryptedContent);
        expect(mockEncrypt).toHaveBeenCalledWith(
            '0101010101010101010101010101010101010101010101010101010101010101',
            '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            ''
        );
    });

    test('should handle long content', async () => {
        const longContent = 'This is a very long message that contains multiple sentences and should test the encryption functionality with larger amounts of text to ensure it works correctly.';
        const encryptedContent = 'encrypted-long-content';
        mockEncrypt.mockResolvedValue(encryptedContent);

        const req = createMockRequest({ action: 'encrypt' }, {
            sk: '0101010101010101010101010101010101010101010101010101010101010101',
            pk: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            content: longContent
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        await handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('encrypt', encryptedContent);
        expect(mockEncrypt).toHaveBeenCalledWith(
            '0101010101010101010101010101010101010101010101010101010101010101',
            '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            longContent
        );
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
