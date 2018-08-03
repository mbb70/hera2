import { fromJS } from 'immutable';
import { saveState, getInitialState, newInitialState } from './rootReducer';

it('gets data from local storage', () => {
  const state = newInitialState();
  window.localStorage.setItem('state/state', JSON.stringify(state));
  const savedState = getInitialState();
  expect(state).toEqual(savedState);
});

it('migrates v1', () => {
  const tstate = newInitialState().get('tournament');
  const oldState = tstate.set('version', 1);
  window.localStorage.setItem('state/state', JSON.stringify(oldState));
  const savedState = getInitialState();
  expect(newInitialState()).toEqual(savedState);
});

it('migrates v2', () => {
  const state = newInitialState();
  const oldState = state.set('version', 2).setIn(
    ['tournament', 'matches'],
    fromJS({
      1: {
        winner: -1,
      },
      2: {
        winner: '2',
      },
    })
  );
  window.localStorage.setItem('state/state', JSON.stringify(oldState));
  const savedState = getInitialState();
  const matchDraw = savedState.getIn(['tournament', 'matches', '1', 'winner']);
  expect(matchDraw).toBe('0');
  const matchWinner = savedState.getIn([
    'tournament',
    'matches',
    '2',
    'winner',
  ]);
  expect(matchWinner).toBe('2');
});

it('loads from local storage', () => {
  jest.useFakeTimers();
  const state = newInitialState();
  saveState(state);
  setTimeout.mock.calls[0][0]();
  const savedState = getInitialState();
  expect(state).toEqual(savedState);
});

it("doesn't crash if no local storage", () => {
  window.localStorage = undefined;
  const state = newInitialState();
  saveState(state);
});
