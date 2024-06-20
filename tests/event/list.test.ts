import {expect, test} from 'vitest'
import list from '../../api/event/list'
import type {VercelRequest, VercelResponse} from "@vercel/node";

vi.spyOn(console, 'log')

vi.mock('nostr-tools', () => {
    const SimplePool = vi.fn()
    SimplePool.prototype.querySync = vi.fn()

    return { SimplePool }
});

test('event/list', () => {
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

    expect(list(<VercelRequest>req, <VercelResponse>res)).toBeTypeOf("object")
});
