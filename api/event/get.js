import { SimplePool } from 'nostr-tools';
import 'websocket-polyfill';
export default async function handler(request, response) {
    const { filter, id, relay } = request.body;
    const pool = new SimplePool();
    const event = await pool.get([relay], filter, { id: id });
    return response.status(200).json({
        event: event,
    });
}
