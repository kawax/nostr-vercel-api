import { nip04 } from 'nostr-tools';
import { Crypto } from "@peculiar/webcrypto";
/* c8 ignore next 3 */
if (!('crypto' in globalThis)) {
    globalThis.crypto = new Crypto();
}
export default async function handler(request, response) {
    const { action } = request.query;
    switch (action) {
        case 'encrypt':
            return encrypt(request, response);
        case 'decrypt':
            return decrypt(request, response);
        default:
            return response.status(404).json({ error: 'Not Found' });
    }
}
async function encrypt(request, response) {
    const { sk, pk, content } = request.body;
    const encrypt = await nip04.encrypt(sk, pk, content);
    return response.status(200).json({
        encrypt: encrypt,
    });
}
async function decrypt(request, response) {
    const { sk, pk, content } = request.body;
    const decrypt = await nip04.decrypt(sk, pk, content);
    return response.status(200).json({
        decrypt: decrypt,
    });
}
