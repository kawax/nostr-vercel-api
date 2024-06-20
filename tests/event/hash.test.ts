import {expect, test} from 'vitest'

import hash from '../../api/event/hash'

vi.mock('nostr-tools/pure', () => ({
    getEventHash: vi.fn()
}));

test('event/hash', () => {
    const req = {
        body: {
            event: {},
        }
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(hash(req, res)).toBe(res)
});
