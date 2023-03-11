import {expect, test} from 'vitest'

import list from '../../api/event/list'
import {VercelRequest, VercelResponse} from "@vercel/node";

vi.mock('nostr-tools', () => ({
    relayInit: () => {
        const relay = vi.importActual<typeof import('nostr-tools')>('nostr-tools')
        return {
            ...relay,
            connect: vi.fn(),
            on: vi.fn(),
            list: vi.fn(),
        }
    }
}));

test('event/list', () => {
    const req = {
        body: {
            filters: [{}],
            id: '',
            relay: '',
        }
    }

    const res = {
        status: (statusCode) => res,
        json: (jsonBody) => res,
    }

    expect(list(<VercelRequest>req, <VercelResponse>res)).toBeTypeOf("object")
});
