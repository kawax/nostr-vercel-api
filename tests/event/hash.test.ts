import { expect, test, describe, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { getEventHash } from 'nostr-tools'

vi.mock('nostr-tools', () => ({
  getEventHash: vi.fn()
}))

const mockGetEventHash = vi.mocked(getEventHash)

import hash from '../../api/event/hash'

function createMockRequest(body: any): VercelRequest {
  return <VercelRequest><unknown>{
    body
  }
}

function createMockResponse() {
  let statusCode = 200
  let jsonData: any = null
  let returnValue: any = null
  
  const res = <VercelResponse><unknown>{
    status: function(code: number) {
      statusCode = code
      return res
    },
    json: function(data: any) {
      jsonData = data
      returnValue = res
      return res
    }
  }
  
  return { res, getStatusCode: () => statusCode, getJsonData: () => jsonData, getReturnValue: () => returnValue }
}

describe('event/hash', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetEventHash.mockReturnValue('test-event-hash-123456789abcdef')
  })

  test('should calculate event hash successfully', async () => {
    const mockEvent = {
      id: 'test-event-id',
      kind: 1,
      tags: [],
      content: 'test content',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      sig: 'test-signature'
    }
    
    const req = createMockRequest({ event: mockEvent })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    const result = await hash(req, res)
    

    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('hash')
    expect(getJsonData().hash).toBe('test-event-hash-123456789abcdef')
  })

  test('should return object type', () => {
    const mockEvent = {
      kind: 1,
      tags: [],
      content: 'test content',
      pubkey: 'test-pubkey',
      created_at: 1234567890
    }
    
    const req = createMockRequest({ event: mockEvent })
    const { res } = createMockResponse()
    
    expect(hash(req, res)).toBeTypeOf('object')
  })

  test('should handle event with tags', async () => {
    const mockEvent = {
      id: 'test-event-id-with-tags',
      kind: 1,
      tags: [['e', 'referenced-event-id'], ['p', 'mentioned-pubkey']],
      content: 'test content with references',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      sig: 'test-signature'
    }
    
    const req = createMockRequest({ event: mockEvent })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    await hash(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('hash')
    expect(typeof getJsonData().hash).toBe('string')
  })
})
