/* eslint-disable */
import configureMockStore from 'redux-mock-store';
import { List } from 'immutable';
import tReducer from './modules/Tournament';
import uReducer from './modules/uiState';
import pReducer from './modules/pairingForm';
import rootReducer, { newInitialState } from './modules/rootReducer';
import * as r from './modules/events';

function getLastAction(store) {
  const actions = store.getActions();
  return actions[actions.length - 1];
}

export function dispatch(state, store, action) {
  store.dispatch(action);
  return rootReducer(state, getLastAction(store));
}

const mockStore = configureMockStore();
export function getTournamentState(nPlayers) {
  let state = newInitialState();
  const store = mockStore(state);
  state = dispatch(state, store, r.createTournament({ name: 't1' }));
  const names = [];
  for (let n = 0; n < nPlayers; n += 1) {
    names.push(`p${n + 1}`);
  }
  state = dispatch(state, store, r.addPlayers(names));
  return state;
}

export function getPairedTournament(nPlayers) {
  let state = getTournamentState(nPlayers);
  const store = mockStore(state);
  const playerIds = state.getIn(['tournament', 'players']).keySeq();
  const byePlayerId = state.getIn([
    'tournament',
    'settings',
    '1',
    'byePlayerId',
  ]);
  const needsBye = nPlayers % 2 !== 0;
  const pairs = playerIds
    .filter(p => needsBye || p !== byePlayerId)
    .reduce((h, id, i) => {
      if (i % 2 === 0) return h.push(List([id]));
      return h.update(h.count() - 1, l => l.push(id));
    }, List([]));
  state = dispatch(state, store, r.pairPlayers(pairs));
  return state;
}

export function getPlayedMatches(nPlayers) {
  let state = getPairedTournament(nPlayers);
  const store = mockStore(state);
  state.getIn(['tournament', 'matches']).forEach((m, i) => {
    const update = {
      id: i,
      winner: i === '1' ? -1 : m.get('p1'),
      score: i === '1' ? '0 - 0' : '2 - 0',
    };
    state = dispatch(state, store, r.updateMatch(update));
  });
  return state;
}
