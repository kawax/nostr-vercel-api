import { expect, test, describe, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { nip04 } from 'nostr-tools'

vi.mock('nostr-tools', () => ({
  nip04: {
    encrypt: vi.fn(),
    decrypt: vi.fn()
  }
}))

const mockNip04Encrypt = vi.mocked(nip04.encrypt)
const mockNip04Decrypt = vi.mocked(nip04.decrypt)

import nip04Handler from '../../api/nip04/[action]'

vi.mock('@peculiar/webcrypto', () => ({
  Crypto: vi.fn(() => ({}))
}))

function createMockRequest(query: Record<string, string> = {}, body: any = {}): VercelRequest {
  return <VercelRequest><unknown>{
    query,
    body
  }
}

function createMockResponse() {
  let statusCode = 200
  let jsonData: any = null

  const res = <VercelResponse><unknown>{
    status(code: number) {
      statusCode = code
      return res
    },
    json(data: any) {
      jsonData = data
      return res
    }
  }

  return { res, getStatusCode: () => statusCode, getJsonData: () => jsonData }
}

describe('nip04/encrypt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNip04Encrypt.mockResolvedValue('encrypted-content-base64')
    mockNip04Decrypt.mockResolvedValue('decrypted-plain-text')
  })

  test('should encrypt content successfully', async () => {
    const req = createMockRequest(
      { action: 'encrypt' },
      {
        sk: '0101010101010101010101010101010101010101010101010101010101010101',
        pk: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        content: 'Hello, this is a secret message!'
      }
    )
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await nip04Handler(req, res)

    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('encrypt')
    expect(getJsonData().encrypt).toBe('encrypted-content-base64')
  })

  test('should handle empty content encryption', async () => {
    const req = createMockRequest(
      { action: 'encrypt' },
      {
        sk: '0101010101010101010101010101010101010101010101010101010101010101',
        pk: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        content: ''
      }
    )
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await nip04Handler(req, res)

    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('encrypt')
  })
})

describe('nip04/decrypt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNip04Encrypt.mockResolvedValue('encrypted-content-base64')
    mockNip04Decrypt.mockResolvedValue('decrypted-plain-text')
  })

  test('should decrypt content successfully', async () => {
    const req = createMockRequest(
      { action: 'decrypt' },
      {
        sk: '0101010101010101010101010101010101010101010101010101010101010101',
        pk: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        content: 'encrypted-content-base64'
      }
    )
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await nip04Handler(req, res)

    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('decrypt')
    expect(getJsonData().decrypt).toBe('decrypted-plain-text')
  })

  test('should handle long encrypted content', async () => {
    const req = createMockRequest(
      { action: 'decrypt' },
      {
        sk: '0101010101010101010101010101010101010101010101010101010101010101',
        pk: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        content: 'very-long-encrypted-content-base64-string-with-lots-of-data'
      }
    )
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await nip04Handler(req, res)

    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('decrypt')
  })
})

describe('nip04/error', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNip04Encrypt.mockResolvedValue('encrypted-content-base64')
    mockNip04Decrypt.mockResolvedValue('decrypted-plain-text')
  })

  test('should return 404 for invalid action', async () => {
    const req = createMockRequest(
      { action: 'invalid_action' },
      {
        sk: '0101010101010101010101010101010101010101010101010101010101010101',
        pk: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        content: 'test content'
      }
    )
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await nip04Handler(req, res)

    expect(getStatusCode()).toBe(404)
    expect(getJsonData()).toHaveProperty('error', 'Not Found')
  })

  test('should return 404 when no action is provided', async () => {
    const req = createMockRequest(
      {},
      {
        sk: '0101010101010101010101010101010101010101010101010101010101010101',
        pk: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
        content: 'test content'
      }
    )
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await nip04Handler(req, res)

    expect(getStatusCode()).toBe(404)
    expect(getJsonData()).toHaveProperty('error', 'Not Found')
  })

  test('should handle encryption errors gracefully', async () => {
    mockNip04Encrypt.mockRejectedValueOnce(new Error('Encryption failed'))

    const req = createMockRequest(
      { action: 'encrypt' },
      {
        sk: 'invalid-key',
        pk: 'invalid-pubkey',
        content: 'test content'
      }
    )
    const { res } = createMockResponse()

    await expect(nip04Handler(req, res)).rejects.toThrow('Encryption failed')
  })

  test('should handle decryption errors gracefully', async () => {
    mockNip04Decrypt.mockRejectedValueOnce(new Error('Decryption failed'))

    const req = createMockRequest(
      { action: 'decrypt' },
      {
        sk: 'invalid-key',
        pk: 'invalid-pubkey',
        content: 'invalid-encrypted-content'
      }
    )
    const { res } = createMockResponse()

    await expect(nip04Handler(req, res)).rejects.toThrow('Decryption failed')
  })
})
