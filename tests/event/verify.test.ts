import {expect, test} from 'vitest'

import verify from '../../api/event/verify'

import {
    finalizeEvent,
    generateSecretKey
} from 'nostr-tools'

test('event/verify', () => {
    const event = finalizeEvent(
        {
            kind: 1,
            tags: [],
            content: 'test',
            created_at: 0,
        },
        generateSecretKey(),
    )

    const req = {
        body: {
            event: event,
        }
    }

    const res = {
        status: (statusCode: any) => res,
        json: (jsonBody: any) => res,
    }

    expect(verify(req, res)).toBe(res)
});
