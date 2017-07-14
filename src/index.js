import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'react-select/dist/react-select.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './modules/Tournament';
import Tournament from './containers/tournament';
import serviceWorkerRegistration from './registerServiceWorker';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

serviceWorkerRegistration();

ReactDOM.render(
  <Provider store={store}>
    <Tournament/>
  </Provider>,
  document.getElementById('root'),
);
