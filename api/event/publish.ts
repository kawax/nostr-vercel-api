import {NostrSystem, EventBuilder, NotSignedNostrEvent, NostrEvent, OkResponse} from "@snort/system";

import type {VercelRequest, VercelResponse} from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {event, sk, relay}: { event: NotSignedNostrEvent, sk: string, relay: string } = request.body

    console.log(event, relay)

    const System: NostrSystem = new NostrSystem({});

    await System.Init();

    await System.ConnectToRelay(relay, {read: true, write: true});

    const eb: EventBuilder = new EventBuilder()
        .pubKey(event.pubkey)
        .createdAt(event.created_at)
        .kind(event.kind)
        .content(event.content)

    event.tags.forEach((tag: string[]) => eb.tag(tag))

    const signedEvent : NostrEvent = await eb.buildAndSign(sk)

    await System.BroadcastEvent(signedEvent)

    return response.status(200).json({
        message: `ok`,
        event: signedEvent,
    })
}
