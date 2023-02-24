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
            [keys, err] = from_sk(sk)
            break
        case nsec !== '':
            [keys, err] = from_nsec(nsec)
            break
        case pk !== '':
            [keys, err] = from_pk(pk)
            break
        case npub !== '':
            [keys, err] = from_npub(npub)
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
    let nsec: string, pk: string, npub: string

    try {
        nsec = nip19.nsecEncode(sk)
        pk = getPublicKey(sk)
        npub = nip19.npubEncode(pk)
    } catch (e) {
        return [null, {error: `${e.message}`}]
    }

    const keys: Key = {
        sk: sk,
        nsec: nsec,
        pk: pk,
        npub: npub,
    };

    return [keys, null]
}

function from_nsec(nsec: string): [Key, Error] {
    let sk: string, pk: string, npub: string

    try {
        const {type, data} = nip19.decode(nsec);

        if (type !== 'nsec' || data === undefined || typeof data !== 'string') {
            return [null, {error: 'type error'}]
        }

        sk = data
        pk = getPublicKey(sk)
        npub = nip19.npubEncode(pk)
    } catch (e) {
        return [null, {error: `${e.message}`}]
    }

    const keys: Key = {
        sk: sk,
        nsec: nsec,
        pk: pk,
        npub: npub,
    };

    return [keys, null]
}

function from_pk(pk: string): [Key, Error] {
    let npub: string;

    try {
        npub = nip19.npubEncode(pk)
    } catch (e) {
        return [null, {error: `${e.message}`}]
    }

    const keys: Key = {
        pk: pk,
        npub: npub,
    };

    return [keys, null]
}

function from_npub(npub: string): [Key, Error] {
    let pk: string

    try {
        const {type, data} = nip19.decode(npub)

        if (type !== 'npub' || data === undefined || typeof data !== 'string') {
            return [null, {error: 'type error'}]
        }
        pk = data
    } catch (e) {
        return [null, {error: `${e.message}`}]
    }

    const keys: Key = {
        pk: pk,
        npub: npub,
    };

    return [keys, null]
}
