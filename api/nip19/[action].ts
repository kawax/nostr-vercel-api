import {nip19} from 'nostr-tools'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

import type {VercelRequest, VercelResponse} from '@vercel/node'

import type {ProfilePointer, EventPointer, AddressPointer} from 'nostr-tools/lib/types/nip19'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {action}: { action?: string } = request.query

    switch (action) {
        case 'decode':
            return decode(request, response)
        case 'nsec':
            return nsecEncode(request, response)
        case 'npub':
            return npubEncode(request, response)
        case 'note':
            return noteEncode(request, response)
        case 'nprofile':
            return nprofileEncode(request, response)
        case 'nevent':
            return neventEncode(request, response)
        case 'naddr':
            return naddrEncode(request, response)
        case 'nrelay':
            return nrelayEncode(request, response)
        default:
            return response.status(404).json({error: 'Not Found'})
    }
}

function decode(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {n}: { n: string } = request.body

    const {type, data} = nip19.decode(n);

    return response.status(200).json({
        type: type,
        data: data instanceof Uint8Array ? bytesToHex(data) : data,
    })
}

function nsecEncode(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {sk}: { sk: string } = request.body

    const nsec = nip19.nsecEncode(hexToBytes(sk));

    return response.status(200).json({
        nsec: nsec,
    })
}

function npubEncode(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {pk}: { pk: string } = request.body

    const npub = nip19.npubEncode(pk);

    return response.status(200).json({
        npub: npub,
    })
}

function noteEncode(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {note}: { note: string } = request.body

    const id = nip19.noteEncode(note);

    return response.status(200).json({
        note: id,
    })
}

function nprofileEncode(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {profile}: { profile: ProfilePointer } = request.body

    const nprofile = nip19.nprofileEncode(profile);

    return response.status(200).json({
        nprofile: nprofile,
    })
}

function neventEncode(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {event}: { event: EventPointer } = request.body

    const nevent = nip19.neventEncode(event);

    return response.status(200).json({
        nevent: nevent,
    })
}

function naddrEncode(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {addr}: { addr: AddressPointer } = request.body

    const naddr = nip19.naddrEncode(addr);

    return response.status(200).json({
        naddr: naddr,
    })
}

function nrelayEncode(request: VercelRequest, response: VercelResponse): VercelResponse {
    const {relay}: { relay: string } = request.body

    const nrelay: string = nip19.nrelayEncode(relay);

    return response.status(200).json({
        nrelay: nrelay,
    })
}
