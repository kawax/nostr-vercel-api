import {expect, test} from 'vitest'
import get from '../../api/event/get'
import type {VercelRequest, VercelResponse} from "@vercel/node";
import {SimplePool} from "nostr-tools";

vi.spyOn(console, 'log')

vi.mock('nostr-tools', () => {
    const SimplePool = vi.fn()
    SimplePool.prototype.get = vi.fn()

    return { SimplePool }
});

test('event/get', () => {
    const req = {
        body: {
            filter: {},
            id: '',
            relay: '',
        }
    }

    const res = {
        status: (statusCode: any) => res,
        json: (jsonBody: any) => res,
    }

    expect(get(<VercelRequest>req, <VercelResponse>res)).toBeTypeOf("object")
});
