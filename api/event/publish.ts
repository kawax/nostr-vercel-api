import NDK, {NDKPrivateKeySigner, NDKEvent, NDKRelay,NDKRelaySet, NostrEvent} from "@nostr-dev-kit/ndk";

import type {VercelRequest, VercelResponse} from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {event, sk, relay}: { event: NostrEvent, sk: string, relay: string } = request.body

    console.log(event, relay)

    const signer: NDKPrivateKeySigner = new NDKPrivateKeySigner(sk)

    const ndk: NDK = new NDK({
        explicitRelayUrls: [relay],
        signer: signer
    });

    await ndk.connect();

    const relaySet :NDKRelaySet = new NDKRelaySet(new Set([new NDKRelay(relay)]), ndk)

    const signedEvent: NDKEvent = new NDKEvent(ndk, event)

    await signedEvent.publish(relaySet);

    return response.status(200).json({
        message: `ok`,
        event: signedEvent,
    })
}
