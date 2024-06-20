import {getSignature} from 'nostr-tools'

export default function handler(request, response) {
    const {event, sk} = request.body

    const sign = getSignature(event, sk)

    return response.status(200).json({
        sign: sign,
    })
}
