import {expect, test} from 'vitest'
import publish from '../../api/event/publish'
import type {VercelRequest, VercelResponse} from "@vercel/node";

vi.spyOn(console, 'log')

vi.mock('nostr-tools', () => ({
    finalizeEvent: vi.fn(),
    verifyEvent: () => false,
}));

vi.mock('nostr-tools', () => ({
    Relay: {
        connect: vi.fn(),
        publish: vi.fn(),
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
