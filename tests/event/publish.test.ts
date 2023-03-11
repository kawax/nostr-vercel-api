import {expect, test, vi} from 'vitest'

import publish from '../../api/event/publish'
import {VercelRequest, VercelResponse} from "@vercel/node";

vi.mock('nostr-tools', () => ({
    getPublicKey: vi.fn(),
    getEventHash: vi.fn(),
    signEvent: vi.fn(),
    verifySignature: () => true,
    relayInit: () => {
        const pub = () => {
            const pub = vi.importActual<typeof import('nostr-tools')>('nostr-tools')
            return {
                ...pub,
                on: vi.fn().mockImplementationOnce((type, cb) => cb()).mockImplementationOnce((type, cb) => cb()),
            }
        }

        const relay = vi.importActual<typeof import('nostr-tools')>('nostr-tools')
        return {
            ...relay,
            connect: vi.fn(),
            on: vi.fn().mockImplementationOnce((type, cb) => cb()).mockImplementationOnce((type, cb) => cb()),
            close: vi.fn(),
            publish: pub,
        }
    },
}));

test('event/publish', () => {
    const req = {
        body: {
            event: {},
            sk: '',
            relay: 'wss://',
        }
    }

    const res = {
        status: (statusCode) => res,
        json: (jsonBody) => res,
    }

    expect(publish(<VercelRequest>req, <VercelResponse>res)).toBeTypeOf("object")
});

test('event/publish error', () => {
    const req = {
        body: {
            event: {},
            sk: '',
            relay: undefined,
        }
    }

    const res = {
        status: (statusCode) => res,
        json: (jsonBody) => res,
    }

    expect(publish(<VercelRequest>req, <VercelResponse>res)).toBeTypeOf("object")
});
