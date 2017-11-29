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
}

export default function reducer(globalState, action) {
  const state = globalState.get('ui');
  switch (action.type) {
    case a.CREATE_TOURNAMENT: {
      return state.set('playerView', true);
    }
    case a.PAIR_PLAYERS: {
      return state.set('playerView', false).set('sidebarOpen', false);
    }
    case a.FINISH_ROUND: {
      return state.set('playerView', true).set('sidebarOpen', false);
    }
    case a.TOGGLE_DROPPED_FILTER: {
      return state
        .set('hideDropped', !state.get('hideDropped'))
        .set('sidebarOpen', false);
    }
    case a.TOGGLE_SORT_TYPE: {
      return state
        .set('sortByScore', !state.get('sortByScore'))
        .set('sidebarOpen', false);
    }
    case a.UPDATE_SEARCH: {
      return state.set('searchText', action.searchText);
    }
    case a.SWITCH_VIEW: {
      return state.set('playerView', action.playerView);
    }
    case a.TOGGLE_SIDEBAR: {
      return state.set('sidebarOpen', !state.get('sidebarOpen'));
    }
    case a.SAVE_SETTINGS: {
      return state.set('sidebarOpen', false);
    }
    case a.DELETE_TOURNAMENT: {
      return state.set('sidebarOpen', false);
    }
    case a.SWITCH_TOURNAMENT: {
      return state.set('sidebarOpen', false);
    }
    default:
      return state;
  }
}
