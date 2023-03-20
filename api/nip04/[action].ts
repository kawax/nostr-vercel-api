import {nip04} from 'nostr-tools'
import {Crypto} from "@peculiar/webcrypto";

import type {VercelRequest, VercelResponse} from '@vercel/node'

/* c8 ignore next 3 */
if (!('crypto' in globalThis)) {
    globalThis.crypto = new Crypto();
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {action}: { action?: string } = request.query

    switch (action) {
        case 'encrypt':
            return encrypt(request, response)
        case 'decrypt':
            return decrypt(request, response)
        default:
            return response.status(404).json({error: 'Not Found'})
    }
}

async function encrypt(request: VercelRequest, response: VercelResponse): Promise<VercelResponse> {
    const {sk, pk, content}: { sk: string, pk: string, content: string } = request.body

    const encrypt: string = await nip04.encrypt(sk, pk, content);

    return response.status(200).json({
        encrypt: encrypt,
    })
}

async function decrypt(request: VercelRequest, response: VercelResponse): Promise<VercelResponse> {
    const {sk, pk, content}: { sk: string, pk: string, content: string } = request.body

    const decrypt: string = await nip04.decrypt(sk, pk, content);

    return response.status(200).json({
        decrypt: decrypt,
    })
}
