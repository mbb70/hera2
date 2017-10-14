import '../setupTests';
import React from 'react';
import ReactDOM from 'react-dom';
import configureMockStore from 'redux-mock-store';
import * as r from './events';
import reducer from './pairingForm';
import tReducer from './Tournament';
import * as tr from './Tournament';
import { newInitialState } from './pairingForm';
import Hutils from '../utils/hutils';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Map, fromJS }  from 'immutable';
import { pdispatch, tdispatch, getTournamentState }  from '../testUtils';

const mockStore = configureMockStore();
const identityFn = (a) => a;

it('toggle pair editing', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.get('editing')).toEqual(false);
  state = pdispatch(state, store, r.togglePairEditing());
  expect(state.get('editing')).toEqual(true);
  state = pdispatch(state, store, r.togglePairEditing());
  expect(state.get('editing')).toEqual(false);
});

it('locks pairs', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = pdispatch(state, store, r.lockPairs('1', true));
  expect(state.getIn(['lockedTables', '1'])).toEqual(true);
});

it('pairs players', () => {
  let state = newInitialState();
  const tstate = getTournamentState(4).toJS();
  const settings = tstate.settings['1'];
  const players = tstate.players;
  const playerIds = Object.keys(players).sort((a,b) => +a - +b);
  const store = mockStore(state);
  state = pdispatch(state, store, r.rePairPlayers(players, settings, identityFn));
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

  state = pdispatch(state, store, r.rePairPlayers(players.toJS(), settings, identityFn));
  expect(state.get('pairs').toJS()).toEqual(
    [['7', '2'], ['6', '3'], ['5', '4']]
  );
  state = pdispatch(state, store, r.lockPairs('1', true));
  const filteredPlayers = players.filter((v, pid) => pid !== '6' && pid !== '3');
  const shuffleFn = (arr) => [].concat(arr).reverse();
  state = pdispatch(state, store, r.rePairPlayers(filteredPlayers.toJS(), settings, shuffleFn));
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

  state = pdispatch(state, store, r.rePairPlayers(players, settings, identityFn));
  expect(state.get('pairs').toJS()).toEqual(
    [['7', '2'], ['6', '3'], ['5', '4']]
  );

  state = pdispatch(state, store, r.swapPairPlayers('7', '3'));
  expect(state.get('pairs').toJS()).toEqual(
    [['3', '2'], ['6', '7'], ['5', '4']]
  );
  state = pdispatch(state, store, r.swapPairPlayers('5', '4'));
  expect(state.get('pairs').toJS()).toEqual(
    [['3', '2'], ['6', '7'], ['4', '5']]
  );
});

it('resets', () => {
  let state = newInitialState();
  const store = mockStore(state);
  const tstate = getTournamentState(6).toJS();
  const settings = tstate.settings['1'];
  const players = tstate.players;
  state = pdispatch(state, store, r.rePairPlayers(players, settings, identityFn));
  state = pdispatch(state, store, r.resetPairsForm());
  expect(state).toEqual(newInitialState());
});

it('does nothing when nothing happens', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = pdispatch(state, store, { type: 'NOTHING' });
  expect(state).toEqual(newInitialState());
});
