import configureMockStore from 'redux-mock-store';
import '../setupTests';
import * as r from './events';
import { newInitialState } from './rootReducer';
import { dispatch } from '../testUtils';

const mockStore = configureMockStore();

it('toggles side bar', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.ui.get('sidebarOpen')).toBeFalsy();
  state = dispatch(state, store, r.openSidebar());
  expect(state.ui.get('sidebarOpen')).toBeTruthy();
  state = dispatch(state, store, r.closeSidebar());
  expect(state.ui.get('sidebarOpen')).toBeFalsy();
});

it('switches view', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.ui.get('playerView')).toBeTruthy();
  state = dispatch(state, store, r.switchView(false));
  expect(state.ui.get('playerView')).toBeFalsy();
  state = dispatch(state, store, r.switchView(true));
  expect(state.ui.get('playerView')).toBeTruthy();
});

it('filters users', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.ui.get('searchText')).toBe('');
  state = dispatch(state, store, r.updateSearch('A'));
  expect(state.ui.get('searchText')).toBe('A');
});
