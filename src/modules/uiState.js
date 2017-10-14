import { fromJS } from 'immutable';
import * as e from './events';

const a = e.actions;

export function newInitialState() {
  return fromJS({
      searchText: '',
      playerView: true,
      hideDropped: false,
      sidebarOpen: false,
      sortByScore: false,
  });
};

const initialState = newInitialState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case a.CREATE_TOURNAMENT: {
      return state.set('playerView', true);
    }
    case a.PAIR_PLAYERS: {
      return state.set('playerView', true);
    }
    case a.FINISH_ROUND: {
      return state.set('playerView', true);
    }
    case a.TOGGLE_DROPPED_FILTER: {
      return state.set('hideDropped', action.hideDropped);
    }
    case a.TOGGLE_SORT_TYPE: {
      return state.set('sortByScore', action.sortByScore);
    }
    case a.UPDATE_SEARCH: {
      return state.set('searchText', action.searchText);
    }
    case a.SWITCH_VIEW: {
      return state.set('playerView', action.playerView);
    }
    case a.TOGGLE_SIDEBAR: {
      return state.set('sidebarOpen', action.sidebarOpen);
    }
    default:
      return state;
  }
}

