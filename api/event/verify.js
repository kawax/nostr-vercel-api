import {
    verifySignature,
} from 'nostr-tools'

export default function handler (request, response) {
    const {event} = request.body

    const verify = verifySignature(event)

    return response.status(200).json({
        verify: verify,
    })
}
