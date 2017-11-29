import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import '../../setupTests';
import AppNav from '../../containers/appNav';
import { renderIntoDiv } from './ComponentTestUtils';
import { getPlayedMatches } from '../../testUtils';

const mockStore = configureMockStore();

function renderAndGetLinks(state) {
  const store = mockStore(state);
  const component = (
    <Provider store={store}>
      <AppNav />
    </Provider>
  );
  const div = renderIntoDiv(component);
  const items = Object.values(div.querySelectorAll('span.nav-link'));
  return items.map(a => a.textContent);
}

it('renders app nav', () => {
  const state = getPlayedMatches(4);
  const links = renderAndGetLinks(state);
  expect(links).toEqual([
    'Finish Round',
    'Settings',
    'Switch Tournament',
    'Delete Tournament',
    'Export Data',
    'FAQ',
  ]);
});

it('renders app nav with dropped players and sorting', () => {
  const state = getPlayedMatches(4)
    .setIn(['ui', 'playerView'], true)
    .setIn(['tournament', 'players', '2', 'dropped'], true);
  const links = renderAndGetLinks(state);
  expect(links).toEqual([
    'Finish Round',
    'Settings',
    'Sort By Score',
    'Hide Dropped',
    'Switch Tournament',
    'Delete Tournament',
    'Export Data',
    'FAQ',
  ]);
});

it('renders app nav with dropped players and sorting', () => {
  const state = getPlayedMatches(4)
    .setIn(['ui', 'playerView'], true)
    .setIn(['ui', 'sortByScore'], true)
    .setIn(['ui', 'hideDropped'], true)
    .setIn(['tournament', 'players', '2', 'dropped'], true);
  const links = renderAndGetLinks(state);
  expect(links).toEqual([
    'Finish Round',
    'Settings',
    'Sort Alphabetically',
    'Show Dropped',
    'Switch Tournament',
    'Delete Tournament',
    'Export Data',
    'FAQ',
  ]);
});
