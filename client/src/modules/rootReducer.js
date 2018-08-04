import tournament, { newInitialState as newTState } from './Tournament';
import ui, { newInitialState as newUiState } from './uiState';
import pairingForm, { newInitialState as newPFormState } from './pairingForm';

export function newInitialState() {
  return {
    tournament: newTState(),
    ui: newUiState(),
    pairingForm: newPFormState(),
    version: 3,
  };
}

const reducers = [
  { name: 'tournament', sliceReducer: tournament },
  { name: 'ui', sliceReducer: ui },
  { name: 'pairingForm', sliceReducer: pairingForm },
];
export default function reducer(oldState = newInitialState(), action) {
  const newState = {};
  reducers.forEach(({ name, sliceReducer }) => {
    const localState = oldState[name];
    const newLocalState = sliceReducer(localState, action, oldState);
    newState[name] = newLocalState;
  });
  return newState;
}
