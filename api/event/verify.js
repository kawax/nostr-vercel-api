import {
    verifyEvent,
} from 'nostr-tools/pure'

export default function handler (request, response) {
    const {event} = request.body

    const verify = verifyEvent(event)

    return response.status(200).json({
        verify: verify,
    })
}
