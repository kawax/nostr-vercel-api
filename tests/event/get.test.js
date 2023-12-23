import { expect, test } from 'vitest';
import get from '../../api/event/get';
vi.spyOn(console, 'log');
vi.mock('nostr-tools', () => {
    const SimplePool = vi.fn();
    SimplePool.prototype.get = vi.fn();
    return { SimplePool };
});
test('event/get', () => {
    const req = {
        body: {
            filter: {},
            id: '',
            relay: '',
        }
    };
    const res = {
        status: (statusCode) => res,
        json: (jsonBody) => res,
    };
    expect(get(req, res)).toBeTypeOf("object");
});
