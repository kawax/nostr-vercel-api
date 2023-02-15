import {nip05} from 'nostr-tools'

nip05.useFetchImplementation(require('node-fetch'))

export default async function handler(request, response) {
    const { user } = request.query

    const profile = await nip05.queryProfile(user)

    return response.status(200).json({
        pubkey: profile.pubkey,
        relays: profile.relays,
    });
}
