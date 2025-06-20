# GitHub Copilot Instructions for nostr-vercel-api

## Repository Overview

This is a **Nostr API for server-side usage** built with Vercel serverless functions. The API provides WebAPI endpoints for server-side languages that have difficulty with Schnorr signatures, enabling them to interact with the Nostr protocol.

**Key Purpose:** Bridge the gap between server-side applications and Nostr protocol by providing HTTP endpoints for cryptographic operations, key management, and event handling.

## Project Architecture

### Tech Stack
- **Runtime:** Node.js with Vercel serverless functions
- **Language:** TypeScript (ES modules)
- **Testing:** Vitest with mocking
- **Crypto:** @noble/curves, @noble/hashes, nostr-tools
- **Deployment:** Vercel (configured for hnd1 region)

### Directory Structure
```
api/                    # Vercel serverless functions
├── key/[action].ts    # Key generation and conversion
├── nip19/[action].ts  # NIP-19 bech32 encoding/decoding  
├── nip04/[action].ts  # NIP-04 encryption/decryption
└── event/             # Event operations (individual files)
    ├── sign.ts        # Event signing
    ├── verify.ts      # Event verification
    ├── hash.ts        # Event hashing
    ├── publish.ts     # Event publishing
    ├── get.ts         # Event retrieval
    └── list.ts        # Event listing

tests/                 # Mirror structure of api/
├── key/
├── nip19/
├── nip04/
└── event/
```

## API Endpoint Patterns

### Dynamic Route Pattern (`[action].ts`)
Used for endpoints that handle multiple related operations via query parameters:

```typescript
export default async function handler(request: VercelRequest, response: VercelResponse) {
    const {action}: { action?: string } = request.query
    
    switch (action) {
        case 'operation1':
            return operation1(request, response)
        case 'operation2':
            return operation2(request, response)
        default:
            return response.status(404).json({error: 'Not Found'})
    }
}
```

### Single Operation Pattern
Used for endpoints that handle one specific operation:

```typescript
export default async function handler(request: VercelRequest, response: VercelResponse) {
    // Extract parameters from request.body or request.query
    const {param1, param2}: { param1: string, param2: string } = request.body
    
    // Perform operation
    const result = performOperation(param1, param2)
    
    // Return JSON response
    return response.status(200).json({
        result: result
    })
}
```

## Coding Conventions

