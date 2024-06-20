import {SimplePool} from 'nostr-tools'
import {WebSocket} from 'ws'
import {useWebSocketImplementation} from 'nostr-tools/relay'

(global as any).WebSocket = WebSocket

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, Filter} from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {filter, relay}: { filter: Filter, relay: string } = request.body

    useWebSocketImplementation(WebSocket)

    console.log(filter, relay)

    const pool: SimplePool = new SimplePool()

    const events: Event[] = await pool.querySync([relay], filter)

    console.log(events)

    return response.status(200).json({
        events: events,
    })
}
