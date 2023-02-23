import {
    relayInit,
} from 'nostr-tools'

import 'websocket-polyfill'

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, Filter, SubscriptionOptions, Relay} from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {filter, id, relay}: { filter: Filter, id: string, relay: string } = request.body

    const opts: SubscriptionOptions = {
        id: id,
    }

    const relay_server: Relay = relayInit(relay)
    await relay_server.connect()

    relay_server.on('connect', () => {
        console.log(`connected to ${relay_server.url}`)
    })
    relay_server.on('error', () => {
        console.log(`failed to connect to ${relay_server.url}`)
    })

    const event: Event|null = await relay_server.get(filter, opts)

    return response.status(200).json({
        event: event,
    })
}
