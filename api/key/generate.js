const {nip19, generatePrivateKey, getPublicKey} = require('nostr-tools')

export default function handler (request, response) {
    const sk = generatePrivateKey()
    const nsec = nip19.nsecEncode(sk)

    const pk = getPublicKey(sk)
    const npub = nip19.npubEncode(pk)

    return response.status(200).json({
        sk: sk,
        nsec: nsec,
        pk: pk,
        npub: npub,
    })
}
