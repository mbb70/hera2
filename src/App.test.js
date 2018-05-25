import React from 'react';
import ReactDOM from 'react-dom';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { fromJS } from 'immutable';

import './setupTests';
import * as r from './modules/events';
import rootReducer, { newInitialState } from './modules/rootReducer';
import Tournament from './containers/tournament';
import Hutils from './utils/hutils';
import {
  dispatch,
  getPairedTournament,
  getTournamentState,
  getPlayedMatches,
} from './testUtils';

const identityFn = a => a;

it('renders without crashing', () => {
  const div = document.createElement('div');
  const fullStore = createStore(rootReducer);
  ReactDOM.render(
    <Provider store={fullStore}>
      <Tournament />
    </Provider>,
    div
  );
});

const mockStore = configureMockStore();
it('dispatches add players', () => {
  const state = newInitialState();
  const store = mockStore(state);
  store.dispatch(r.addPlayers(['bob']));
  const action = store.getActions()[0];
  expect(action).toEqual({
    type: r.actions.ADD_PLAYERS,
    names: ['bob'],
  });
});

function createTournament(state, store, name) {
  store.dispatch(r.createTournament({ name }));
  const action = store.getActions()[store.getActions().length - 1];
  return rootReducer(state, action);
}

it('creates tournament', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  expect(state.getIn(['tournament', 'tournaments', '1'])).toBe('t1');
});

function addPlayers(state, store, names) {
  store.dispatch(r.addPlayers(names));
  const action = store.getActions()[store.getActions().length - 1];
  return rootReducer(state, action);
}

it('adds players', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  state = addPlayers(state, store, ['bob']);
  expect(state.getIn(['tournament', 'players', '2'])).toEqual(
    fromJS({
      name: 'bob',
      draws: 0,
      wins: 0,
      losses: 0,
      id: '2',
      dropped: false,
      playedIds: {},
      matchIds: [],
      tournamentId: '1',
    })
  );
});

function pairPlayers(state, store) {
  const pairs = Hutils.pairPlayers(
    state.getIn(['tournament', 'players']),
    state.getIn(['tournament', 'settings', '1']),
    identityFn
  );
  store.dispatch(r.pairPlayers(pairs));
  const action = store.getActions()[store.getActions().length - 1];
  return rootReducer(state, action);
}

it('pairs players', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  state = addPlayers(state, store, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  state = pairPlayers(
    state,
    store,
    state.getIn(['tournament', 'players']).keySeq()
  );
  expect(state.getIn(['tournament', 'rounds', '1']).toJS()).toEqual({
    id: '1',
    matches: ['1', '2', '3', '4'],
    number: 1,
    active: true,
    tournamentId: '1',
  });
  const matchPairs = state
    .getIn(['tournament', 'matches'])
    .valueSeq()
    .map(m => [m.get('p1'), m.get('p2')]);
  expect(matchPairs.toJS()).toEqual([
    ['9', '3'],
    ['8', '4'],
    ['7', '5'],
    ['1', '2'],
  ]);
});

it('pairs bye', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  state = addPlayers(state, store, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  state = pairPlayers(
    state,
    store,
    state.getIn(['tournament', 'players']).keySeq()
  );
  const byeId = state.getIn(['tournament', 'settings', '1', 'byePlayerId']);
  const byeMatch = state
    .getIn(['tournament', 'matches'])
    .valueSeq()
    .find(m => m.get('p1') === byeId);
  const otherMatch = state
    .getIn(['tournament', 'matches'])
    .find(m => m.get('p2') !== byeId);
  expect(byeMatch.get('score')).toBe('2 - 0');
  expect(byeMatch.get('active')).toBeFalsy();
  expect(otherMatch.get('score')).toBe('0 - 0');
  expect(otherMatch.get('active')).toBeTruthy();
});

it('doesnt pair player with bye twice', () => {
  let state = getPlayedMatches(7);
  const store = mockStore(state);
  state = dispatch(state, store, r.finishRound());
  const matches = state.getIn(['tournament', 'matches']);
  const byeId = state.getIn(['tournament', 'settings', '1', 'byePlayerId']);
  const byeMatch = matches.find(m => m.get('p1') === byeId);
  const byedPlayerId = byeMatch.get('p2');
  state = dispatch(state, store, r.rePairPlayers(identityFn));
  const pairs = state.getIn(['pairingForm', 'pairs']);
  const byedPair = pairs.find(p => p.get(0) === byeId);
  expect(byedPair.get(1)).not.toEqual(byedPlayerId);
});

it('bye goes to lowest scorer who has not had bye', () => {
  let state = getTournamentState(3);
  const store = mockStore(state);
  const settings = state.getIn(['tournament', 'settings', '1']);
  const byeId = settings.get('byePlayerId');
  state = state.updateIn(['tournament', 'players'], players =>
    players.map(p => {
      if (p.get('bye')) return p;
      if (p.get('id') === '2') {
        return p.set('wins', 1);
      }
      return p.setIn(['playedIds', byeId, true]);
    })
  );
  state = dispatch(state, store, r.rePairPlayers(identityFn));
  const pairs = state.getIn(['pairingForm', 'pairs']);
  expect(pairs.toJS()).toEqual([['4', '3'], ['1', '2']]);
});

it('always assign win to bye opponent', () => {
  let state = getTournamentState(1);
  const store = mockStore(state);
  const settings = state.getIn(['tournament', 'settings', '1']);
  const byeId = settings.get('byePlayerId');
  const pId = state
    .getIn(['tournament', 'players'])
    .find(v => v.get('id') !== byeId)
    .get('id');

  state = dispatch(state, store, r.pairPlayers([[byeId, pId]]));
  let byeMatch = state.getIn(['tournament', 'matches']).first();
  expect(byeMatch.get('winner')).toEqual(pId);

  state = dispatch(state, store, r.pairPlayers([[pId, byeId]]));
  byeMatch = state.getIn(['tournament', 'matches']).first();
  expect(byeMatch.get('winner')).toEqual(pId);
});

