import {nip19, getPublicKey} from 'nostr-tools'

import type {VercelRequest, VercelResponse} from '@vercel/node';

type Key = {
    sk?: string,
    nsec?: string,
    pk: string,
    npub: string,
}

type Error = {
    error: string
}

export default function handler(request: VercelRequest, response: VercelResponse) {
    // @ts-ignore
    const {
        sk = '',
        nsec = '',
        pk = '',
        npub = ''
    }: {
        sk: string,
        nsec: string,
        pk: string,
        npub: string
    } = request.query

    let keys: Key
    let err: Error

    switch (true) {
        case sk !== '':
            try {
                [keys, err] = from_sk(sk)
            } catch (e) {
                err = {error: "error"}
            }
            break
        case nsec !== '':
            try {
                [keys, err] = from_nsec(nsec)
            } catch (e) {
                err = {error: "error"}
            }
            break
        case pk !== '':
            try {
                [keys, err] = from_pk(pk)
            } catch (e) {
                err = {error: "error"}
            }
            break
        case npub !== '':
            try {
                [keys, err] = from_npub(npub)
            } catch (e) {
                err = {error: "error"}
            }
            break
        default:
            err = {error: 'error'}
            break;
    }

    if (err !== null) {
        return response.status(500).json(err)
    }

    return response.status(200).json(keys)
}

function from_sk(sk: string): [Key, Error] {
    const nsec = nip19.nsecEncode(sk)

    const pk = getPublicKey(sk)
    const npub = nip19.npubEncode(pk)

    const keys: Key = {
        sk: sk,
        nsec: nsec,
        pk: pk,
        npub: npub,
    };

    return [keys, null]
}

function from_nsec(nsec: string): [Key, Error] {
    const {type, data} = nip19.decode(nsec);

    if (type !== 'nsec' || data === undefined || typeof data !== "string") {
        return [null, {error: 'error'}]
    }

    const pk = getPublicKey(data)
    const npub = nip19.npubEncode(pk)

    const keys: Key = {
        sk: data,
        nsec: nsec,
        pk: pk,
        npub: npub,
    };

    return [keys, null]
}

function from_pk(pk: string): [Key, Error] {
    const npub = nip19.npubEncode(pk)

    const keys: Key = {
        pk: pk,
        npub: npub,
    };

    return [keys, null]
}

function from_npub(npub: string): [Key, Error] {
    const {type, data} = nip19.decode(npub)

    if (type !== 'npub' || data === undefined || typeof data !== "string") {
        return [null, {error: 'error'}]
    }

    const keys: Key = {
        pk: data,
        npub: npub,
    };

    return [keys, null]
}
