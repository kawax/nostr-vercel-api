import {
    relayInit,
} from 'nostr-tools'

import 'websocket-polyfill'

export default async function handler (request, response) {
    const {filter = [], id, relay} = request.body

    const opts = {
        id: id,
    }

    const relay_server = relayInit(relay)
    await relay_server.connect()

    relay_server.on('connect', () => {
        console.log(`connected to ${relay_server.url}`)
    })
    relay_server.on('error', () => {
        console.log(`failed to connect to ${relay_server.url}`)
    })

    const event = await relay_server.get(filter, opts)

    return response.status(200).json({
        event: event,
    })
}
