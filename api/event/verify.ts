import {
    verifyEvent,
} from 'nostr-tools'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { VerifiedEvent } from 'nostr-tools'

export default async function handler (request: VercelRequest, response: VercelResponse) {
    const {event}: { event: VerifiedEvent } = request.body

    const verify = verifyEvent(event)

    return response.status(200).json({
        verify: verify,
    })
}
