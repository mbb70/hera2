import './setupTests';
import React from 'react';
import ReactDOM from 'react-dom';
import configureMockStore from 'redux-mock-store'
import * as r from './modules/events';
import reducer from './modules/Tournament';
import uiReducer from './modules/uiState';
import { newInitialState } from './modules/Tournament';
import * as tr from './modules/Tournament';
import * as ur from './modules/uiState';
import Tournament from './containers/Tournament'
import Hutils from './utils/hutils'
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { Map, List, fromJS }  from 'immutable';
import { tdispatch, getTournamentState, getPairedTournament, getPlayedMatches }  from './testUtils';

const identityFn = (a) => a;

it('renders without crashing', () => {
  const div = document.createElement('div');
  const fullStore = createStore(
    combineReducers({
      tournamentReducer: reducer,
      uiReducer: uiReducer,
    })
  );
  ReactDOM.render(
    <Provider store={fullStore}>
      <Tournament/>
    </Provider>
  , div);
});

const mockStore = configureMockStore();
it('dispatches add players', () => {
  const name = 'new user';
  let state = newInitialState();
  const store = mockStore(state);
  store.dispatch(r.addPlayers(['bob']));
  let action = store.getActions()[0];
  expect(action).toEqual({
    type: r.actions.ADD_PLAYERS,
    names: ['bob']
  });
});

function createTournament(state, store, name) {
  store.dispatch(r.createTournament({ name }));
  const action = store.getActions()[store.getActions().length - 1];
  return reducer(state, action);
}

it('creates tournament', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  expect(state.getIn(['tournaments', '1'])).toEqual('t1');
});

function addPlayers(state, store, names) {
  store.dispatch(r.addPlayers(names));
  const action = store.getActions()[store.getActions().length - 1];
  return reducer(state, action);
}

it('adds players', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  state = addPlayers(state, store, ['bob']);
  expect(state.getIn(['players', '2'])).toEqual(fromJS({
    name: 'bob',
    draws: 0,
    wins: 0,
    losses: 0,
    id: '2',
    dropped: false,
    playedIds: {},
    matchIds: [],
    tournamentId: '1',
  }));
});

function pairPlayers(state, store, playerIds) {
  const pairs = Hutils.pairPlayers(state.get('players').toJS(), state.getIn(['settings', '1']).toJS(), identityFn);
  store.dispatch(r.pairPlayers(pairs));
  const action = store.getActions()[store.getActions().length - 1];
  return reducer(state, action);
}

it('pairs players', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  state = addPlayers(state, store, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  state = pairPlayers(state, store, state.get('players').keySeq());
  expect(state.getIn(['rounds', '1']).toJS()).toEqual({
    id: '1',
    matches: ['1','2','3','4'],
    number: 1,
    active: true,
    tournamentId: '1',
  });
  const matchPairs = state.get('matches').valueSeq().map(m => [m.get('p1'), m.get('p2')])
  expect(matchPairs.toJS()).toEqual([
    ['9', '2'], ['8', '3'], ['7', '4'], ['6', '5'],
  ]);
});

it('pairs bye', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  state = addPlayers(state, store, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  state = pairPlayers(state, store, state.get('players').keySeq());
  const byeId = state.getIn(['settings', '1', 'byePlayerId']);
  const byeMatch = state.get('matches').valueSeq().find(m => m.get('p2') === byeId);
  const otherMatch = state.get('matches').valueSeq().find(m => m.get('p2') !== byeId);
  expect(byeMatch.get('score')).toEqual('2 - 0');
  expect(byeMatch.get('active')).toEqual(false);
  expect(otherMatch.get('score')).toEqual('0 - 0');
  expect(otherMatch.get('active')).toEqual(true);
});

function saveSettings(state, store, settings) {
  store.dispatch(r.saveSettings(settings));
  const action = store.getActions()[store.getActions().length - 1];
  return reducer(state, action);
}

it('updates settings', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = createTournament(state, store, 't1');
  expect(state.getIn(['tournaments', '1'])).toEqual('t1');
  state = saveSettings(state, store, { tournamentName: 't2' });
  expect(state.getIn(['tournaments', '1'])).toEqual('t2');
});

it('updates matches', () => {
  let state = getPairedTournament(4);
  const store = mockStore(state);
  const matchId = '1';
  const oldMatch = state.getIn(['matches', matchId]);
  expect(oldMatch.get('winner')).toEqual(undefined);
  expect(oldMatch.get('score')).toEqual('0 - 0');
  const update = {
    id: matchId,
    winner: '2',
    score: '2 - 0',
  };
  state = tdispatch(state, store, r.updateMatch(update));
  const updatedMatch = state.getIn(['matches', matchId]);
  expect(updatedMatch.get('winner')).toEqual('2');
  expect(updatedMatch.get('score')).toEqual('2 - 0');
});

it('finishes round', () => {
  let state = getPlayedMatches(4);
  const store = mockStore(state);
  state = tdispatch(state, store, r.finishRound());
  const matches = state.get('matches');
  const players = state.get('players');
  const rounds = state.get('rounds');
  const allMatchesFinished = matches.every(m => !m.get('active'));
  expect(allMatchesFinished).toEqual(true);

  const playersUpdated = matches.forEach(m => {
    const p1 = m.get('p1');
    const p2 = m.get('p2');
    const winner = m.get('winner');
    const loser = winner === p1 ? p2 : p1;

    //There was a winner
    if (winner === p1 || winner === p2) {
      const winnerWins = players.getIn([winner, 'wins']);
      const winnerLosses = players.getIn([winner, 'losses']);
      expect(winnerWins).toEqual(1);
      expect(winnerLosses).toEqual(0);
      const loserLosses = players.getIn([loser, 'losses']);
      const loserWins = players.getIn([loser, 'wins']);
      expect(loserLosses).toEqual(1);
      expect(loserWins).toEqual(0);
    } else { //There was a draw
      expect(players.getIn([p1, 'draws'])).toEqual(1);
      expect(players.getIn([p2, 'draws'])).toEqual(1);
    }

    const notPlayP1 = !players.getIn([p1, 'playing']);
    const notPlayP2 = !players.getIn([p2, 'playing']);
    expect(notPlayP1 && notPlayP2).toEqual(true);

    const didPlayP1 = players.getIn([p1, 'playedIds', p2]);
    const didPlayP2 = players.getIn([p2, 'playedIds', p1]);
    expect(didPlayP1 && didPlayP2).toEqual(true);
  });

  expect(rounds.every(r => !r.get('active'))).toEqual(true);
});

it('deletes tournaments', () => {
  let state = getPlayedMatches(5);
  const store = mockStore(state);
  state = tdispatch(state, store, r.deleteTournament());
  expect(state.get('tournaments').count()).toEqual(0);
  expect(state.get('settings').count()).toEqual(0);
  expect(state.get('players').count()).toEqual(0);
  expect(state.get('matches').count()).toEqual(0);
  expect(state.get('rounds').count()).toEqual(0);
  expect(state.get('currentTournament')).toEqual(undefined);
});

it('switches tournaments', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = tdispatch(state, store, r.createTournament({ name: 't1'}));
  state = tdispatch(state, store, r.createTournament({ name: 't2'}));
  state = tdispatch(state, store, r.switchTournament('2'));
  expect(state.get('currentTournament')).toEqual('2');
});

it('renames players', () => {
  let state = getPlayedMatches(5);
  const store = mockStore(state);
  state = tdispatch(state, store, r.updatePlayer({ id: '1', name: 'Matt' }));
  expect(state.getIn(['players', '1', 'name'])).toEqual('Matt');
});

