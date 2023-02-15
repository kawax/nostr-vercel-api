import {
    relayInit,
    getPublicKey,
    getEventHash,
    signEvent,
    validateEvent,
    verifySignature,
} from 'nostr-tools'

import 'websocket-polyfill'

export default async function handler(request, response) {
    const { kind = 1, tags = [], content, sk, relay } = request.body

    let event = {
        kind: kind,
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: content,
        pubkey: getPublicKey(sk)
    }

    event.id = getEventHash(event)
    event.sig = signEvent(event, sk)

    if (relay === undefined || !validateEvent(event) || !verifySignature(event)) {
        return response.status(500).json({ error: 'error' })
    }

    const relay_server = relayInit(relay)
    await relay_server.connect()

    relay_server.on('connect', () => {
        console.log(`connected to ${relay_server.url}`)
    })
    relay_server.on('error', () => {
        console.log(`failed to connect to ${relay_server.url}`)
    })

    const pub = relay_server.publish(event)

    pub.on('ok', async () => {
        console.log(`${relay_server.url} has accepted our event`)

        await relay_server.close()

        return response.status(201).json({
            message: `ok`,
        });
    })

    pub.on('seen', () => {
        console.log(`we saw the event on ${relay_server.url}`)
    })

    pub.on('failed', async reason => {
        console.log(`failed to publish to ${relay_server.url}: ${reason}`)

        await relay_server.close()

        return response.status(500).json({
            error: `${reason}`,
        });
    })
}
