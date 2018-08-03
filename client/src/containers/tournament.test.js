import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import '../setupTests';
import rootReducer from '../modules/rootReducer';
import Tournament from './tournament';
import * as r from '../modules/events';

function renderIntoDiv(component) {
  document.body.innerHTML = '';
  const div = document.createElement('div');
  ReactDOM.render(component, div);
  document.body.appendChild(div);
  return div;
}

function fullRender(store) {
  const component = (
    <Provider store={store}>
      <Tournament />
    </Provider>
  );
  renderIntoDiv(component);
}

function storeSetup() {
  const store = createStore(rootReducer);
  store.dispatch(r.createTournament({ name: 'test' }));
  store.dispatch(r.addPlayers(['a', 'b', 'c', 'd']));
  return store;
}

it('renders tournament with players', () => {
  const store = storeSetup();
  fullRender(store);
});

it('renders tournament with matches', () => {
  const store = storeSetup();
  store.dispatch(r.pairPlayers([['2', '3'], ['4', '5']]));
  store.dispatch(r.switchView(false));
  fullRender(store);
});

it('renders index', () => {
  require('../index.js');
});
