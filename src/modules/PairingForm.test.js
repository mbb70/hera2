import configureMockStore from 'redux-mock-store';
import '../setupTests';
import * as r from './events';
import { newInitialState } from './pairingForm';
import { pdispatch, getTournamentState } from '../testUtils';

const mockStore = configureMockStore();
const identityFn = a => a;

it('toggle pair editing', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.get('editing')).toBeFalsy();
  state = pdispatch(state, store, r.togglePairEditing());
  expect(state.get('editing')).toBeTruthy();
  state = pdispatch(state, store, r.togglePairEditing());
  expect(state.get('editing')).toBeFalsy();
});

it('locks pairs', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = pdispatch(state, store, r.lockPairs('1', true));
  expect(state.getIn(['lockedTables', '1'])).toBeTruthy();
});

it('pairs players', () => {
  let state = newInitialState();
  const tstate = getTournamentState(4).toJS();
  const settings = tstate.settings['1'];
  const { players } = tstate;
  const store = mockStore(state);
  state = pdispatch(
    state,
    store,
    r.rePairPlayers(players, settings, identityFn)
  );
  expect(state.get('pairs').toJS()).toEqual([['5', '2'], ['4', '3']]);
});

it('locked pairs stick players', () => {
  let state = newInitialState();
  const tstate = getTournamentState(6);
  const settings = tstate.getIn(['settings', '1']).toJS();
  const players = tstate.get('players');
  const store = mockStore(state);

  state = pdispatch(
    state,
    store,
    r.rePairPlayers(players.toJS(), settings, identityFn)
  );
  expect(state.get('pairs').toJS()).toEqual([
    ['7', '2'],
    ['6', '3'],
    ['5', '4'],
  ]);
  state = pdispatch(state, store, r.lockPairs('1', true));
  const filteredPlayers = players.filter(
    (v, pid) => pid !== '6' && pid !== '3'
  );
  const shuffleFn = arr => [].concat(arr).reverse();
  state = pdispatch(
    state,
    store,
    r.rePairPlayers(filteredPlayers.toJS(), settings, shuffleFn)
  );
  expect(state.get('pairs').toJS()).toEqual([
    ['5', '7'],
    ['6', '3'],
    ['2', '4'],
  ]);
});

it('swaps paired players', () => {
  let state = newInitialState();
  const store = mockStore(state);

  const tstate = getTournamentState(6).toJS();
  const settings = tstate.settings['1'];
  const { players } = tstate;

  state = pdispatch(
    state,
    store,
    r.rePairPlayers(players, settings, identityFn)
  );
  expect(state.get('pairs').toJS()).toEqual([
    ['7', '2'],
    ['6', '3'],
    ['5', '4'],
  ]);

  state = pdispatch(state, store, r.swapPairPlayers('7', '3'));
  expect(state.get('pairs').toJS()).toEqual([
    ['3', '2'],
    ['6', '7'],
    ['5', '4'],
  ]);
  state = pdispatch(state, store, r.swapPairPlayers('5', '4'));
  expect(state.get('pairs').toJS()).toEqual([
    ['3', '2'],
    ['6', '7'],
    ['4', '5'],
  ]);
});

it('resets', () => {
  let state = newInitialState();
  const store = mockStore(state);
  const tstate = getTournamentState(6).toJS();
  const settings = tstate.settings['1'];
  const { players } = tstate;
  state = pdispatch(
    state,
    store,
    r.rePairPlayers(players, settings, identityFn)
  );
  state = pdispatch(state, store, r.resetPairsForm());
  expect(state).toEqual(newInitialState());
});

it('does nothing when nothing happens', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = pdispatch(state, store, { type: 'NOTHING' });
  expect(state).toEqual(newInitialState());
});
