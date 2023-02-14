const { nip19, getPublicKey } = require('nostr-tools')

export default function handler(request, response) {
    const { nsec } = request.query;

    const {type, data} = nip19.decode(nsec)

    if(type !== 'nsec' || data === undefined){
        return response.status(500).json({error: 'error'})
    }

    const pk = getPublicKey(data)
    const npub = nip19.npubEncode(pk)

    return response.status(200).json({
        sk: data,
        nsec: nsec,
        pk: pk,
        npub: npub,
    });
  }
