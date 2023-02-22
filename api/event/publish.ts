import {
    relayInit,
    getPublicKey,
    getEventHash,
    signEvent,
    verifySignature,
} from 'nostr-tools'

import 'websocket-polyfill'

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, Relay, Pub} from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {event, sk, relay}: { event: Event, sk: string, relay: string } = request.body

    event.created_at = event.created_at ?? Math.floor(Date.now() / 1000)

    event.pubkey = getPublicKey(sk)
    event.id = getEventHash(event)
    event.sig = signEvent(event, sk)

    if (relay === undefined || !verifySignature(event)) {
        return response.status(500).json({error: 'error'})
    }

    const relay_server: Relay = relayInit(relay)
    await relay_server.connect()

    relay_server.on('connect', () => {
        console.log(`connected to ${relay_server.url}`)
    })
    relay_server.on('error', () => {
        console.log(`failed to connect to ${relay_server.url}`)
    })

    const pub: Pub = relay_server.publish(event)

    pub.on('ok', () => {
        console.log(`${relay_server.url} has accepted our event`)

        relay_server.close()

        return response.status(200).json({
            message: `ok`,
            event: event,
        })
    })

    pub.on('failed', (reason: string) => {
        console.log(`failed to publish to ${relay_server.url}: ${reason}`)

        relay_server.close()

        return response.status(500).json({
            error: `${reason}`,
        })
    })
}
