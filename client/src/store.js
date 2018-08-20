import { createStore } from 'redux';
import { fromJS, isImmutable } from 'immutable';

import { createTransform, createMigrate, persistStore, persistReducer } from 'redux-persist';

import storage from 'redux-persist/lib/storage';
import rootReducer from './modules/rootReducer';

export const migrations = {
  2: state => {
    state.tournament = state.tournament.update('matches', matches =>
      matches.map(m =>
        m.set('winner', m.get('winner') === -1 ? '0' : m.get('winner'))
      )
    );
    return state;
  },
};

const persistConfig = {
  transforms: [
    createTransform(
      (state, key) => isImmutable(state) ? state.toJS() : state,
      (outboundState, key) => fromJS(outboundState),
      {}
    )
  ],
  key: 'root',
  version: 3,
  storage,
  migrate: createMigrate(migrations),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store =
  process.env.NODE_ENV === 'production'
    ? createStore(persistedReducer)
    : createStore(
        persistedReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      );

const persistor = persistStore(store);

export { store, persistor };
