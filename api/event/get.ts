import {NostrSystem, RequestBuilder, ReqFilter, TaggedNostrEvent} from "@snort/system";

import type {VercelRequest, VercelResponse} from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {filter, relay}: { filter: ReqFilter, relay: string } = request.body

    console.log(filter, relay)

    const System: NostrSystem = new NostrSystem({});

    await System.Init();

    await System.ConnectToRelay(relay, {read: true, write: false});

    const rb: RequestBuilder = new RequestBuilder('event-get');
    rb.withBareFilter(filter);

    const events: TaggedNostrEvent[] = await System.Fetch(rb)

    let event: TaggedNostrEvent | undefined

    if (events.length > 0) {
        event = events.shift()
    }

    console.log(event)

    return response.status(200).json({
        event: event,
    })
}
