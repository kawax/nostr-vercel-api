import { expect, test } from 'vitest';
import handler from '../../api/nip19/[action]';
vi.mock('nostr-tools', () => ({
    nip19: {
        nsecEncode: () => 'test',
        npubEncode: () => 'test',
        noteEncode: () => 'test',
        nprofileEncode: () => 'test',
        neventEncode: () => 'test',
        naddrEncode: () => 'test',
        nrelayEncode: () => 'test',
    },
}));
test('nip19/nsec', () => {
    const req = {
        query: {
            action: 'nsec',
        },
        body: {
            sk: 'sk',
        }
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(handler(req, res)).toBeTypeOf('object');
});
test('nip19/npub', () => {
    const req = {
        query: {
            action: 'npub',
        },
        body: {
            pk: 'pk',
        }
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(handler(req, res)).toBeTypeOf('object');
});
test('nip19/note', () => {
    const req = {
        query: {
            action: 'note',
        },
        body: {
            note: 'note',
        }
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(handler(req, res)).toBeTypeOf('object');
});
test('nip19/nprofile', () => {
    const req = {
        query: {
            action: 'nprofile',
        },
        body: {
            profile: 'profile',
        }
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(handler(req, res)).toBeTypeOf('object');
});
test('nip19/nevent', () => {
    const req = {
        query: {
            action: 'nevent',
        },
        body: {
            event: 'event',
        }
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(handler(req, res)).toBeTypeOf('object');
});
test('nip19/naddr', () => {
    const req = {
        query: {
            action: 'naddr',
        },
        body: {
            addr: 'addr',
        }
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(handler(req, res)).toBeTypeOf('object');
});
test('nip19/nrelay', () => {
    const req = {
        query: {
            action: 'nrelay',
        },
        body: {
            relay: 'relay',
        }
    };
    const res = {
        status: () => res,
        json: () => res,
    };
    expect(handler(req, res)).toBeTypeOf('object');
});
