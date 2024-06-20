import {
    relayInit,
    finishEvent,
    verifySignature,
    Relay,
} from 'nostr-tools'

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, VerifiedEvent} from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {event, sk, relay}: { event: Event, sk: string, relay: string } = request.body

    event.created_at = event.created_at ?? Math.floor(Date.now() / 1000)

    const signedEvent: VerifiedEvent = finishEvent(event, sk)

    if (relay == undefined || !verifySignature(event)) {
        return response.status(500).json({error: 'error'})
    }

    const relay_server: Relay = relayInit(relay)

    await relay_server.publish(signedEvent)

    relay_server.close()

    return response.status(200).json({
        message: `ok`,
        event: signedEvent,
    })
}
