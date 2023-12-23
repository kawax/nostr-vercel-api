Nostr API for Server side
====

[![Test Coverage](https://api.codeclimate.com/v1/badges/7f679a1c8f0c17ef9899/test_coverage)](https://codeclimate.com/github/kawax/nostr-vercel-api/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/7f679a1c8f0c17ef9899/maintainability)](https://codeclimate.com/github/kawax/nostr-vercel-api/maintainability)

**Work in progress**

WebAPI for using Nostr from server-side languages that are difficult to Schnorr signature.  
Frontend is not covered, CORS is not supported.

## Deploy your self
It is recommended that you deploy this API yourself.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkawax%2Fnostr-vercel-api)

## API
- Base URL : https://nostr-api.vercel.app/api/

### Key
| method | path            | parameters   | response                                                             | description                                                     |
|--------|-----------------|--------------|----------------------------------------------------------------------|-----------------------------------------------------------------|
| GET    | `key/generate`  | none         | `{sk: "secret key(hex)", nsec: "", pk: "public key(hex)", npub: ""}` | Generates new key pairs.                                        |
| GET    | `key/from_sk`   | `sk(string)` | `{sk: "secret key(hex)", nsec: "", pk: "public key(hex)", npub: ""}` | Returns the key pair associated with the given secret key.      |
| GET    | `key/from_nsec` | `nsec`       | `{sk: "secret key(hex)", nsec: "", pk: "public key(hex)", npub: ""}` | Returns the key pair associated with the given nsec.            |
| GET    | `key/from_pk`   | `pk`         | `{pk: "public key(hex)", npub: ""}`                                  | Returns the public key and npub associated with the given pk.   |
| GET    | `key/from_npub` | `npub`       | `{pk: "public key(hex)", npub: ""}`                                  | Returns the public key and npub associated with the given npub. |

### Event
| method | path            | parameters                                                                             | response                     | description                    |
|--------|-----------------|----------------------------------------------------------------------------------------|------------------------------|--------------------------------|
| POST   | `event/publish` | `event{kind: 1, content: "", created_at: 0, tags: []}`, `sk`, `relay`                  | `{message: "ok", event: {}}` | Publish new event              |
| POST   | `event/list`    | `filter{ids: [], kinds: [], authors: [], since: 0, until: 0, limit: 0}`, `id`, `relay` | `{events: []}`               | Get events list. Until `EOSE`. |
| POST   | `event/get`     | `filter{ids: [], kinds: [], authors: [], since: 0, until: 0, limit: 0}`, `id`, `relay` | `{event: {}}`                | Get first event.               |
| POST   | `event/hash`    | `event{}`                                                                              | `{hash: ""}`                 | event hash for `event.id`.     |
| POST   | `event/sign`    | `event{}`, `sk`                                                                        | `{sign: ""}`                 | event sign for `event.sig`.    |
| POST   | `event/verify`  | `event{}`                                                                              | `{verify: true/false}`       | verify event.                  |

### NIP-19 bech32-encoded entities
| method | path             | parameters                                              | response                                | description                      |
|--------|------------------|---------------------------------------------------------|-----------------------------------------|----------------------------------|
| POST   | `nip19/decode`   | `n(string)`                                             | `{type: "note,nprofile,...", data: {}}` | Decode n*** string.              |
| POST   | `nip19/note`     | `note(string)`                                          | `{note: ""}`                            | Encode note id to `note1...`     |
| POST   | `nip19/nprofile` | `profile{pubkey: "", relays: []}`                       | `{nprofile: ""}`                        | Encode profile to `nprofile1...` |
| POST   | `nip19/nevent`   | `event{id: "", relays: []}`                             | `{nevent: ""}`                          | Encode event to `nevent1...`     |
| POST   | `nip19/naddr`    | `addr{identifier: "", pubkey: "", kind: 0, relays: []}` | `{naddr: ""}`                           | Encode addr to `naddr1...`       |
| POST   | `nip19/nrelay`   | `relay(string)`                                         | `{nrelay: ""}`                          | Encode relay to `nrelay1...`     |

### NIP-04 Encrypted Direct Message
| method | path            | parameters                                                       | response           | description      |
|--------|-----------------|------------------------------------------------------------------|--------------------|------------------|
| POST   | `nip04/encrypt` | `sk(sender sk)`, `pk(receiver pk)`, `content(raw message)`       | `{encrypt: "..."}` | Encrypt message. |
| POST   | `nip04/decrypt` | `sk(receiver sk)`, `pk(sender pk)`, `content(encrypted message)` | `{decrypt: "..."}` | Decrypt message. |

## Laravel example

### Generate keys
```php
use Illuminate\Support\Facades\Http;

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->get('key/generate');

dump($response->json());
//[
//    'sk' => '...',
//    'nsec' => '...',
//    'pk' => '...',
//    'npub' => '...'
//]

dump($response->json('nsec'));
```

### Convert nsec -> sk
```php
use Illuminate\Support\Facades\Http;

$nsec = '...';

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->get('key/from_nsec', ['nsec' => $nsec]);

dump($response->json());
//[
//    'sk' => '...',
//    'nsec' => '...',
//    'pk' => '...',
//    'npub' => '...'
//]

dump($response->json('sk'));
```

### Create new note
```php
use Illuminate\Support\Facades\Http;

$sk = '...';
$relay = 'wss://...';

$event = [
    'kind' => 1,
    'content' => 'hello',
    'created_at' => now()->timestamp,
    'tags' => [],
];

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/publish', [
                    'event' => $event,
                    'sk' => $sk,
                    'relay' => $relay,
                ]);

dump($response->json());
//[
//    'message' => 'ok',
//    'event' => [],
//]
```

### Get my recent notes
```php
use Illuminate\Support\Facades\Http;

$author = 'my pk';
$relay = 'wss://...';

$filter = [
    'kinds' => [1],
    'authors' => [$author],
    'limit' => 10,
    'since' => now()->subDays(30)->timestamp,
];

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/list', [
                    'filter' => $filter,
                    'relay' => $relay,
                ]);

dump($response->json());
//[
//    'events' => [
//          [
//            'content' => '...',
//          ]
//     ],
//]
```

### Get my profile
```php
use Illuminate\Support\Facades\Http;

$author = 'my pk';
$relay = 'wss://...';

$filter = [
    'kinds' => [0],
    'authors' => [$author],
];

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/get', [
                    'filter' => $filter,
                    'relay' => $relay,
                ]);

dump($response->json());
//[
//    'event' => [
//         'content' => '{banner: "...", name: "", ...}',
//     ],
//]

$user = json_decode($response->json('event.content'), true);
dump($user);
//[
//    'display_name' => '',
//    'nip05' => '',
//]
```

### Event hash and sign
Not needed when using `event/publish`. Used for sending via server-side WebSocket.

```php
use Illuminate\Support\Facades\Http;

$event = [
    'kind' => 1,
    'content' => 'test',
    'created_at' => now()->timestamp,
    'tags' => [],
    'pubkey' => '...',
];

// event hash
$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/hash', ['event' => $event]);

dump($response->json());
//[
//    'hash' => '',
//]

$event['id'] = $response->json('hash');

// sign
$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/sign', [
                    'event' => $event,
                    'sk' => '...',
                ]);

dump($response->json());
//[
//    'sign' => '',
//]

$event['sig'] = $response->json('sign');
```

### Direct Message
sender side
```php
use Illuminate\Support\Facades\Http;

$relay = 'wss://...';

$sk1 = 'sender sk';
$pk1 = 'sender pk';

//$sk2 = 'receiver sk';
$pk2 = 'receiver pk';

$encrypt = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('nip04/encrypt', [
                    'sk' => $sk1,
                    'pk' => $pk2,
                    'content' => 'secret direct message',
                ])->json('encrypt');

$event = [
    'kind' => 4,
    'pubkey' => $pk1,
    'tags' => [['p', $pk2]],
    'content' => $encrypt,
    'created_at' => now()->timestamp,
];

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/publish', [
                    'event' => $event,
                    'sk' => $sk1,
                    'relay' => $relay,
                ]);
```

receiver side
```php
use Illuminate\Support\Facades\Http;

$relay = 'wss://...';

//$sk1 = 'sender sk';
$pk1 = 'sender pk';

$sk2 = 'receiver sk';
$pk2 = 'receiver pk';

$filter = [
    'kinds' => [4],
    '#p' => [$pk2],
    'limit' => 1,
];

$encrypt = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/get', [
                    'filter' => $filter,
                    'relay' => $relay,
                ])->json('event.content');

$decrypt = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('nip04/decrypt', [
                    'sk' => $sk2,
                    'pk' => $pk1,
                    'content' => $encrypt,
                ])->json('decrypt');
```

### see also Laravel package
https://github.com/kawax/laravel-nostr

## LICENCE
MIT
