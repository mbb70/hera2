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
import { Map, fromJS }  from 'immutable';

let store = createStore(reducer);
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
  const pairs = Hutils.pairPlayers(playerIds, state.get('players').toJS(), state.getIn(['settings', '1']).toJS());
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

