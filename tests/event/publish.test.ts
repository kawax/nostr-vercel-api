import {expect, test} from 'vitest'
import publish from '../../api/event/publish'
import type {VercelRequest, VercelResponse} from "@vercel/node";
import type {Pub, Relay} from "nostr-tools";

vi.spyOn(console, 'log')

vi.mock('nostr-tools', () => ({
    getPublicKey: vi.fn(),
    getEventHash: vi.fn(),
    getSignature: vi.fn(),
    verifySignature: () => true,
    relayInit: () => {
        const pub = () => {
            const pub = vi.importActual<Pub>('nostr-tools')
            return {
                ...pub,
                on: vi.fn().mockImplementation((type, cb) => cb()),
            }
        }

        const relay = vi.importActual<Relay>('nostr-tools')
        return {
            ...relay,
            connect: vi.fn(),
            on: vi.fn().mockImplementation((type, cb) => cb()),
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
