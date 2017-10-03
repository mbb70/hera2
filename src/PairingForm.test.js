import './setupTests';
import React from 'react';
import ReactDOM from 'react-dom';
import configureMockStore from 'redux-mock-store';
import * as r from './modules/events';
import reducer from './modules/pairingForm';
import tReducer from './modules/Tournament';
import * as tr from './modules/Tournament';
import { newInitialState } from './modules/pairingForm';
import Hutils from './utils/hutils';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Map, fromJS }  from 'immutable';

const mockStore = configureMockStore();
const identityFn = (a) => a;

function togglePairEditing(state, store) {
  store.dispatch(r.togglePairEditing());
  const action = store.getActions()[store.getActions().length - 1];
  return reducer(state, action);
}

it('toggle pair editing', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.get('editing')).toEqual(false);
  state = togglePairEditing(state, store);
  expect(state.get('editing')).toEqual(true);
  state = togglePairEditing(state, store);
  expect(state.get('editing')).toEqual(false);
});

function lockPairs(state, store, tableId, locked) {
  store.dispatch(r.lockPairs(tableId, locked));
  const action = store.getActions()[store.getActions().length - 1];
  return reducer(state, action);
}

it('locks pairs', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = lockPairs(state, store, '1', true);
  expect(state.getIn(['lockedTables', '1'])).toEqual(true);
});

function rePairPlayers(state, store, shufffledIds, activePlayers, settings) {
  store.dispatch(r.rePairPlayers(shufffledIds, activePlayers, settings));
  const action = store.getActions()[store.getActions().length - 1];
  return reducer(state, action);
}

function getLastAction(store) {
  const actions = store.getActions();
  return actions[actions.length - 1];
}

function dispatch(state, store, action) {
  store.dispatch(action);
  return reducer(state, getLastAction(store));
}

function tDispatch(state, store, action) {
  store.dispatch(action);
  return tReducer(state, getLastAction(store));
}

function getTournamentState(nPlayers) {
  let state = tr.newInitialState();
  const store = mockStore(state);
  state = tDispatch(state, store, r.createTournament({ name: 't1'}));
  const names = []
  for (let n = 0; n < nPlayers; n += 1) {
    names.push(`p${n+1}`);
  }
  state = tDispatch(state, store, r.addPlayers(names));
  return state;
}

it('pairs players', () => {
  let state = newInitialState();
  const tstate = getTournamentState(4).toJS();
  const settings = tstate.settings['1'];
  const players = tstate.players;
  const playerIds = Object.keys(players).sort((a,b) => +a - +b);
  const store = mockStore(state);
  state = dispatch(state, store, r.rePairPlayers(players, settings, identityFn));
  expect(state.get('pairs').toJS()).toEqual(
    [['5', '2'], ['4', '3']]
  );
});

function arraySwap(arr, idx1, idx2) {
  const tmp = arr[idx1];
  arr[idx1] = arr[idx2];
  arr[idx2] = tmp;
}

it('locked pairs stick players', () => {
  let state = newInitialState();
  const tstate = getTournamentState(6);
  const settings = tstate.getIn(['settings', '1']).toJS();
  const players = tstate.get('players');
  const store = mockStore(state);

  state = dispatch(state, store, r.rePairPlayers(players.toJS(), settings, identityFn));
  expect(state.get('pairs').toJS()).toEqual(
    [['7', '2'], ['6', '3'], ['5', '4']]
  );
  state = dispatch(state, store, r.lockPairs('1', true));
  const filteredPlayers = players.filter((v, pid) => pid !== '6' && pid !== '3');
  const shuffleFn = (arr) => [].concat(arr).reverse();
  state = dispatch(state, store, r.rePairPlayers(filteredPlayers.toJS(), settings, shuffleFn));
  expect(state.get('pairs').toJS()).toEqual(
    [['5', '7'], ['6', '3'], ['2', '4']]
  );
});

it('swaps paired players', () => {
  let state = newInitialState();
  const store = mockStore(state);

  const tstate = getTournamentState(6).toJS();
  const settings = tstate.settings['1'];
  const players = tstate.players;

  state = dispatch(state, store, r.rePairPlayers(players, settings, identityFn));
  expect(state.get('pairs').toJS()).toEqual(
    [['7', '2'], ['6', '3'], ['5', '4']]
  );

  state = dispatch(state, store, r.swapPairPlayers('7', '3'));
  expect(state.get('pairs').toJS()).toEqual(
    [['3', '2'], ['6', '7'], ['5', '4']]
  );
  state = dispatch(state, store, r.swapPairPlayers('5', '4'));
  expect(state.get('pairs').toJS()).toEqual(
    [['3', '2'], ['6', '7'], ['4', '5']]
  );
});
