const {nip19, getPublicKey} = require('nostr-tools')

export default function handler (request, response) {
    const {sk = '', nsec = '', pk = '', npub = ''} = request.query

    let keys = {error: 'error'}

    switch (true) {
        case sk !== '':
            keys = from_sk(sk)
            break
        case nsec !== '':
            keys = from_nsec(nsec)
            break
        case pk !== '':
            keys = from_pk(pk)
            break
        case npub !== '':
            keys = from_npub(npub)
            break
    }

    if ('error' in keys) {
        return response.status(500).json(keys)
    }
    else {
        return response.status(200).json(keys)
    }
}

function from_sk (sk) {
    const nsec = nip19.nsecEncode(sk)

    const pk = getPublicKey(sk)
    const npub = nip19.npubEncode(pk)

    return {
        sk: sk,
        nsec: nsec,
        pk: pk,
        npub: npub,
    }
}

function from_nsec (nsec) {
    const {type, data} = nip19.decode(nsec)

    if (type !== 'nsec' || data === undefined) {
        return {error: 'error'}
    }

    const pk = getPublicKey(data)
    const npub = nip19.npubEncode(pk)

    return {
        sk: data,
        nsec: nsec,
        pk: pk,
        npub: npub,
    }
}

function from_pk (pk) {
    const npub = nip19.npubEncode(pk)

    return {
        pk: pk,
        npub: npub,
    }
}

function from_npub (npub) {
    const {type, data} = nip19.decode(npub)

    if (type !== 'npub' || data === undefined) {
        return {error: 'error'}
    }

    return {
        pk: data,
        npub: npub,
    }
}
