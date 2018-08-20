import configureMockStore from 'redux-mock-store';
import '../setupTests';
import * as r from './events';
import { newInitialState } from './rootReducer';
import { dispatch, getTournamentState } from '../testUtils';

const mockStore = configureMockStore();
const identityFn = a => a;

it('toggle pair editing', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.pairingForm.get('editing')).toBeFalsy();
  state = dispatch(state, store, r.togglePairEditing());
  expect(state.pairingForm.get('editing')).toBeTruthy();
  state = dispatch(state, store, r.togglePairEditing());
  expect(state.pairingForm.get('editing')).toBeFalsy();
});

it('locks pairs', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = dispatch(state, store, r.lockPairs('1', true));
  expect(state.pairingForm.getIn(['lockedTables', '1'])).toBeTruthy();
});

it('pairs players', () => {
  let state = getTournamentState(4);
  const store = mockStore(state);
  state = dispatch(state, store, r.rePairPlayers(identityFn));
  expect(state.pairingForm.get('pairs').toJS()).toEqual([
    ['5', '2'],
    ['4', '3'],
  ]);
});

it('locked pairs stick players', () => {
  let state = getTournamentState(6);
  const store = mockStore(state);

  state = dispatch(state, store, r.rePairPlayers(identityFn));
  expect(state.pairingForm.get('pairs').toJS()).toEqual([
    ['7', '2'],
    ['6', '3'],
    ['5', '4'],
  ]);
  state = dispatch(state, store, r.lockPairs('1', true));
  const shuffleFn = arr => [].concat(arr).reverse();
  state = dispatch(state, store, r.rePairPlayers(shuffleFn));
  expect(state.pairingForm.get('pairs').toJS()).toEqual([
    ['2', '4'],
    ['6', '3'],
    ['5', '7'],
  ]);
});

it('swaps paired players', () => {
  let state = getTournamentState(6);
  const store = mockStore(state);

  state = dispatch(state, store, r.rePairPlayers(identityFn));
  expect(state.pairingForm.get('pairs').toJS()).toEqual([
    ['7', '2'],
    ['6', '3'],
    ['5', '4'],
  ]);

  state = dispatch(state, store, r.swapPairPlayers('7', '3'));
  expect(state.pairingForm.get('pairs').toJS()).toEqual([
    ['3', '2'],
    ['6', '7'],
    ['5', '4'],
  ]);

  state = dispatch(state, store, r.swapPairPlayers('5', '4'));
  expect(state.pairingForm.get('pairs').toJS()).toEqual([
    ['3', '2'],
    ['6', '7'],
    ['4', '5'],
  ]);
});

it('resets', () => {
  let state = getTournamentState(6);
  const store = mockStore(state);
  state = dispatch(state, store, r.rePairPlayers(identityFn));
  state = dispatch(state, store, r.resetPairsForm());
  expect(state.paringForm).toEqual(newInitialState().paringForm);
});

it('does nothing when nothing happens', () => {
  let state = newInitialState();
  const store = mockStore(state);
  state = dispatch(state, store, { type: 'NOTHING' });
  const cleanState = newInitialState();
  Object.keys(state).forEach(k => {
    expect(state[k]).toEqual(cleanState[k]);
  });
});
