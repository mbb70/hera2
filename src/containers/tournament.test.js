import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import '../setupTests';
import rootReducer from '../modules/rootReducer';
import Tournament from './tournament';
import FaqForm from '../components/FaqForm';
import AddPlayerForm from '../components/AddPlayerForm';
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

it('renders faqForm', () => {
  const component = <FaqForm onExit={() => {}} />;
  renderIntoDiv(component);
  const btns = document.getElementsByTagName('button');
  btns[0].click();
});

it('renders add player form', () => {
  const testFn = jest.fn();
  const component = <AddPlayerForm addPlayers={testFn} />;
  renderIntoDiv(component);
  const btns = document.getElementsByClassName('add-player-card');
  btns[0].click();
  const form = document.getElementsByClassName('form-control')[0];
  ReactTestUtils.Simulate.change(form, {
    target: { value: 'Matt', dataset: { key: 0 }, }
  });
  ReactTestUtils.Simulate.change(form, {
    target: { value: 'Test', dataset: { key: 1 }, }
  });
  ReactTestUtils.Simulate.change(form, {
    target: { value: '', dataset: { key: 1 }, }
  });
  const submitButton = document.getElementsByClassName('btn-primary')[0];
  submitButton.click();
  const returnValue = testFn.mock.calls[0][0];
  expect(returnValue).toEqual(['Matt']);
});


it('renders index', () => {
  require('../index.js');
});
