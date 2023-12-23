import { nip19, getPublicKey, generateSecretKey } from 'nostr-tools';
export default function handler(request, response) {
    const { action } = request.query;
    switch (action) {
        case 'generate':
            return generate(request, response);
        case 'from_sk':
            return from_sk(request, response);
        case 'from_nsec':
            return from_nsec(request, response);
        case 'from_pk':
            return from_pk(request, response);
        case 'from_npub':
            return from_npub(request, response);
        default:
            return response.status(404).json({ error: 'Not Found' });
    }
}
function generate(request, response) {
    const sk = generateSecretKey();
    const nsec = nip19.nsecEncode(sk);
    const pk = getPublicKey(sk);
    const npub = nip19.npubEncode(pk);
    return response.status(200).json({
        sk: sk,
        nsec: nsec,
        pk: pk,
        npub: npub,
    });
}
function from_sk(request, response) {
    const { sk } = request.query;
    const nsec = nip19.nsecEncode(Uint8Array.from(Buffer.from(sk ?? '', "hex")));
    const pk = getPublicKey(Uint8Array.from(Buffer.from(sk ?? '', "hex")));
    const npub = nip19.npubEncode(pk);
    return response.status(200).json({
        sk: sk,
        nsec: nsec,
        pk: pk,
        npub: npub,
    });
}
function from_nsec(request, response) {
    const { nsec } = request.query;
    const { type, data } = nip19.decode(nsec ?? '');
    if (type !== 'nsec' || data === undefined || typeof data !== 'string') {
        return response.status(500).json({ error: 'type error' });
    }
    const pk = getPublicKey(data);
    const npub = nip19.npubEncode(pk);
    return response.status(200).json({
        sk: data,
        nsec: nsec,
        pk: pk,
        npub: npub,
    });
}
function from_pk(request, response) {
    const { pk } = request.query;
    const npub = nip19.npubEncode(pk ?? '');
    return response.status(200).json({
        pk: pk,
        npub: npub,
    });
}
function from_npub(request, response) {
    const { npub } = request.query;
    const { type, data } = nip19.decode(npub ?? '');
    if (type !== 'npub' || data === undefined || typeof data !== 'string') {
        return response.status(500).json({ error: 'type error' });
    }
    return response.status(200).json({
        pk: data,
        npub: npub,
    });
}
