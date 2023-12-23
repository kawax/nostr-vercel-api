import {
    getEventHash,
} from 'nostr-tools/pure'

export default function handler (request, response) {
    const {event} = request.body

    const hash = getEventHash(event)

    return response.status(200).json({
        hash: hash,
    })
}
