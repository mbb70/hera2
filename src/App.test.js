import React from 'react';
import ReactDOM from 'react-dom';
import configureMockStore from 'redux-mock-store'
import reducer, { addPlayer, pairPlayers, playRound, actions } from './modules/tournament';
import Tournament from './containers/Tournament'
import Hutils from './utils/hutils'
import { Provider } from 'react-redux';
import { createStore } from 'redux';

let store = createStore(reducer);
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <Tournament/>
    </Provider>
  , div);
});

function initialState() {
  return {
    players: new Map(),
    pairs: [],
  };
}

const mockStore = configureMockStore();
it('dispatches add players', () => {
  const name = 'new user';
  const store = mockStore(initialState());
  store.dispatch(addPlayer('bob'));
  let action = store.getActions()[0];
  expect(action).toEqual({
    type: actions.ADD_PLAYER,
    name: 'bob'
  });
});

it('adds players', () => {
  const store = mockStore(initialState());
  store.dispatch(addPlayer('bob'));
  const action = store.getActions()[0];
  const newState = reducer(initialState(), action);
  expect(newState.players.has(0)).toEqual(true);
  expect(newState.players.get(0)).toEqual({
    name: 'bob',
    score: 0,
    id: 0,
    played: new Set(),
  });
});

it('pairs players', () => {
  const players = Hutils.generatePlayers();
  let state = initialState();
  state.players = players;

  const store = mockStore(state);
  store.dispatch(pairPlayers(players));
  let action = store.getActions()[0];
  state = reducer(state, action);
  expect(state.pairs.map(pr => pr.map(p => p.id))).toEqual([
    [1, 0], [3, 2], [5, 4], [7, 6],
  ]);
});

it('dispatch play round', () => {
  const state = initialState();
  const store = mockStore(state);
  store.dispatch(pairPlayers(state.players));
  reducer(initialState, store.getActions()[0]);
  let winners = [0, 1, 0, 1];
  store.dispatch(playRound(winners));
  let action = store.getActions()[1];
  expect(action).toEqual({
    type: actions.PLAY_ROUND,
    winners: winners
  });
});

it('play round', () => {
  let players = Hutils.generatePlayers();
  let state = initialState();
  state.players = players;

  const store = mockStore(state);
  store.dispatch(pairPlayers(players));
  state = reducer(state, store.getActions()[0]);
  let pairs = state.pairs;
  let winners = [0, 0, 1, 0];

  store.dispatch(playRound(winners));
  state = reducer(state, store.getActions()[1]);
  players = state.players;
  let playerScores = [...players.values()].map(p => p.score);
  expect(state.pairs).toEqual([]);
  expect(playerScores).toEqual([1, -1, 1, -1, -1, 1, 1, -1]);
});
