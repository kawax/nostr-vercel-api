import { expect, test } from 'vitest';
import list from '../../api/event/list';
vi.spyOn(console, 'log');
vi.mock('nostr-tools', () => {
    const SimplePool = vi.fn();
    SimplePool.prototype.querySync = vi.fn();
    return { SimplePool };
});
test('event/list', () => {
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
    expect(list(req, res)).toBeTypeOf("object");
});
