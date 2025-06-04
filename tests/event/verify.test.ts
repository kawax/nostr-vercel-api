import { expect, test, describe, vi, beforeEach } from 'vitest'
import verify from '../../api/event/verify.js'
import { createMockRequest, createMockResponse, mockEventData } from '../test-utils';

vi.mock('nostr-tools/pure', () => ({
    verifyEvent: vi.fn()
}));

describe('event/verify', () => {
    let mockVerifyEvent: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        const { verifyEvent } = await import('nostr-tools/pure');
        mockVerifyEvent = vi.mocked(verifyEvent);
    });

    test('should verify valid event successfully', () => {
        mockVerifyEvent.mockReturnValue(true);

        const validEvent = {
            ...mockEventData,
            sig: 'valid-signature'
        };

        const req = createMockRequest({}, { event: validEvent });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        verify(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('verify', true);
        expect(mockVerifyEvent).toHaveBeenCalledWith(validEvent);
    });

    test('should reject invalid event', () => {
        mockVerifyEvent.mockReturnValue(false);

        const invalidEvent = {
            ...mockEventData,
            sig: 'invalid-signature'
        };

        const req = createMockRequest({}, { event: invalidEvent });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        verify(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('verify', false);
        expect(mockVerifyEvent).toHaveBeenCalledWith(invalidEvent);
    });

    test('should handle event without signature', () => {
        mockVerifyEvent.mockReturnValue(false);

        const eventWithoutSig = { ...mockEventData };
        delete (eventWithoutSig as any).sig;

        const req = createMockRequest({}, { event: eventWithoutSig });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        verify(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('verify', false);
        expect(mockVerifyEvent).toHaveBeenCalledWith(eventWithoutSig);
    });

    test('should handle malformed event', () => {
        mockVerifyEvent.mockReturnValue(false);

        const malformedEvent = {
            kind: 'invalid',
            content: 'test',
            sig: 'some-signature'
        };

        const req = createMockRequest({}, { event: malformedEvent });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        verify(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('verify', false);
        expect(mockVerifyEvent).toHaveBeenCalledWith(malformedEvent);
    });

    test('should handle complex valid event', () => {
        mockVerifyEvent.mockReturnValue(true);

        const complexEvent = {
            ...mockEventData,
            tags: [['e', 'referenced-event'], ['p', 'mentioned-pubkey'], ['t', 'hashtag']],
            content: 'Complex event with multiple tags',
            sig: 'complex-valid-signature'
        };

        const req = createMockRequest({}, { event: complexEvent });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        verify(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('verify', true);
        expect(mockVerifyEvent).toHaveBeenCalledWith(complexEvent);
    });
});