### Import Organization
1. External crypto libraries (@noble/*, nostr-tools)
2. Vercel types
3. Additional type imports
4. Blank line before code

```typescript
import { nip19, getPublicKey } from 'nostr-tools'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Event } from 'nostr-tools'
```

### Function Signatures
- **Sync operations:** `function name(request: VercelRequest, response: VercelResponse): VercelResponse`
- **Async operations:** `async function name(request: VercelRequest, response: VercelResponse): Promise<VercelResponse>`

### Response Patterns
```typescript
// Success response
return response.status(200).json({
    propertyName: value,
    anotherProperty: anotherValue
})

// Error response
return response.status(404).json({error: 'Not Found'})
```

### Parameter Extraction
```typescript
// From query string
const {param}: { param?: string } = request.query

// From request body  
const {param1, param2}: { param1: string, param2: string } = request.body
```

### Type Annotations
- Always use explicit types for function parameters and return values
- Use `string` for hex-encoded keys/data
- Use `Uint8Array` for raw binary data
- Use `Event` type from nostr-tools for Nostr events

## Key Management Patterns

### Key Format Conventions
- **sk:** Secret key in hex format (string)
- **nsec:** Secret key in NIP-19 bech32 format (nsec1...)
- **pk:** Public key in hex format (string)
- **npub:** Public key in NIP-19 bech32 format (npub1...)

### Standard Key Response
```typescript
return response.status(200).json({
    sk: bytesToHex(secretKey),    // hex string
    nsec: nip19.nsecEncode(secretKey),
    pk: publicKeyHex,             // hex string
    npub: nip19.npubEncode(publicKeyHex)
})
```

## Testing Patterns

### Test File Structure
```typescript
import { expect, test, describe, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from "@vercel/node"
import functionUnderTest from '../../api/path/to/function'

// Mock external dependencies
vi.mock('nostr-tools', () => ({
    // Mock implementation
}))

// Helper functions
function createMockRequest(params): VercelRequest { ... }
function createMockResponse() { ... }

// Test suites
describe('feature/operation', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    
    test('should handle valid input', () => {
        // Test implementation
    })
})
```

### Mock Patterns
- **Always mock external dependencies:** nostr-tools, @noble/* libraries
- **Use vi.mocked()** for typed mocks
- **Clear mocks in beforeEach()**
- **Return predictable test data** for consistency

### Mock Request/Response Helpers
```typescript
function createMockRequest(query: Record<string, string> = {}, body: any = {}): VercelRequest {
    return <VercelRequest><unknown>{ query, body }
}

function createMockResponse() {
    let statusCode = 200
    let jsonData: any = null
    
    const res = <VercelResponse><unknown>{
        status: function(code: number) {
            statusCode = code
            return res
        },
        json: function(data: any) {
            jsonData = data
            return res
        }
    }
    
    return { res, getStatusCode: () => statusCode, getJsonData: () => jsonData }
}
```

## Crypto Patterns

### Hex/Bytes Conversion
```typescript
// Bytes to hex
const hexString = bytesToHex(uint8Array)

// Hex to bytes  
const bytes = hexToBytes(hexString)
```

### Key Generation
```typescript
const secretKey: Uint8Array = generateSecretKey()
const publicKey: string = getPublicKey(secretKey)
```

### Event Signing
```typescript
const signature = bytesToHex(schnorr.sign(getEventHash(event), hexToBytes(secretKey)))
```

## Environment Setup

### WebCrypto Polyfill
For NIP-04 operations, always include the WebCrypto polyfill:
```typescript
import { Crypto } from "@peculiar/webcrypto"

/* c8 ignore next 3 */
if (!('crypto' in globalThis)) {
    globalThis.crypto = new Crypto()
}
```

## Error Handling

### Standard Error Response
```typescript
return response.status(404).json({error: 'Not Found'})
```

### Common HTTP Status Codes
- **200:** Success
- **404:** Invalid action/endpoint
- **400:** Bad request (invalid parameters)

## Development Workflow

### Running Tests
```bash
npm test                # Run all tests
npm run coverage        # Run tests with coverage
```

### Linting and Formatting
Ensure code adheres to TypeScript strict mode and follows linting rules:
```bash
npm run lint             # Run linter
npm run lint:fix         # Fix linting issues
```

### Project Configuration
- **TypeScript:** Strict mode enabled, ES modules
- **Vitest:** Global test functions, mocking enabled
- **Vercel:** Single region deployment (hnd1)

## Common Patterns for New Endpoints

### Adding a New Dynamic Route Action
1. Add case to switch statement in handler
2. Implement function following naming convention
3. Extract parameters with proper typing
4. Return standardized JSON response
5. Add corresponding test with mocks

### Adding a New Single Operation Endpoint
1. Create new .ts file in appropriate directory
2. Implement default export handler function
3. Follow parameter extraction patterns
4. Return standardized JSON response
5. Create test file mirroring structure

## Dependencies

### Core Dependencies
- **nostr-tools:** Nostr protocol utilities (keys, events, encoding)
- **@noble/curves:** Secp256k1 cryptography (signing/verification)
- **@noble/hashes:** Hash utilities (hex conversion)
- **@peculiar/webcrypto:** WebCrypto polyfill for NIP-04

### Development Dependencies
- **vitest:** Testing framework
- **@vercel/node:** Vercel function types
- **@vitest/coverage-v8:** Test coverage reporting

## License and Attribution

This project is MIT licensed. When contributing code, ensure compatibility with existing patterns and maintain the established architectural decisions.
