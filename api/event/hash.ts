import {
    getEventHash,
} from 'nostr-tools'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Event } from 'nostr-tools'

export default async function handler (request: VercelRequest, response: VercelResponse) {
    const {event}: { event: Event } = request.body

    const hash = getEventHash(event)

    return response.status(200).json({
        hash,
    })
}
