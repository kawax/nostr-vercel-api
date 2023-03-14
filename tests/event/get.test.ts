import {expect, test} from 'vitest'
import get from '../../api/event/get'
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
            get: vi.fn(),
        }
    }
}));

test('event/get', () => {
    const req = {
        body: {
            filter: {},
            id: '',
            relay: '',
        }
    }

    const res = {
        status: (statusCode) => res,
        json: (jsonBody) => res,
    }

    expect(get(<VercelRequest>req, <VercelResponse>res)).toBeTypeOf("object")
});
