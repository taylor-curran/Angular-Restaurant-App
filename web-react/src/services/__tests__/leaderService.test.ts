import { afterEach, describe, expect, it } from 'vitest';
import { installFetchMock } from '../../test/mockFetch';
import { RAW_LEADERS } from '../../test/fixtures';
import { getFeaturedLeader, getLeaders } from '../leaderService';

let mock: ReturnType<typeof installFetchMock>;
afterEach(() => mock?.restore());

describe('leaderService HTTP contract', () => {
  it('GET /leaders -> normalized leaders', async () => {
    mock = installFetchMock({ 'GET /leaders': { body: RAW_LEADERS } });
    const leaders = await getLeaders();
    expect(mock.calls[0].url).toBe('/leaders');
    expect(leaders[0]).toMatchObject({ id: '0', abbr: 'CEO' });
    expect(leaders[1]).toMatchObject({ id: '3', abbr: 'EC' });
  });

  it('GET /leaders?featured=true -> featured one', async () => {
    mock = installFetchMock({
      'GET /leaders?featured=true': { body: [RAW_LEADERS[1]] },
    });
    const leader = await getFeaturedLeader();
    expect(mock.calls[0].url).toBe('/leaders?featured=true');
    expect(leader.id).toBe('3');
  });
});
