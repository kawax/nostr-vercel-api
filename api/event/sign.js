import { schnorr } from '@noble/curves/secp256k1'
import { bytesToHex } from '@noble/hashes/utils'
import { getEventHash } from 'nostr-tools/pure'

export default function handler (request, response) {
    const {event, sk} = request.body

    const sign = bytesToHex(schnorr.sign(getEventHash(event), Uint8Array.from(Buffer.from(sk, "hex"))))

    return response.status(200).json({
        sign: sign,
    })
}
