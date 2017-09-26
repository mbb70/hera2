import React from 'react';
import ReactDOM from 'react-dom';
import configureMockStore from 'redux-mock-store'
import * as r from './modules/events';
import reducer from './modules/pairingForm';
import { newInitialState } from './modules/pairingForm';
import Hutils from './utils/hutils'
import { createStore, combineReducers } from 'redux';
import { Map, fromJS }  from 'immutable';

let store = createStore(reducer);

const mockStore = configureMockStore();

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

