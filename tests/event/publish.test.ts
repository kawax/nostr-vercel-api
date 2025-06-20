import { expect, test, describe, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { finalizeEvent, verifyEvent, Relay } from 'nostr-tools'

const mockFinalizeEvent = vi.mocked(finalizeEvent)
const mockVerifyEvent = vi.mocked(verifyEvent)
const mockRelayConnect = vi.mocked(Relay.connect)

import publish from '../../api/event/publish'

vi.mock('nostr-tools', () => ({
  finalizeEvent: vi.fn(),
  verifyEvent: vi.fn(),
  Relay: {
    connect: vi.fn()
  }
}))

vi.mock('ws', () => ({
  WebSocket: vi.fn()
}))

vi.mock('@noble/hashes/utils', () => ({
  hexToBytes: vi.fn(() => new Uint8Array(32).fill(1))
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

describe('event/publish', () => {
  const mockRelay = {
    publish: vi.fn().mockResolvedValue(undefined),
    close: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFinalizeEvent.mockReturnValue({
      id: 'test-event-id',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      kind: 1,
      tags: [],
      content: 'test content',
      sig: 'test-signature'
    } as any)
    mockVerifyEvent.mockReturnValue(true)
    mockRelayConnect.mockResolvedValue(mockRelay as any)
  })

  test('should publish event successfully', async () => {
    const mockEvent = {
      kind: 1,
      tags: [],
      content: 'test content',
      pubkey: 'test-pubkey'
    }

    const req = createMockRequest({
      event: mockEvent,
      sk: '0101010101010101010101010101010101010101010101010101010101010101',
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await publish(req, res)

    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('message', 'ok')
    expect(getJsonData()).toHaveProperty('event')
    expect(getJsonData().event).toHaveProperty('id', 'test-event-id')
  })

  test('should return error when relay is undefined', async () => {
    const mockEvent = {
      kind: 1,
      tags: [],
      content: 'test content',
      pubkey: 'test-pubkey'
    }

    const req = createMockRequest({
      event: mockEvent,
      sk: '0101010101010101010101010101010101010101010101010101010101010101'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await publish(req, res)

    expect(getStatusCode()).toBe(500)
    expect(getJsonData()).toHaveProperty('error', 'error')
  })

  test('should return error when event verification fails', async () => {
    mockVerifyEvent.mockReturnValueOnce(false)

    const mockEvent = {
      kind: 1,
      tags: [],
      content: 'test content',
      pubkey: 'test-pubkey'
    }

    const req = createMockRequest({
      event: mockEvent,
      sk: '0101010101010101010101010101010101010101010101010101010101010101',
      relay: 'wss://relay.example.com'
    })
    const { res, getStatusCode, getJsonData } = createMockResponse()

    await publish(req, res)

    expect(getStatusCode()).toBe(500)
    expect(getJsonData()).toHaveProperty('error', 'error')
  })

  test('should set created_at if not provided', async () => {
    const mockEvent: any = {
      kind: 1,
      tags: [],
      content: 'test content',
      pubkey: 'test-pubkey'
    }

    const req = createMockRequest({
      event: mockEvent,
      sk: '0101010101010101010101010101010101010101010101010101010101010101',
      relay: 'wss://relay.example.com'
    })
    const { res } = createMockResponse()

    await publish(req, res)

    expect(mockEvent.created_at).toBeDefined()
    expect(typeof mockEvent.created_at).toBe('number')
  })
})
