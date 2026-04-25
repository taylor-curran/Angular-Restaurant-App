import { afterEach, describe, expect, it } from 'vitest';
import { installFetchMock } from '../../test/mockFetch';
import { putFeedback } from '../feedbackService';

let mock: ReturnType<typeof installFetchMock>;
afterEach(() => mock?.restore());

describe('feedbackService HTTP contract', () => {
  it('POST /feedback -> sends a JSON body matching the Feedback shape', async () => {
    const payload = {
      firstname: 'Ada',
      lastname: 'Lovelace',
      telnum: 12345,
      email: 'ada@example.com',
      agree: true,
      contacttype: 'Tel',
      message: 'Loved it.',
    };
    mock = installFetchMock({ 'POST /feedback': { body: { ...payload, id: 1 } } });
    const saved = await putFeedback(payload);
    expect(mock.calls).toHaveLength(1);
    const call = mock.calls[0];
    expect(call.method).toBe('POST');
    expect(call.url).toBe('/feedback');
    expect(call.body).toEqual(payload);
    expect(saved).toMatchObject(payload);
  });
});
