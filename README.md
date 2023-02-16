Nostr API for Server side
====

WebAPI for using Nostr from server-side languages that are difficult to Schnorr signature.  
Frontend is not covered, CORS is not supported.

## API
- Base URL : https://nostr-api.vercel.app/api/

### Key
| method | path            | parameters | response                                                             | description                     |
|--------|-----------------|------------|----------------------------------------------------------------------|---------------------------------|
| GET    | `key/generate`  | none       | `{sk: "secret key(hex)", nsec: "", pk: "public key(hex)", npub: ""}` | Generate new keys               |
| GET    | `key/from_sk`   | `sk`       | `{sk: "secret key(hex)", nsec: "", pk: "public key(hex)", npub: ""}` | Get keys from given sk          |
| GET    | `key/from_nsec` | `nsec`     | `{sk: "secret key(hex)", nsec: "", pk: "public key(hex)", npub: ""}` | Get keys from given nsec        |
| GET    | `key/from_pk`   | `pk`       | `{pk: "public key(hex)", npub: ""}`                                  | Get public keys from given pk   |
| GET    | `key/from_npub` | `npub`     | `{pk: "public key(hex)", npub: ""}`                                  | Get public keys from given npub |

### Event
| method | path            | parameters                                                   | response          | description                    |
|--------|-----------------|--------------------------------------------------------------|-------------------|--------------------------------|
| POST   | `event/publish` | `kind`, `content`, `created_at`, `tags`, `sk`, `relay`       | `{message: "ok"}` | Publish new event              |
| POST   | `event/list`    | `ids` `kinds`, `authors`, `since`, `until`, `limit`, `relay` | `{events: []}`    | Get events list. Until `EOSE`. |
| POST   | `event/get`     | `ids` `kinds`, `authors`, `since`, `until`, `limit`, `relay` | `{event: {}}`     | Get first event.               |
| POST   | `event/hash`    | `event`                                                      | `{hash: ""}`      | event hash for `event.id`.     |
| POST   | `event/sign`    | `event`, `sk`                                                | `{sign: ""}`      | event sign for `event.sig`.    |

### NIP-05
| method | path            | parameters | response                                  | description        |
|--------|-----------------|------------|-------------------------------------------|--------------------|
| GET    | `nip05/profile` | `user`     | `{pubkey: "public key(hex)", relays: []}` | Get NIP-05 profile |


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

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/publish', [
                    'kind' => 1,
                    'content' => 'hello',
                    'created_at' => now()->timestamp,
                    'tags' => [],
                    'sk' => $sk,
                    'relay' => $relay,
                ]);

dump($response->json());
//[
//    'message' => 'ok',
//]
```

### Get my recent notes
```php
use Illuminate\Support\Facades\Http;

$author = 'my pk';
$relay = 'wss://...';

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/list', [
                    'kinds' => [1],
                    'authors' => [$author],
                    'limit' => 10,
                    'since' => now()->subDays(30)->timestamp,
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

$response = Http::baseUrl('https://nostr-api.vercel.app/api/')
                ->post('event/get', [
                    'kinds' => [0],
                    'authors' => [$author],
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

$hash = $response->json('hash');

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

$sign = $response->json('sign');

$event['id'] = $hash;
$event['sig'] = $sign;
```

## LICENCE
MIT

