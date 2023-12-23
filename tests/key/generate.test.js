import { expect, test } from 'vitest';
import key from '../../api/key/[action]';
vi.mock('nostr-tools', () => ({
    generateSecretKey: vi.fn(),
    getPublicKey: vi.fn(),
    nip19: {
        nsecEncode: vi.fn(),
        npubEncode: vi.fn(),
    },
}));
test('key/generate', () => {
    const req = {
        query: {
            action: 'generate',
        },
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(key(req, res)).toBeTypeOf('object');
});
test('key/error', () => {
    const req = {
        query: {
            action: 'test',
        },
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(key(req, res)).toBeTypeOf('object');
});
