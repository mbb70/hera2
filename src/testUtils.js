import configureMockStore from 'redux-mock-store';
import { Map, List, fromJS } from 'immutable';
import tReducer, { newInitialState } from './modules/Tournament';
import uReducer from './modules/uiState';
import pReducer from './modules/pairingForm';
import * as r from './modules/events';

function getLastAction(store) {
  const actions = store.getActions();
  return actions[actions.length - 1];
}

export function udispatch(state, store, action) {
  store.dispatch(action);
  return uReducer(state, getLastAction(store));
}

export function tdispatch(state, store, action) {
  store.dispatch(action);
  return tReducer(state, getLastAction(store));
}

export function pdispatch(state, store, action) {
  store.dispatch(action);
  return pReducer(state, getLastAction(store));
}

const mockStore = configureMockStore();
export function getTournamentState(nPlayers) {
  let state = newInitialState();
  const store = mockStore(state);
  state = tdispatch(state, store, r.createTournament({ name: 't1' }));
  const names = [];
  for (let n = 0; n < nPlayers; n += 1) {
    names.push(`p${n + 1}`);
  }
  state = tdispatch(state, store, r.addPlayers(names));
  return state;
}

export function getPairedTournament(nPlayers) {
  let state = getTournamentState(nPlayers);
  const store = mockStore(state);
  const playerIds = state.get('players').keySeq();
  const byePlayerId = state.getIn(['settings', '1', 'byePlayerId']);
  const needsBye = nPlayers % 2 !== 0;
  const pairs = playerIds
    .filter(p => needsBye || p !== byePlayerId)
    .reduce((h, id, i) => {
      if (i % 2 === 0) {
        return h.push(List([id]));
      } else {
        return h.update(h.count() - 1, l => l.push(id));
      }
    }, List([]));
  state = tdispatch(state, store, r.pairPlayers(pairs));
  return state;
}

export function getPlayedMatches(nPlayers) {
  let state = getPairedTournament(nPlayers);
  const store = mockStore(state);
  state.get('matches').forEach((m, i) => {
    const update = {
      id: i,
      winner: i === '1' ? '-1' : m.get('p1'),
      score: i === '1' ? '0 - 0' : '2 - 0',
    };
    state = tdispatch(state, store, r.updateMatch(update));
  });
  return state;
}
