import { expect, test } from 'vitest';
import handler from '../../api/nip04/[action]';
vi.mock('nostr-tools', () => ({
    nip04: {
        encrypt: () => 'test',
    },
}));
test('nip04/encrypt', () => {
    const req = {
        query: {
            action: 'encrypt',
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
test('nip04/error', () => {
    const req = {
        query: {
            action: '',
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
