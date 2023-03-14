import {expect, test} from 'vitest'
import list from '../../api/event/list'
import type {VercelRequest, VercelResponse} from "@vercel/node";
import type {Relay} from "nostr-tools";

vi.spyOn(console, 'log')

vi.mock('nostr-tools', () => ({
    relayInit: () => {
        const relay = vi.importActual<Relay>('nostr-tools')
        return {
            ...relay,
            connect: vi.fn(),
            on: vi.fn().mockImplementation((type, cb) => cb()),
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
