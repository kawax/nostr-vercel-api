import {expect, test} from 'vitest'

import sign from '../../api/event/sign'

vi.mock('nostr-tools', () => ({
    signEvent: vi.fn()
}));

test('event/sign', () => {
    const req = {
        body: {
            event: {},
            sk: '',
        }
    }

    const res = {
        status: (statusCode) => res,
        json: (jsonBody) => res,
    }

    expect(sign(req, res)).toBe(res)
});
