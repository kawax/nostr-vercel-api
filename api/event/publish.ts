import {
    finalizeEvent,
    verifyEvent,
    Relay,
} from 'nostr-tools'
import {WebSocket} from 'ws'

(global as any).WebSocket = WebSocket

import {hexToBytes} from '@noble/hashes/utils'

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, VerifiedEvent} from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {event, sk, relay}: { event: Event, sk: string, relay: string } = request.body

    //console.log(relay)

    event.created_at = event.created_at ?? Math.floor(Date.now() / 1000)

    const secret_key: Uint8Array = hexToBytes(sk)

    const signedEvent: VerifiedEvent = finalizeEvent(event, secret_key)

    if (relay == undefined || !verifyEvent(signedEvent)) {
        return response.status(500).json({error: 'error'})
    }

    const relay_server: Relay = await Relay.connect(relay)

    await relay_server.publish(signedEvent)

    relay_server.close()

    return response.status(200).json({
        message: `ok`,
        event: signedEvent,
    })
}
