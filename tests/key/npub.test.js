import { expect, test } from 'vitest'

import key from '../../api/key/[action]'

vi.mock('nostr-tools', () => ({
    generatePrivateKey: vi.fn(),
    getPublicKey: vi.fn(),
    nip19: {
        nsecEncode: vi.fn(),
        npubEncode: vi.fn(),
        decode: () => ({
            type: 'npub',
            data: 'test',
        }),
    },
}))

test('key/from_pk', () => {
    const req = {
        query: {
            action: 'from_pk',
            pk: 'pk',
        },
    }

    const res = {
        status: () => res,
        json: () => res,
    }

    expect(key(req, res)).toBeTypeOf('object')
})

test('key/from_npub', () => {
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

    expect(key(req, res)).toBeTypeOf('object')
})

test('key/from_nsec error', () => {
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

    expect(key(req, res)).toBeTypeOf('object')
})
