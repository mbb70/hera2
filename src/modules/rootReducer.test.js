import { saveState, getInitialState, newInitialState } from './rootReducer';

it('gets data from local storage', () => {
  const state = newInitialState();
  window.localStorage.setItem('state/state', JSON.stringify(state));
  const savedState = getInitialState();
  expect(state).toEqual(savedState);
});

it('migrates old state from local storage', () => {
  const tstate = newInitialState().get('tournament');
  const oldState = tstate.set('version', 1);
  window.localStorage.setItem('state/state', JSON.stringify(oldState));
  const savedState = getInitialState();
  expect(newInitialState()).toEqual(savedState);
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
