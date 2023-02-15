import {
    relayInit,
} from 'nostr-tools'

import 'websocket-polyfill'

export default async function handler(request, response) {
    const { ids, kinds = [1], authors, since, until, limit, relay } = request.body

    const filter = {
        ids: ids,
        kinds: kinds,
        authors: authors,
        since: since,
        until: until,
        limit: limit,
    }

    const relay_server = relayInit(relay)
    await relay_server.connect()

    relay_server.on('connect', () => {
        console.log(`connected to ${relay_server.url}`)
    })
    relay_server.on('error', () => {
        console.log(`failed to connect to ${relay_server.url}`)
    })

    const events = await relay_server.list([filter])

    return response.status(200).json({
        events: events,
    });
}
