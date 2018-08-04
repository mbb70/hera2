import configureMockStore from 'redux-mock-store';

import {
  currentFilteredPlayers,
  currentFilteredRounds,
  currentActiveRound,
  currentSettings,
} from './tournament';
import '../setupTests';
import { dispatch, getPlayedMatches } from '../testUtils';
import { newInitialState } from '../modules/rootReducer';
import * as r from '../modules/events';
import Hutils from '../utils/hutils';

const mockStore = configureMockStore();
it('filters players by search text', () => {
  let state = getPlayedMatches(10);
  const store = mockStore(state);

  const allPlayers = currentFilteredPlayers(state);
  expect(allPlayers.count()).toBe(10);
  expect(state.ui.get('searchText')).toBe('');

  state = dispatch(state, store, r.updateSearch('1'));
  expect(state.ui.get('searchText')).toBe('1');

  const filteredPlayers = currentFilteredPlayers(state);
  expect(filteredPlayers.count()).toBe(2);
  const filteredNames = filteredPlayers.map(p => p.get('name')).toJS();
  expect(filteredNames).toEqual(['p1', 'p10']);
});

it('filters dropped players', () => {
  let state = getPlayedMatches(10);
  const store = mockStore(state);
  state = dispatch(state, store, r.updatePlayer({ id: '2', dropped: true }));

  const allPlayers = currentFilteredPlayers(state);
  expect(allPlayers.count()).toBe(10);

  state = dispatch(state, store, r.toggleDroppedFilter(true));
  const filteredPlayers = currentFilteredPlayers(state);

  expect(filteredPlayers.count()).toBe(9);
  expect(filteredPlayers.some(p => p.get('dropped'))).toBeFalsy();
});

it('never shows deleted players', () => {
  let state = getPlayedMatches(10);
  const store = mockStore(state);
  state = dispatch(state, store, r.updatePlayer({ id: '2', deleted: true }));
  const allPlayers = currentFilteredPlayers(state);
  expect(allPlayers.count()).toBe(9);
});

it('defaults to alphabetical name sort', () => {
  const state = getPlayedMatches(10);
  const allPlayers = currentFilteredPlayers(state);
  expect(allPlayers.first().get('name')).toBe('p1');
  expect(allPlayers.get(1).get('name')).toBe('p10');
});

it('switches to score sort', () => {
  let state = getPlayedMatches(10);
  const store = mockStore(state);
  const round = currentActiveRound(state);
  state = dispatch(state, store, r.finishRound(round.get('id')));
  state = dispatch(state, store, r.toggleSortType(true));
  const allPlayers = currentFilteredPlayers(state);
  const settings = currentSettings(state);
  const scores = allPlayers.map(p => Hutils.getScore(p, settings)).toJS();
  expect(scores).toEqual([3, 3, 3, 3, 1, 1, 0, 0, 0, 0]);
});

it('filters matches and rounds', () => {
  let state = getPlayedMatches(10);
  const store = mockStore(state);
  const round = currentActiveRound(state);
  state = dispatch(state, store, r.finishRound(round.get('id')));

  const allMatchIds = currentFilteredRounds(state).getIn([0, 'matches']);
  expect(allMatchIds.count()).toBe(5);

  state = dispatch(state, store, r.updateSearch('1'));

  const filteredMatchIds = currentFilteredRounds(state).getIn([0, 'matches']);
  expect(filteredMatchIds.count()).toBe(1);

  state = dispatch(state, store, r.updateSearch('no match'));

  const filteredRounds = currentFilteredRounds(state);
  expect(filteredRounds.count()).toBe(0);
});

it('doesnt fail when no tournament settings available', () => {
  const state = newInitialState();
  const settings = currentSettings(state);
  expect(settings).toBe(undefined);
});
