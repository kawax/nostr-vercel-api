const { nip19 } = require('nostr-tools')

export default function handler(request, response) {
    const { npub } = request.query;

    const {type, data} = nip19.decode(npub)

    if(type !== 'npub' || data === undefined){
        return response.status(500).json({error: 'error'})
    }

    return response.status(200).json({
        pk: data,
        npub: npub,
    });
  }
