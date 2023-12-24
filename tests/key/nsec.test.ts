import { expect, test } from 'vitest'

import key from '../../api/key/[action]'
import type {VercelRequest, VercelResponse} from "@vercel/node";

vi.mock('nostr-tools', () => ({
    generateSecretKey: vi.fn(),
    getPublicKey: vi.fn(),
    nip19: {
        nsecEncode: vi.fn(),
        npubEncode: vi.fn(),
        decode: () => ({
            type: 'nsec',
            data: 'test',
        }),
    },
}))

vi.mock('@noble/hashes/utils', () => ({
    hexToBytes: vi.fn(),
    bytesToHex: vi.fn(),
}))

test('key/from_sk', () => {
    const req = {
        query: {
            action: 'from_sk',
            sk: 'sk',
        },
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(key(<VercelRequest><unknown>req, <VercelResponse><unknown>res)).toBeTypeOf('object')
})

test('key/from_nsec', () => {
    const req = {
        query: {
            action: 'from_nsec',
            nsec: 'nsec',
        },
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(key(<VercelRequest><unknown>req, <VercelResponse><unknown>res)).toBeTypeOf('object')
})

test('key/from_npub error', () => {
    const req = {
        query: {
            action: 'from_npub',
            npub: 'npub',
        },
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(key(<VercelRequest><unknown>req, <VercelResponse><unknown>res)).toBeTypeOf('object')
})
