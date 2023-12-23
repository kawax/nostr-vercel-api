import {
    finalizeEvent,
    verifyEvent,
} from 'nostr-tools'

import { Relay } from 'nostr-tools'

import 'websocket-polyfill'

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, VerifiedEvent} from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {event, sk, relay}: { event: Event, sk: string, relay: string } = request.body

    event.created_at = event.created_at ?? Math.floor(Date.now() / 1000)

    const secret_key : Uint8Array = Uint8Array.from(Buffer.from(sk, "hex"))

    const signedEvent : VerifiedEvent = finalizeEvent(event, secret_key)

    if (relay == undefined || !verifyEvent(event)) {
        return response.status(500).json({error: 'error'})
    }

    const relay_server : Relay = await Relay.connect(relay)

    await relay_server.publish(signedEvent)

    relay_server.close()

    return response.status(200).json({
        message: `ok`,
        event: signedEvent,
    })
}
