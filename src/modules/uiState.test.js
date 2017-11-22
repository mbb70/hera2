import configureMockStore from 'redux-mock-store';
import '../setupTests';
import * as r from './events';
import { newInitialState } from './rootReducer';
import { dispatch } from '../testUtils';

const mockStore = configureMockStore();

it('toggles side bar', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.getIn(['ui', 'sidebarOpen'])).toBeFalsy();
  state = dispatch(state, store, r.toggleSidebar(true));
  expect(state.getIn(['ui', 'sidebarOpen'])).toBeTruthy();
  state = dispatch(state, store, r.toggleSidebar(false));
  expect(state.getIn(['ui', 'sidebarOpen'])).toBeFalsy();
});

it('switches view', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.getIn(['ui', 'playerView'])).toBeTruthy();
  state = dispatch(state, store, r.switchView(false));
  expect(state.getIn(['ui', 'playerView'])).toBeFalsy();
  state = dispatch(state, store, r.switchView(true));
  expect(state.getIn(['ui', 'playerView'])).toBeTruthy();
});

it('filters users', () => {
  let state = newInitialState();
  const store = mockStore(state);
  expect(state.getIn(['ui', 'searchText'])).toBe('');
  state = dispatch(state, store, r.updateSearch('A'));
  expect(state.getIn(['ui', 'searchText'])).toBe('A');
});