function saveSettings(state, store, settings) {
  store.dispatch(r.saveSettings(settings));
  const action = store.getActions()[store.getActions().length - 1];
  return rootReducer(state, action);
}

it('updates settings', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  expect(state.getIn(['tournament', 'tournaments', '1'])).toBe('t1');
  state = saveSettings(state, store, { tournamentName: 't2' });
  expect(state.getIn(['tournament', 'tournaments', '1'])).toBe('t2');
});

it('updates matches', () => {
  let state = getPairedTournament(4);
  const store = mockStore(state);
  const matchId = '1';
  const oldMatch = state.getIn(['tournament', 'matches', matchId]);
  expect(oldMatch.get('winner')).toBeFalsy();
  expect(oldMatch.get('score')).toBe('0 - 0');
  const update = {
    id: matchId,
    winner: '2',
    score: '2 - 0',
    drop: ['2'],
  };
  state = dispatch(state, store, r.updateMatch(update));
  const updatedMatch = state.getIn(['tournament', 'matches', matchId]);
  expect(updatedMatch.get('winner')).toBe('2');
  expect(updatedMatch.get('score')).toBe('2 - 0');
});

it('finishes round', () => {
  let state = getPlayedMatches(4);
  const store = mockStore(state);
  state = dispatch(state, store, r.finishRound());
  const matches = state.getIn(['tournament', 'matches']);
  const players = state.getIn(['tournament', 'players']);
  const rounds = state.getIn(['tournament', 'rounds']);
  const allMatchesFinished = matches.every(m => !m.get('active'));
  expect(allMatchesFinished).toBeTruthy();

  matches.forEach(m => {
    const p1 = m.get('p1');
    const p2 = m.get('p2');
    const winner = m.get('winner');
    const loser = winner === p1 ? p2 : p1;

    //There was a winner
    if (winner === p1 || winner === p2) {
      const winnerWins = players.getIn([winner, 'wins']);
      const winnerLosses = players.getIn([winner, 'losses']);
      expect(winnerWins).toBe(1);
      expect(winnerLosses).toBe(0);
      const loserLosses = players.getIn([loser, 'losses']);
      const loserWins = players.getIn([loser, 'wins']);
      expect(loserLosses).toBe(1);
      expect(loserWins).toBe(0);
    } else {
      //There was a draw
      expect(players.getIn([p1, 'draws'])).toBe(1);
      expect(players.getIn([p2, 'draws'])).toBe(1);
    }

    const notPlayP1 = !players.getIn([p1, 'playing']);
    const notPlayP2 = !players.getIn([p2, 'playing']);
    expect(notPlayP1 && notPlayP2).toBeTruthy();

    const didPlayP1 = players.getIn([p1, 'playedIds', p2]);
    const didPlayP2 = players.getIn([p2, 'playedIds', p1]);
    expect(didPlayP1 && didPlayP2).toBeTruthy();
  });

  expect(rounds.every(rd => !rd.get('active'))).toBeTruthy();
});

it('clears tournaments', () => {
  let state = getPlayedMatches(5);
  const store = mockStore(state);
  state = dispatch(state, store, r.clearTournament());
  expect(state.getIn(['tournament', 'currentTournament'])).toBe(undefined);
});

it('deletes tournaments', () => {
  let state = getPlayedMatches(5);
  const store = mockStore(state);
  state = dispatch(state, store, r.deleteTournament());
  expect(state.getIn(['tournament', 'tournaments']).count()).toBe(0);
  expect(state.getIn(['tournament', 'settings']).count()).toBe(0);
  expect(state.getIn(['tournament', 'players']).count()).toBe(0);
  expect(state.getIn(['tournament', 'matches']).count()).toBe(0);
  expect(state.getIn(['tournament', 'rounds']).count()).toBe(0);
  expect(state.getIn(['tournament', 'currentTournament'])).toBeFalsy();
});

it('switches tournaments', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = dispatch(state, store, r.createTournament({ name: 't1' }));
  state = dispatch(state, store, r.createTournament({ name: 't2' }));
  state = dispatch(state, store, r.switchTournament('2'));
  expect(state.getIn(['tournament', 'currentTournament'])).toBe('2');
});

it('renames players', () => {
  let state = getPlayedMatches(5);
  const store = mockStore(state);
  state = dispatch(state, store, r.updatePlayer({ id: '1', name: 'Matt' }));
  expect(state.getIn(['tournament', 'players', '1', 'name'])).toBe('Matt');
});

it('drops players from matches', () => {
  let state = getPlayedMatches(5);
  const store = mockStore(state);

  const matchId = '1';

  const update = {
    id: matchId,
    winner: '2',
    score: '2 - 0',
    drop: ['2'],
  };
  state = dispatch(state, store, r.updateMatch(update));
  state = dispatch(state, store, r.finishRound('1'));
  const dropped = state.getIn(['tournament', 'players', '2', 'dropped']);
  expect(dropped).toBeTruthy();
});

it('increments round numbers', () => {
  let state = getPlayedMatches(5);
  const store = mockStore(state);
  state = dispatch(state, store, r.finishRound('1'));
  state = dispatch(state, store, r.rePairPlayers(identityFn));
  const pairs = state.getIn(['pairingForm', 'pairs']).toJS();
  state = dispatch(state, store, r.pairPlayers(pairs));
  expect(state.getIn(['tournament', 'rounds', '2', 'number'])).toBe(2);
});
