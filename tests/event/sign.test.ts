import { expect, test, describe, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { getEventHash } from 'nostr-tools'
import { schnorr } from '@noble/curves/secp256k1'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'

vi.mock('nostr-tools', () => ({
  getEventHash: vi.fn()
}))

vi.mock('@noble/curves/secp256k1', () => ({
  schnorr: {
    sign: vi.fn()
  }
}))

vi.mock('@noble/hashes/utils', () => ({
  bytesToHex: vi.fn(),
  hexToBytes: vi.fn()
}))

const mockGetEventHash = vi.mocked(getEventHash)
const mockSchnorrSign = vi.mocked(schnorr.sign)
const mockBytesToHex = vi.mocked(bytesToHex)
const mockHexToBytes = vi.mocked(hexToBytes)

import sign from '../../api/event/sign'

function createMockRequest(body: any): VercelRequest {
  return <VercelRequest><unknown>{
    body
  }
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

describe('event/sign', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetEventHash.mockReturnValue('test-event-hash')
    mockSchnorrSign.mockReturnValue(new Uint8Array(64).fill(1))
    mockBytesToHex.mockReturnValue('0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101')
    mockHexToBytes.mockReturnValue(new Uint8Array(32).fill(1))
  })

  test('should sign event successfully', () => {
    const mockEvent = {
      id: 'test-event-id',
      kind: 1,
      tags: [],
      content: 'test content',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      sig: 'test-signature'
    }
    
    const req = createMockRequest({
      event: mockEvent,
      sk: '0101010101010101010101010101010101010101010101010101010101010101'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    sign(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('sign')
    expect(getJsonData().sign).toBe('0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101')
  })

  test('should return object type', async () => {
    const mockEvent = {
      id: 'test-event-id',
      kind: 1,
      tags: [],
      content: 'test content',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      sig: 'test-signature'
    }
    
    const req = createMockRequest({ 
      event: mockEvent,
      sk: '0101010101010101010101010101010101010101010101010101010101010101'
    })
    const { res } = createMockResponse()
    
    const result = await sign(req, res)
    expect(result).toBeTypeOf('object')
  })

  test('should handle different event kinds', () => {
    const mockEvent = {
      id: 'test-event-id-kind3',
      kind: 3,
      tags: [['p', 'followed-pubkey']],
      content: '',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      sig: 'test-signature'
    }
    
    const req = createMockRequest({
      event: mockEvent,
      sk: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    sign(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('sign')
    expect(typeof getJsonData().sign).toBe('string')
  })
})
