import { SimplePool } from 'nostr-tools'

import 'websocket-polyfill'

import type {VercelRequest, VercelResponse} from '@vercel/node';
import type {Event, Filter} from 'nostr-tools'

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {filter, id, relay}: { filter: Filter, id: string, relay: string } = request.body

    const pool : SimplePool = new SimplePool()

    const event: Event|null = await pool.get([relay], filter, {id: id})

    return response.status(200).json({
        event: event,
    })
}
