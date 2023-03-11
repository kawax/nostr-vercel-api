import {expect, test} from 'vitest'

import verify from '../../api/event/verify'

vi.mock('nostr-tools', () => ({
    verifySignature: vi.fn()
}));

test('event/verify', () => {
    const req = {
        body: {
            event: {},
        }
    }

    const res = {
        status: (statusCode) => res,
        json: (jsonBody) => res,
    }

    expect(verify(req, res)).toBe(res)
});
