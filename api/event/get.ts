import NDK, {NDKEvent, NDKFilter} from "@nostr-dev-kit/ndk";

import type {VercelRequest, VercelResponse} from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {filter, relay}: { filter: NDKFilter, relay: string } = request.body

    console.log(filter, relay)

    const ndk : NDK = new NDK({
        explicitRelayUrls: [relay],
    });

    await ndk.connect();

    const event : NDKEvent | null = await ndk.fetchEvent(filter);

    console.log(event)

    return response.status(200).json({
        event: event,
    })
}
