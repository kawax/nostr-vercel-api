import { nip19 } from 'nostr-tools';
export default async function handler(request, response) {
    const { action } = request.query;
    switch (action) {
        case 'decode':
            return decode(request, response);
        case 'nsec':
            return nsecEncode(request, response);
        case 'npub':
            return npubEncode(request, response);
        case 'note':
            return noteEncode(request, response);
        case 'nprofile':
            return nprofileEncode(request, response);
        case 'nevent':
            return neventEncode(request, response);
        case 'naddr':
            return naddrEncode(request, response);
        case 'nrelay':
            return nrelayEncode(request, response);
        default:
            return response.status(404).json({ error: 'Not Found' });
    }
}
function decode(request, response) {
    const { n } = request.body;
    const { type, data } = nip19.decode(n);
    return response.status(200).json({
        type: type,
        data: data,
    });
}
function nsecEncode(request, response) {
    const { sk } = request.body;
    const nsec = nip19.nsecEncode(Uint8Array.from(Buffer.from(sk, "hex")));
    return response.status(200).json({
        nsec: nsec,
    });
}
function npubEncode(request, response) {
    const { pk } = request.body;
    const npub = nip19.npubEncode(pk);
    return response.status(200).json({
        npub: npub,
    });
}
function noteEncode(request, response) {
    const { note } = request.body;
    const id = nip19.noteEncode(note);
    return response.status(200).json({
        note: id,
    });
}
function nprofileEncode(request, response) {
    const { profile } = request.body;
    const nprofile = nip19.nprofileEncode(profile);
    return response.status(200).json({
        nprofile: nprofile,
    });
}
function neventEncode(request, response) {
    const { event } = request.body;
    const nevent = nip19.neventEncode(event);
    return response.status(200).json({
        nevent: nevent,
    });
}
function naddrEncode(request, response) {
    const { addr } = request.body;
    const naddr = nip19.naddrEncode(addr);
    return response.status(200).json({
        naddr: naddr,
    });
}
function nrelayEncode(request, response) {
    const { relay } = request.body;
    const nrelay = nip19.nrelayEncode(relay);
    return response.status(200).json({
        nrelay: nrelay,
    });
}
