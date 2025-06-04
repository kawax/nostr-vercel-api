import { schnorr } from '@noble/curves/secp256k1'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { getEventHash } from 'nostr-tools'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Event } from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {event, sk}: { event: Event, sk: string } = request.body

    const sign = bytesToHex(schnorr.sign(getEventHash(event), hexToBytes(sk)))

    return response.status(200).json({
        sign: sign,
    })
}
