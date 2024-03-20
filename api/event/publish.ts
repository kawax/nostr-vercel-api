import NDK, {NDKPrivateKeySigner, NDKEvent, NDKFilter, NostrEvent} from "@nostr-dev-kit/ndk";

import type {VercelRequest, VercelResponse} from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {event, sk, relay}: { event: NostrEvent, sk: string, relay: string } = request.body

    const signer: NDKPrivateKeySigner = new NDKPrivateKeySigner(sk)

    const ndk: NDK = new NDK({
        explicitRelayUrls: [relay],
        signer: signer
    });

    const signedEvent: NDKEvent = new NDKEvent(ndk, event)

    await signedEvent.publish();

    return response.status(200).json({
        message: `ok`,
        event: signedEvent,
    })
}
