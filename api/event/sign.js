import {
    signEvent,
} from 'nostr-tools'

export default function handler (request, response) {
    const {event, sk} = request.body

    const sign = signEvent(event, sk)

    return response.status(200).json({
        sign: sign,
    })
}
