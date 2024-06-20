import {SimplePool} from 'nostr-tools'
import {WebSocket} from 'ws'

(global as any).WebSocket = WebSocket

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, Filter} from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {filter, relay}: { filter: Filter, relay: string } = request.body

    console.log(filter, relay)

    const pool: SimplePool = new SimplePool()

    const events: Event[] = await pool.list([relay], [filter])

    console.log(events)

    return response.status(200).json({
        events: events,
    })
}
