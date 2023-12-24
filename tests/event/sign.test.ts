import {expect, test} from 'vitest'

import {
    getPublicKey,
    generateSecretKey
} from 'nostr-tools'

import { bytesToHex } from '@noble/hashes/utils'

import sign from '../../api/event/sign'

test('event/sign', () => {
    const req = {
        body: {
            event: {
                kind: 1,
                pubkey: getPublicKey(generateSecretKey()),
                created_at: 0,
                content: 'test',
                tags: [],
            },
            sk: bytesToHex(generateSecretKey()),
        }
    }

    const res = {
        status: (statusCode: any) => res,
        json: (jsonBody: any) => res,
    }

    expect(sign(req, res)).toBe(res)
});
