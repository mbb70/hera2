import { fromJS } from 'immutable';
import tournament, { newInitialState as newTState } from './Tournament';
import ui, { newInitialState as newUiState } from './uiState';
import pairingForm, { newInitialState as newPFormState } from './pairingForm';

export function newInitialState() {
  return fromJS({
    tournament: newTState(),
    ui: newUiState(),
    pairingForm: newPFormState(),
    version: 3,
  });
}

function migrate(state) {
  let newState = state;
  if (newState.get('version') === 1) {
    newState = newInitialState()
      .set('tournament', newState)
      .set('version', 2);
  }
  if (newState.get('version') === 2) {
    newState = newState
      .updateIn(['tournament', 'matches'], matches =>
        matches.map(m =>
          m.set('winner', m.get('winner') === -1 ? '0' : m.get('winner'))
        )
      )
      .set('version', 3);
  }
  return newState;
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
  const newState = reducers.reduce((globalState, { name, sliceReducer }) => {
    const localState = globalState.get(name);
    const newLocalState = sliceReducer(localState, action, globalState);
    return globalState.set(name, newLocalState);
  }, oldState);
  saveState(newState);
  return newState;
}
