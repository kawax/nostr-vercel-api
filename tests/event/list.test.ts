import { expect, test, describe, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SimplePool } from 'nostr-tools'

vi.mock('nostr-tools', () => ({
  SimplePool: vi.fn()
}))

const mockSimplePool = vi.mocked(SimplePool)

import list from '../../api/event/list'

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

describe('event/list', () => {
  const mockEvents = [
    {
      id: 'test-event-id-1',
      pubkey: 'test-pubkey-1',
      created_at: 1234567890,
      kind: 1,
      tags: [],
      content: 'test content 1',
      sig: 'test-signature-1'
    },
    {
      id: 'test-event-id-2',
      pubkey: 'test-pubkey-2',
      created_at: 1234567891,
      kind: 1,
      tags: [],
      content: 'test content 2',
      sig: 'test-signature-2'
    }
  ]

  const mockQuerySync = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockQuerySync.mockResolvedValue(mockEvents)
    mockSimplePool.mockImplementation(() => ({
      querySync: mockQuerySync
    }) as any)
  })

  test('should list events successfully', async () => {
    const req = createMockRequest({
      filter: { kinds: [1] },
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    await list(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('events')
    expect(getJsonData().events).toEqual(mockEvents)
    expect(getJsonData().events).toHaveLength(2)
  })

  test('should return empty array when no events found', async () => {
    mockQuerySync.mockResolvedValueOnce([])
    
    const req = createMockRequest({
      filter: { kinds: [999] },
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    await list(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('events')
    expect(getJsonData().events).toEqual([])
    expect(getJsonData().events).toHaveLength(0)
  })

  test('should handle filter with author criteria', async () => {
    const req = createMockRequest({
      filter: { 
        authors: ['test-pubkey-1'],
        limit: 10
      },
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    await list(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('events')
    expect(Array.isArray(getJsonData().events)).toBe(true)
  })

  test('should handle filter with time range', async () => {
    const req = createMockRequest({
      filter: { 
        since: 1234567890,
        until: 1234567900,
        kinds: [1]
      },
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()
    
    await list(req, res)
    
    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('events')
  })
})
