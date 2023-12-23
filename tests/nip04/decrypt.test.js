import { expect, test } from 'vitest';
import handler from '../../api/nip04/[action]';
vi.mock('nostr-tools', () => ({
    nip04: {
        decrypt: () => 'test',
    },
}));
test('nip04/decrypt', () => {
    const req = {
        query: {
            action: 'decrypt',
        },
        body: {
            pk: 'pk',
            sk: 'sk',
            content: 'content',
        }
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(handler(req, res)).toBeTypeOf('object');
});
