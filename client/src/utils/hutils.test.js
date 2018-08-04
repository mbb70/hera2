import configureMockStore from 'redux-mock-store';
import Hutils from './hutils';
import { dispatch, getPlayedMatches } from '../testUtils';
import * as r from '../modules/events';

const mockStore = configureMockStore();

it('shuffles arrays', () => {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7];
  const shuffled = Hutils.shuffle(arr);
  expect(shuffled.length).toBe(arr.length);
  shuffled.forEach(e => expect(arr.indexOf(e) !== -1).toBe(true));
});

it('gets pojo scores', () => {
  let state = getPlayedMatches(10);
  const store = mockStore(state);
  state = dispatch(state, store, r.finishRound('1'));
  const player = state.tournament.getIn(['players', '2']);
  const settings = state.tournament.getIn(['settings', '1']);
  const score = Hutils.getScorePojo(player.toJS(), settings.toJS());
  expect(score).toBe(1);
});

it('handles undefined settings', () => {
  const scorePojo = Hutils.getScorePojo(undefined, undefined);
  expect(scorePojo).toBe(undefined);
  const score = Hutils.getScore(undefined, undefined);
  expect(score).toBe(undefined);
});
