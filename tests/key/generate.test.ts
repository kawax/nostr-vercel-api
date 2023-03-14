import { expect, test } from 'vitest'

import key from '../../api/key/[action]'
import type {VercelRequest, VercelResponse} from "@vercel/node";

vi.mock('nostr-tools', () => ({
    generatePrivateKey: vi.fn(),
    getPublicKey: vi.fn(),
    nip19: {
        nsecEncode: vi.fn(),
        npubEncode: vi.fn(),
    },
}))

test('key/generate', () => {
    const req = {
        query: {
            action: 'generate',
        },
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(key(<VercelRequest><unknown>req, <VercelResponse><unknown>res)).toBeTypeOf('object')
})

test('key/error', () => {
    const req = {
        query: {
            action: 'test',
        },
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(key(<VercelRequest><unknown>req, <VercelResponse><unknown>res)).toBeTypeOf('object')
})
