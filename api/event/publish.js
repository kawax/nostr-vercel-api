import { finalizeEvent, verifyEvent, } from 'nostr-tools';
import { Relay } from 'nostr-tools';
import 'websocket-polyfill';
export default async function handler(request, response) {
    const { event, sk, relay } = request.body;
    event.created_at = event.created_at ?? Math.floor(Date.now() / 1000);
    const secret_key = Uint8Array.from(Buffer.from(sk, "hex"));
    const signedEvent = finalizeEvent(event, secret_key);
    if (relay == undefined || !verifyEvent(event)) {
        return response.status(500).json({ error: 'error' });
    }
    const relay_server = await Relay.connect(relay);
    await relay_server.publish(signedEvent);
    relay_server.close();
    return response.status(200).json({
        message: `ok`,
        event: signedEvent,
    });
}
