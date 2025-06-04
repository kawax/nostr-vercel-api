import { expect, test, describe, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SimplePool } from 'nostr-tools'

vi.mock('nostr-tools', () => ({
  SimplePool: vi.fn()
}))

const mockSimplePool = vi.mocked(SimplePool)

import get from '../../api/event/get'

vi.mock('ws', () => ({
  WebSocket: vi.fn()
}))

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

describe('event/get', () => {
  const mockEvent = {
    id: 'test-event-id',
    pubkey: 'test-pubkey',
    created_at: 1234567890,
    kind: 1,
    tags: [],
    content: 'test content',
    sig: 'test-signature'
  }

  const mockGet = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockResolvedValue(mockEvent)
    mockSimplePool.mockImplementation(() => ({
      get: mockGet
    }) as any)
  })

  test('should get event successfully', async () => {
    const req = createMockRequest({
      filter: { ids: ['test-event-id'] },
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    await get(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('event')
    expect(getJsonData().event).toEqual(mockEvent)
  })

  test('should return null when event not found', async () => {
    mockGet.mockResolvedValueOnce(null)
    
    const req = createMockRequest({
      filter: { ids: ['nonexistent-id'] },
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    await get(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('event', null)
  })

  test('should handle filter with multiple criteria', async () => {
    const req = createMockRequest({
      filter: { 
        authors: ['test-pubkey'],
        kinds: [1],
        since: 1234567890
      },
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    await get(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('event')
  })
})
