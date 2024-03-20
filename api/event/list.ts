import NDK, {NDKEvent, NDKFilter} from "@nostr-dev-kit/ndk";

import type {VercelRequest, VercelResponse} from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {filter, relay}: { filter: NDKFilter, relay: string } = request.body

    console.log(filter, relay)

    const ndk : NDK = new NDK({
        explicitRelayUrls: [relay],
    });

    const events : Set<NDKEvent> = await ndk.fetchEvents(filter);

    console.log(events)

    return response.status(200).json({
        events: events,
    })
}
