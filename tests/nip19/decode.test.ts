import { expect, test } from 'vitest'

import handler from '../../api/nip19/[action]'
import type {VercelRequest, VercelResponse} from "@vercel/node";

vi.mock('nostr-tools', () => ({
    nip19: {
        decode: () => ({
            type: 'nsec',
            data: 'test',
        }),
    },
}))

test('nip19/decode', () => {
    const req = {
        query: {
            action: 'decode',
        },
        body: {
            n: 'n',
        }
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(handler(<VercelRequest><unknown>req, <VercelResponse><unknown>res)).toBeTypeOf('object')
})

test('nip19/error', () => {
    const req = {
        query: {
            action: '',
        }
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(handler(<VercelRequest><unknown>req, <VercelResponse><unknown>res)).toBeTypeOf('object')
})
