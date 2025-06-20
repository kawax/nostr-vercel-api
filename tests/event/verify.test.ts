import { expect, test, describe, vi, beforeEach } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyEvent } from 'nostr-tools'

vi.mock('nostr-tools', () => ({
  verifyEvent: vi.fn()
}))

const mockVerifyEvent = vi.mocked(verifyEvent)

import verify from '../../api/event/verify'

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

describe('event/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockVerifyEvent.mockReturnValue(true)
  })

  test('should verify valid event successfully', () => {
    const mockEvent = {
      id: 'test-event-id',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      kind: 1,
      tags: [],
      content: 'test content',
      sig: 'valid-signature'
    }

    const req = createMockRequest({ event: mockEvent })
    const { res, getStatusCode, getJsonData } = createMockResponse()

    verify(req, res)

    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('verify')
    expect(getJsonData().verify).toBe(true)
  })

  test('should return false for invalid event', () => {
    mockVerifyEvent.mockReturnValueOnce(false)

    const mockEvent = {
      id: 'test-event-id',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      kind: 1,
      tags: [],
      content: 'test content',
      sig: 'invalid-signature'
    }

    const req = createMockRequest({ event: mockEvent })
    const { res, getStatusCode, getJsonData } = createMockResponse()

    verify(req, res)

    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('verify')
    expect(getJsonData().verify).toBe(false)
  })

  test('should return object type', () => {
    const mockEvent = {
      id: 'test-event-id',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      kind: 1,
      tags: [],
      content: 'test content',
      sig: 'valid-signature'
    }

    const req = createMockRequest({ event: mockEvent })
    const { res } = createMockResponse()

    expect(verify(req, res)).toBeTypeOf('object')
  })

  test('should handle event with complex structure', () => {
    const mockEvent = {
      id: 'complex-event-id',
      pubkey: 'test-pubkey',
      created_at: 1234567890,
      kind: 1,
      tags: [
        ['e', 'referenced-event-id', 'wss://relay.example.com'],
        ['p', 'mentioned-pubkey'],
        ['t', 'hashtag']
      ],
      content: 'Complex event with multiple tags and references',
      sig: 'complex-signature'
    }

    const req = createMockRequest({ event: mockEvent })
    const { res, getStatusCode, getJsonData } = createMockResponse()

    verify(req, res)

    expect(getStatusCode()).toBe(200)
    expect(getJsonData()).toHaveProperty('verify')
    expect(typeof getJsonData().verify).toBe('boolean')
  })
})
