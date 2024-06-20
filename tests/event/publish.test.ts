import {expect, test} from 'vitest'
import publish from '../../api/event/publish'
import type {VercelRequest, VercelResponse} from "@vercel/node";
import {finishEvent, relayInit, verifySignature} from "nostr-tools";

vi.spyOn(console, 'log')

vi.mock('nostr-tools', () => ({
    finishEvent: vi.fn(),
    verifySignature: () => false,
    relayInit: () => false,
    Relay: {
        connect: vi.fn(),
        publish: vi.fn(),
    }
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
        status: (statusCode: any) => res,
        json: (jsonBody: any) => res,
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
        status: (statusCode: any) => res,
        json: (jsonBody: any) => res,
    }

    expect(publish(<VercelRequest>req, <VercelResponse>res)).toBeTypeOf("object")
});
