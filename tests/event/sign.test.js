import { expect, test } from 'vitest';
import { getPublicKey, generateSecretKey } from 'nostr-tools';
import sign from '../../api/event/sign';
test('event/sign', () => {
    const req = {
        body: {
            event: {
                kind: 1,
                pubkey: getPublicKey(generateSecretKey()),
                created_at: 0,
                content: 'test',
                tags: [],
            },
            sk: generateSecretKey(),
        }
    };
    const res = {
        status: (statusCode) => res,
        json: (jsonBody) => res,
    };
    expect(sign(req, res)).toBe(res);
});
