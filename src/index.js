import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-grid.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './modules/rootReducer';
import Tournament from './containers/tournament';
import serviceWorkerRegistration from './registerServiceWorker';

import './index.css';

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
  document.getElementById('root') || document.createElement('div')
);
