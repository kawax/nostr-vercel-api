import {SimplePool} from 'nostr-tools'
import {WebSocket} from 'ws'

(global as any).WebSocket = WebSocket

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, Filter} from 'nostr-tools'

const createPool = () => new SimplePool()

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {filter, relay}: { filter: Filter, relay: string } = request.body

    const pool: SimplePool = createPool()

    const events: Event[] = await pool.querySync([relay], filter)

    return response.status(200).json({
        events: events,
    })
}
