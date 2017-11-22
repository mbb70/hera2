import { fromJS } from 'immutable';
import tournament, { newInitialState as newTState } from './Tournament';
import ui, { newInitialState as newUiState } from './uiState';
import pairingForm, { newInitialState as newPFormState } from './pairingForm';

export function newInitialState() {
  return fromJS({
    tournament: newTState(),
    ui: newUiState(),
    pairingForm: newPFormState(),
    version: 2,
  });
}

function migrate(state) {
  if (state.get('version') === 1) {
    return newInitialState().set('tournament', state);
  }
  return state;
}

export function getInitialState() {
  if (
    window.localStorage === undefined ||
    window.localStorage.getItem('state/state') === null
  ) {
    return newInitialState();
  }
  return migrate(
    fromJS(JSON.parse(window.localStorage.getItem('state/state')))
  );
}

export function saveState(state) {
  if (window.localStorage !== undefined) {
    setTimeout(() => {
      window.localStorage.setItem('state/state', JSON.stringify(state));
    });
  }
}

const reducers = [
  { name: 'tournament', sliceReducer: tournament },
  { name: 'ui', sliceReducer: ui },
  { name: 'pairingForm', sliceReducer: pairingForm },
];
export default function reducer(oldState = getInitialState(), action) {
  const newState = reducers.reduce((state, { name, sliceReducer }) => {
    const newLocalState = sliceReducer(state, action);
    return state.set(name, newLocalState);
  }, oldState);
  saveState(newState);
  return newState;
}
