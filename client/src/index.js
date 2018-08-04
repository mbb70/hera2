import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap-grid.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Tournament from './containers/tournament';
import serviceWorkerRegistration from './registerServiceWorker';

serviceWorkerRegistration();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Tournament />
    </PersistGate>
  </Provider>,
  document.getElementById('root') || document.createElement('div')
);
