import Hutils from '../utils/hutils';
import DriveUtils from '../utils/driveUtils';
import _ from 'lodash';

const ADD_PLAYERS = 'hera/tournament/ADD_PLAYERS';
const PAIR_PLAYERS = 'hera/tournament/PAIR_PLAYERS';
const SAVE_SETTINGS = 'hera/tournament/SAVE_SETTINGS';
const UPDATE_PLAYER = 'hera/tournament/UPDATE_PLAYER';
const UPDATE_MATCH = 'hera/tournament/UPDATE_MATCH';
const CLEAR_LOCAL_STORAGE = 'hera/tournament/CLEAR_LOCAL_STORAGE';
const LOAD_STATE_FROM_STORAGE = 'hera/tournament/LOAD_STATE_FROM_STORAGE';
const CREATE_TOURNAMENT = 'hera/tournament/CREATE_TOURNAMENT';
const TOGGLE_DROPPED_FILTER = 'hera/tournament/TOGGLE_DROPPED_FILTER';

export const actions = {
  ADD_PLAYERS, PAIR_PLAYERS, SAVE_SETTINGS,
  UPDATE_PLAYER, UPDATE_MATCH, CLEAR_LOCAL_STORAGE,
  CREATE_TOURNAMENT, LOAD_STATE_FROM_STORAGE,
  TOGGLE_DROPPED_FILTER
};

function newInitialState() {
  return {
    players: Hutils.generatePlayers(),
    settings: Hutils.defaultSettings(),
    matches: {},
    uiState: {
      hideDropped: false,
    },
  }
};

function getInitialState() {
  return JSON.parse(window.localStorage.getItem('state/state')) || newInitialState();
}

function saveState(state, firstTime) {
  window.localStorage.setItem('state/state', JSON.stringify(state));
  if (state.settings.driveSync) {
    DriveUtils.saveState(state, firstTime);
  }
  return state;
}

const initialState = getInitialState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_TOURNAMENT: {
      const t = action.tournament;
      const newState = {...state};
      const newSettings = {...newState.settings};
      newSettings.tournamentName = t.name;
      newSettings.driveSync = t.driveSync;
      newSettings.newTournament = false;
      newSettings.syncId = t.syncId;
      newState.settings = newSettings;
      return saveState(newState, true);
    }
    case LOAD_STATE_FROM_STORAGE: {
      const syncId = action.syncId;
      return window.localStorage.getItem('state/' + syncId);
    }
    case CLEAR_LOCAL_STORAGE: {
      window.localStorage.removeItem('state/state');
      return saveState(newInitialState());
    }
    case ADD_PLAYERS: {
      const players = {...state.players};
      _.each(action.names, (name) => {
        const id = _.size(players);
        players[id] = {
          name: name,
          losses: 0,
          wins: 0,
          draws: 0,
          id: id.toString(),
          playedIds: {},
          matchIds: [],
          dropped: false,
        }
      });
      return saveState({...state, players });
    }
    case PAIR_PLAYERS: {
      const pairs = Hutils.pairPlayers(action.players, state.players, state.settings);
      const matches = {...state.matches};
      const players = {};
      _.each(state.players, (p) => {
        if (p.playing !== undefined) {
          const unfinishedMatchId = p.matchIds.pop();
          delete matches[unfinishedMatchId];
        }
      });
      _.each(pairs, ([p1, p2]) => {
        const matchId = _.size(matches).toString();
        if (players[p1] !== undefined || players[p2] !== undefined) {
          return;
        }

        const p1Copy = { ...state.players[p1] };
        const p2Copy = { ...state.players[p2] };
        p1Copy.playing = p2;
        p2Copy.playing = p1;
        players[p1] = p1Copy;
        players[p2] = p2Copy;
        p1Copy.matchIds.push(matchId);
        p2Copy.matchIds.push(matchId);
        matches[matchId] = {
          p1: p1Copy.id,
          p2: p2Copy.id,
          round: 0,
          games: [-1],
          active: true,
          current: true,
          id: matchId,
        };
      });
      _.each(state.players, (p) => {
        if (players[p.id] === undefined) {
          const pCopy = { ...p };
          players[pCopy.id] = pCopy;
        }
      });
      return saveState({ ...state, players, matches });
    }
    case SAVE_SETTINGS: {
      return saveState({ ...state, settings: action.settings });
    }
    case UPDATE_PLAYER: {
      const players = {};
      _.each(state.players, (p, id) => {
        if (id === action.player.id) {
          const newPlayer = {...p, ...action.player };
          if (!newPlayer.deleted || newPlayer.matchIds.length > 0) {
            players[id] = newPlayer;
          }
        } else {
          players[id] = p;
        }
      });
      return saveState({ ...state, players });
    }
    case UPDATE_MATCH: {
      const matches = {};
      const players = _.cloneDeep(state.players);
      _.each(state.matches, (match, matchId) => {
        if (matchId === action.match.id) {
          if (!action.match.active) {
            const winner = action.match.winner;
            const p1 = players[match.p1];
            const p2 = players[match.p2];
            if (winner === p1.id) {
              p1.wins += 1;
              p2.losses += 1;
            } else if (winner === p2.id) {
              p1.losses += 1;
              p2.wins += 1;
            } else {
              p1.draws += 1;
              p2.draws += 1;
            }
            p1.playedIds[p2.id] = matchId;
            p2.playedIds[p1.id] = matchId;
            p1.playing = undefined;
            p2.playing = undefined;
          }
          matches[matchId] = { ...action.match };
        } else {
          matches[matchId] = { ...match };
        }
      });
      return saveState({ ...state, players, matches });
    }
    case TOGGLE_DROPPED_FILTER: {
      return saveState({
        ...state,
        uiState: {
          ...state.uiState,
          hideDropped: action.hideDropped
        }
      });
    }
    default:
      return state;
  }
}

export function addPlayers(names) {
  return { type: ADD_PLAYERS, names };
}

export function pairPlayers(players) {
  return { type: PAIR_PLAYERS, players };
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

export function clearLocalStorage() {
  return { type: CLEAR_LOCAL_STORAGE };
}

export function createTournament(tournament) {
  return { type: CREATE_TOURNAMENT, tournament };
}

export function loadStateFromStorage(syncId) {
  return { type: LOAD_STATE_FROM_STORAGE, syncId };
}

export function toggleDroppedFilter(hideDropped) {
  return { type: TOGGLE_DROPPED_FILTER, hideDropped };
}
