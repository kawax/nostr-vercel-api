Nostr API for Server side
====

**Work in progress**

WebAPI for using Nostr from server-side languages that are difficult to Schnorr signature.  
Frontend is not covered, CORS is not supported.

## API
- Base URL : https://nostr-api.vercel.app/api/

### Key
| method | path           | parameters                       | response                                                                                     | description                       |
|--------|----------------|----------------------------------|----------------------------------------------------------------------------------------------|-----------------------------------|
| GET    | `key/generate` | none                             | `{sk: "secret key(hex)", nsec: "", pk: "public key(hex)", npub: ""}`                         | Generate new keys                 |
| GET    | `key/from`     | `sk` or `nsec` or `pk` or `npub` | `{sk: "secret key(hex)", nsec: "", pk: "public key(hex)", npub: ""}` or `{pk: "", npub: ""}` | Get converted keys from given key |

### Event
| method | path            | parameters                                                                                | response                     | description                    |
|--------|-----------------|-------------------------------------------------------------------------------------------|------------------------------|--------------------------------|
| POST   | `event/publish` | `event{kind: 1, content: "", created_at: 0, tags: []}`, `sk`, `relay`                     | `{message: "ok", event: {}}` | Publish new event              |
| POST   | `event/list`    | `filters[{ids: [], kinds: [], authors: [], since: 0, until: 0, limit: 0}]`, `id`, `relay` | `{events: []}`               | Get events list. Until `EOSE`. |
| POST   | `event/get`     | `filter{ids: [], kinds: [], authors: [], since: 0, until: 0, limit: 0}`, `id`, `relay`    | `{event: {}}`                | Get first event.               |
| POST   | `event/hash`    | `event`                                                                                   | `{hash: ""}`                 | event hash for `event.id`.     |
| POST   | `event/sign`    | `event`, `sk`                                                                             | `{sign: ""}`                 | event sign for `event.sig`.    |
| POST   | `event/verify`  | `event`                                                                                   | `{verify: true/false}`       | verify event.                  |

### NIP-05
| method | path            | parameters | response                                            | description        |
|--------|-----------------|------------|-----------------------------------------------------|--------------------|
| GET    | `nip05/profile` | `user`     | `{user: "", pubkey: "public key(hex)", relays: []}` | Get NIP-05 profile |


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
                ->get('key/from', ['nsec' => $nsec]);

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
                    'filters' => [$filter],
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

### NIP-05
```php
use Illuminate\Support\Facades\Http;

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->get('nip05/profile', [
                    'user' => 'user@example.com',
                ]);

dump($response->json());
//[
//    'user' => 'user@example.com',
//    'pubkey' => '',
//    'relays' => [],
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

### see also Laravel package
https://github.com/kawax/laravel-nostr

## LICENCE
MIT
