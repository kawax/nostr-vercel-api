import { expect, test, describe, vi, beforeEach } from 'vitest'
import handler from '../../api/nip04/[action]'
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createMockRequest, createMockResponse } from '../test-utils';

vi.mock('nostr-tools', () => ({
    nip04: {
        decrypt: vi.fn(),
    },
}))

describe('nip04/decrypt', () => {
    let mockDecrypt: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        const { nip04 } = await import('nostr-tools');
        mockDecrypt = vi.mocked(nip04.decrypt);
    });

    test('should decrypt message successfully', async () => {
        const decryptedContent = 'Hello, this is a secret message!';
        mockDecrypt.mockResolvedValue(decryptedContent);

        const req = createMockRequest({ action: 'decrypt' }, {
            sk: '0101010101010101010101010101010101010101010101010101010101010101',
            pk: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            content: 'encrypted-message-content'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        await handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('decrypt', decryptedContent);
        expect(mockDecrypt).toHaveBeenCalledWith(
            '0101010101010101010101010101010101010101010101010101010101010101',
            '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            'encrypted-message-content'
        );
    });

    test('should handle empty decrypted content', async () => {
        const decryptedContent = '';
        mockDecrypt.mockResolvedValue(decryptedContent);

        const req = createMockRequest({ action: 'decrypt' }, {
            sk: '0101010101010101010101010101010101010101010101010101010101010101',
            pk: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            content: 'encrypted-empty-content'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        await handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('decrypt', decryptedContent);
    });

    test('should handle long decrypted content', async () => {
        const longDecryptedContent = 'This is a very long message that was encrypted and is now being decrypted to test the functionality with larger amounts of text.';
        mockDecrypt.mockResolvedValue(longDecryptedContent);

        const req = createMockRequest({ action: 'decrypt' }, {
            sk: '0101010101010101010101010101010101010101010101010101010101010101',
            pk: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            content: 'encrypted-long-content'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        await handler(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('decrypt', longDecryptedContent);
        expect(mockDecrypt).toHaveBeenCalledWith(
            '0101010101010101010101010101010101010101010101010101010101010101',
            '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            'encrypted-long-content'
        );
    });

    test('should handle decryption error', async () => {
        mockDecrypt.mockImplementation(() => {
            throw new Error('Decryption failed');
        });

        const req = createMockRequest({ action: 'decrypt' }, {
            sk: '0101010101010101010101010101010101010101010101010101010101010101',
            pk: '1a1c0e2e64c2ba5a213b3f1e3b9a8e1d9c8c8e6d6a4c2e0a8c0e2e4c6a8e0a2c',
            content: 'invalid-encrypted-content'
        });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        await handler(req, res);

        expect(getStatusCode()).toBe(404);
        expect(getJsonData()).toHaveProperty('error', 'Not Found');
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

