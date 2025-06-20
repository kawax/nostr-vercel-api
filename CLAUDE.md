# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Testing
```bash
npm test                # Run all tests
npm run coverage        # Run tests with coverage report
vitest run tests/key    # Run specific test directory
vitest run tests/key/generate.test.ts  # Run single test file
```

### Linting
```bash
npm run lint            # Check for linting errors
npm run lint:fix        # Auto-fix linting errors
```

### Development
```bash
vercel dev              # Run local development server
```

## Architecture Overview

This is a Nostr API service built with Vercel serverless functions. It provides HTTP endpoints for server-side languages that cannot easily implement Schnorr signatures required by the Nostr protocol.

### API Structure

The API is organized into four main categories, each with its own pattern:

1. **Dynamic Route Pattern** (`[action].ts`): Used for `/key/` and `/nip19/` endpoints
   - Single file handles multiple operations via query parameter
   - Switch statement routes to appropriate function based on `action` parameter
   - Example: `/api/key/generate`, `/api/key/from_sk`

2. **Single Operation Pattern**: Used for `/event/` and `/nip04/` endpoints
   - Each operation has its own file
   - Direct handler implementation without routing
   - Example: `/api/event/publish.ts`, `/api/event/sign.ts`

### Key Response Patterns

All endpoints return JSON responses with consistent structure:

```typescript
// Success
return response.status(200).json({
    propertyName: value
})

// Error
return response.status(404).json({error: 'Not Found'})
```

### Cryptographic Operations

The project uses `@noble/curves` for secp256k1 operations and `nostr-tools` for Nostr-specific utilities. Common patterns:

```typescript
// Key generation
const secretKey = generateSecretKey()
const publicKey = getPublicKey(secretKey)

// Hex conversion
const hexString = bytesToHex(uint8Array)
const bytes = hexToBytes(hexString)
```

### Testing Patterns

Tests mirror the API structure and extensively use mocking:

```typescript
// Mock external dependencies
vi.mock('nostr-tools', () => ({
    generateSecretKey: vi.fn(),
    getPublicKey: vi.fn(),
    nip19: {
        nsecEncode: vi.fn(),
        npubEncode: vi.fn()
    }
}))

// Use typed mocks
const mockedGenerateSecretKey = vi.mocked(generateSecretKey)
```

### WebCrypto Polyfill

For NIP-04 encryption operations, a WebCrypto polyfill is required:

```typescript
import { Crypto } from "@peculiar/webcrypto"

/* c8 ignore next 3 */
if (!('crypto' in globalThis)) {
    globalThis.crypto = new Crypto()
}
```

### Import Order Convention

1. External crypto libraries (`nostr-tools`, `@noble/*`)
2. Vercel types
3. Additional type imports
4. Blank line before implementation

### Parameter Extraction

```typescript
// From query string
const {action}: { action?: string } = request.query

// From request body
const {sk, pk, content}: { sk: string, pk: string, content: string } = request.body
```

## Important Notes

- CORS is not supported - this API is for server-side use only
- Deployed to Tokyo region (hnd1) for optimal performance
- All keys are handled in hex format internally, with NIP-19 encoding for external representation
- Tests should always mock external dependencies to ensure isolation