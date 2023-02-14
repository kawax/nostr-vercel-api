Nostr API for Server side
====

API for using Nostr from server-side languages.
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
| method | path            | parameters                               | response          | description       |
|--------|-----------------|------------------------------------------|-------------------|-------------------|
| POST   | `event/publish` | `kind`, `content`, `tags`, `sk`, `relay` | `{message: "ok"}` | Publish new event |

## Laravel example
Reading can be done without this API.

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
                    'tags' => [],
                    'sk' => $sk,
                    'relay' => $relay,
                ]);

dump($response->json());
//[
//    'message' => 'ok',
//]
```

## LICENCE
MIT

