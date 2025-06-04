import { expect, test, describe, vi, beforeEach } from 'vitest'
import hash from '../../api/event/hash.js'
import { createMockRequest, createMockResponse, mockEventData } from '../test-utils';

vi.mock('nostr-tools/pure', () => ({
    getEventHash: vi.fn()
}));

describe('event/hash', () => {
    let mockGetEventHash: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        const { getEventHash } = await import('nostr-tools/pure');
        mockGetEventHash = vi.mocked(getEventHash);
    });

    test('should calculate event hash successfully', () => {
        const expectedHash = 'calculated-hash-value';
        mockGetEventHash.mockReturnValue(expectedHash);

        const req = createMockRequest({}, { event: mockEventData });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        hash(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('hash', expectedHash);
        expect(mockGetEventHash).toHaveBeenCalledWith(mockEventData);
    });

    test('should handle empty event', () => {
        const expectedHash = 'empty-event-hash';
        mockGetEventHash.mockReturnValue(expectedHash);

        const req = createMockRequest({}, { event: {} });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        hash(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('hash', expectedHash);
        expect(mockGetEventHash).toHaveBeenCalledWith({});
    });

    test('should handle complex event structure', () => {
        const complexEvent = {
            ...mockEventData,
            tags: [['e', 'referenced-event-id'], ['p', 'mentioned-pubkey']],
            content: 'Complex event with tags and references'
        };
        const expectedHash = 'complex-event-hash';
        mockGetEventHash.mockReturnValue(expectedHash);

        const req = createMockRequest({}, { event: complexEvent });
        const { res, getStatusCode, getJsonData } = createMockResponse();

        hash(req, res);

        expect(getStatusCode()).toBe(200);
        expect(getJsonData()).toHaveProperty('hash', expectedHash);
        expect(mockGetEventHash).toHaveBeenCalledWith(complexEvent);
    });
});
