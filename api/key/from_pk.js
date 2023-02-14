const { nip19 } = require('nostr-tools')

export default function handler(request, response) {
    const { pk } = request.query;

    const npub = nip19.npubEncode(pk)
 
    return response.status(200).json({
        pk: pk,
        npub: npub,
    });
  }
