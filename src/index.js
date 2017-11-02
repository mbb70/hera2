import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import tournamentReducer from './modules/Tournament';
import uiReducer from './modules/uiState';
import pairingFormReducer from './modules/pairingForm';
import Tournament from './containers/tournament';
import serviceWorkerRegistration from './registerServiceWorker';

const rootReducer = combineReducers({
  tournamentReducer,
  uiReducer,
  pairingFormReducer,
});

const store =
  process.env.NODE_ENV === 'production'
    ? createStore(rootReducer)
    : createStore(
        rootReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      );

serviceWorkerRegistration();

ReactDOM.render(
  <Provider store={store}>
    <Tournament />
  </Provider>,
  document.getElementById('root')
);
