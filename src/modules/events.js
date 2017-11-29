//Tournament State Actions
const ADD_PLAYERS = 'hera/tournament/ADD_PLAYERS';
const PAIR_PLAYERS = 'hera/tournament/PAIR_PLAYERS';
const SAVE_SETTINGS = 'hera/tournament/SAVE_SETTINGS';
const UPDATE_PLAYER = 'hera/tournament/UPDATE_PLAYER';
const UPDATE_MATCH = 'hera/tournament/UPDATE_MATCH';
const CREATE_TOURNAMENT = 'hera/tournament/CREATE_TOURNAMENT';
const CLEAR_TOURNAMENT = 'hera/tournament/CLEAR_TOURNAMENT';
const SWITCH_TOURNAMENT = 'hera/tournament/SWITCH_TOURNAMENT';
const DELETE_TOURNAMENT = 'hera/tournament/DELETE_TOURNAMENT';
const FINISH_ROUND = 'hera/tournament/FINISH_ROUND';

//UI State Actions
const TOGGLE_DROPPED_FILTER = 'hera/uistate/TOGGLE_DROPPED_FILTER';
const TOGGLE_SORT_TYPE = 'hera/uistate/TOGGLE_SORT_TYPE';
const UPDATE_SEARCH = 'hera/uistate/UPDATE_SEARCH';
const SWITCH_VIEW = 'hera/uistate/SWITCH_VIEW';
const TOGGLE_SIDEBAR = 'hera/uistate/TOGGLE_SIDEBAR';

const TOGGLE_PAIR_EDITING = 'hera/pairingform/TOGGLE_PAIR_EDITING';
const LOCK_PAIRS = 'hera/pairingform/LOCK_PAIRS';
const REPAIR_PLAYERS = 'hera/pairingform/REPAIR_PLAYERS';
const RESET_PAIRS_FORM = 'hera/pairingform/RESET_PAIRS_FORM';
const SWAP_PAIR_PLAYERS = 'hera/pairingform/SWAP_PAIR_PLAYERS';

const pairingFormActions = {
  TOGGLE_PAIR_EDITING,
  LOCK_PAIRS,
  REPAIR_PLAYERS,
  RESET_PAIRS_FORM,
  SWAP_PAIR_PLAYERS,
};

const uiStateActions = {
  TOGGLE_DROPPED_FILTER,
  UPDATE_SEARCH,
  SWITCH_VIEW,
  TOGGLE_SIDEBAR,
  TOGGLE_SORT_TYPE,
};

const tournamentActions = {
  ADD_PLAYERS,
  PAIR_PLAYERS,
  SAVE_SETTINGS,
  UPDATE_PLAYER,
  UPDATE_MATCH,
  CREATE_TOURNAMENT,
  DELETE_TOURNAMENT,
  SWITCH_TOURNAMENT,
  CLEAR_TOURNAMENT,
  TOGGLE_DROPPED_FILTER,
  FINISH_ROUND,
  UPDATE_SEARCH,
  SWITCH_VIEW,
};

export const actions = {
  ...pairingFormActions,
  ...uiStateActions,
  ...tournamentActions,
};

export default actions;

export function addPlayers(names) {
  return { type: ADD_PLAYERS, names };
}

export function pairPlayers(pairs) {
  return { type: PAIR_PLAYERS, pairs };
}

export function saveSettings(settings) {
  return { type: SAVE_SETTINGS, settings };
}

export function updatePlayer(player) {
  return { type: UPDATE_PLAYER, player };
}

export function updateMatch(match) {
  return { type: UPDATE_MATCH, match };
}

export function createTournament(tournament) {
  return { type: CREATE_TOURNAMENT, tournament };
}

export function switchTournament(tournament) {
  return { type: SWITCH_TOURNAMENT, tournament };
}

export function clearTournament() {
  return { type: CLEAR_TOURNAMENT };
}

export function deleteTournament() {
  return { type: DELETE_TOURNAMENT };
}

export function toggleDroppedFilter() {
  return { type: TOGGLE_DROPPED_FILTER };
}

export function toggleSortType() {
  return { type: TOGGLE_SORT_TYPE };
}

export function finishRound() {
  return { type: FINISH_ROUND };
}

export function switchView(playerView) {
  return { type: SWITCH_VIEW, playerView };
}

export function updateSearch(searchText) {
  return { type: UPDATE_SEARCH, searchText };
}

export function toggleSidebar() {
  return { type: TOGGLE_SIDEBAR };
}

export function togglePairEditing() {
  return { type: TOGGLE_PAIR_EDITING };
}

export function lockPairs(tableId, locked) {
  return { type: LOCK_PAIRS, tableId, locked };
}

export function resetPairsForm() {
  return { type: RESET_PAIRS_FORM };
}

export function rePairPlayers(shuffleFn) {
  return {
    type: REPAIR_PLAYERS,
    shuffleFn,
  };
}

export function swapPairPlayers(p1, p2) {
  return { type: SWAP_PAIR_PLAYERS, p1, p2 };
}

export function dumbDispatch(e, events) {
  return dispatch =>
    events.reduce((disp, ev) => {
      disp[ev] = (...args) => dispatch(e[ev](...args));
      return disp;
    }, {});
}
