import {
    nip19,
    getPublicKey,
    generateSecretKey
} from 'nostr-tools'

import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

import type {VercelRequest, VercelResponse} from '@vercel/node';

export default function handler(request: VercelRequest, response: VercelResponse) {
    const {action}: { action?: string } = request.query

    switch (action) {
        case 'generate':
            return generate(request, response)
        case 'from_sk':
            return from_sk(request, response)
        case 'from_nsec':
            return from_nsec(request, response)
        case 'from_pk':
            return from_pk(request, response)
        case 'from_npub':
            return from_npub(request, response)
        default:
            return response.status(404).json({error: 'Not Found'})
    }
}

function generate(request: VercelRequest, response: VercelResponse): VercelResponse {
    const sk : Uint8Array = generateSecretKey()
    const nsec = nip19.nsecEncode(sk)

    const pk : string = getPublicKey(sk)
    const npub = nip19.npubEncode(pk)

    return response.status(200).json({
        sk: bytesToHex(sk),
        nsec: nsec,
        pk: pk,
        npub: npub,
    })
}

function from_sk(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {sk}: { sk?: string } = request.query

    const nsec = nip19.nsecEncode(hexToBytes(sk ?? ''))
    const pk = getPublicKey(hexToBytes(sk ?? ''))
    const npub = nip19.npubEncode(pk)

    return response.status(200).json({
        sk: sk,
        nsec: nsec,
        pk: pk,
        npub: npub,
    })
}

function from_nsec(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {nsec}: { nsec?: string } = request.query

    const {type, data} = nip19.decode(nsec ?? '');

    if (type !== 'nsec' || data === undefined || !(data instanceof Uint8Array)) {
        return response.status(500).json({error: 'type error'})
    }

    const pk = getPublicKey(data)
    const npub = nip19.npubEncode(pk)

    return response.status(200).json({
        sk: bytesToHex(data),
        nsec: nsec,
        pk: pk,
        npub: npub,
    })
}

function from_pk(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {pk}: { pk?: string } = request.query

    const npub = nip19.npubEncode(pk ?? '')

    return response.status(200).json({
        pk: pk,
        npub: npub,
    })
}

function from_npub(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {npub}: { npub?: string } = request.query

    const {type, data} = nip19.decode(npub ?? '')

    if (type !== 'npub' || data === undefined || typeof data !== 'string') {
        return response.status(500).json({error: 'type error'})
    }

    return response.status(200).json({
        pk: data,
        npub: npub,
    })
}
