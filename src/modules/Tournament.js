import Hutils from '../utils/hutils';
import DriveUtils from '../utils/driveUtils';
import _ from 'lodash';

const ADD_PLAYERS = 'hera/tournament/ADD_PLAYERS';
const PAIR_PLAYERS = 'hera/tournament/PAIR_PLAYERS';
const SAVE_SETTINGS = 'hera/tournament/SAVE_SETTINGS';
const UPDATE_PLAYER = 'hera/tournament/UPDATE_PLAYER';
const UPDATE_MATCH = 'hera/tournament/UPDATE_MATCH';
const CREATE_TOURNAMENT = 'hera/tournament/CREATE_TOURNAMENT';
const NEW_TOURNAMENT = 'hera/tournament/NEW_TOURNAMENT';
const SWITCH_TOURNAMENT = 'hera/tournament/SWITCH_TOURNAMENT';
const DELETE_TOURNAMENT = 'hera/tournament/DELETE_TOURNAMENT';
const TOGGLE_DROPPED_FILTER = 'hera/tournament/TOGGLE_DROPPED_FILTER';

export const actions = {
  ADD_PLAYERS, PAIR_PLAYERS, SAVE_SETTINGS,
  UPDATE_PLAYER, UPDATE_MATCH, CREATE_TOURNAMENT,
  DELETE_TOURNAMENT, SWITCH_TOURNAMENT,
  NEW_TOURNAMENT, TOGGLE_DROPPED_FILTER,
};

function newInitialState() {
  return {
    players: {},
    tournaments: {},
    settings: {},
    matches: {},
    uiState: {},
    maxPlayerId: 0,
    maxMatchId: 0,
    maxTournamentId: 0,
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
    case NEW_TOURNAMENT: {
      return { ...state, currentTournament: undefined };
    }
    case SWITCH_TOURNAMENT: {
      return { ...state, currentTournament: action.tournament };
    }
    case DELETE_TOURNAMENT: {
      const tournaments = _.pickBy(state.tournaments, (t, id) => {
        return id !== state.currentTournament;
      });
      const settings = _.pickBy(state.settings, (t, id) => {
        return id !== state.currentTournament;
      });
      const players = _.pickBy(state.players, (p, id) => {
        return p.tournamentId !== state.currentTournament;
      });
      const matches = _.pickBy(state.matches, (m, id) => {
        return m.tournamentId !== state.currentTournament;
      });
      return { ...state, settings, tournaments, players, matches, currentTournament: undefined };
    }
    case CREATE_TOURNAMENT: {
      const t = action.tournament;
      const players = { ...state.players };
      const maxTournamentId = state.maxTournamentId + 1;
      const maxPlayerId = state.maxPlayerId + 1;
      const tournamentId = maxTournamentId.toString();
      const id = maxPlayerId.toString();
      players[id] = Hutils.generatePlayer({
        draws: 5000,
        name: 'Bye',
        bye: true,
        tournamentId,
        id,
      });
      const tournaments = {...state.tournaments, [tournamentId]: t.name };
      const settings = {...state.settings,
        [tournamentId]: {
          tournamentName: t.name,
          driveSync: t.driveSync,
          newTournament: false,
          syncId: t.syncId,
          winPoints: 3,
          drawPoints: 1,
          lossPoints: 0,
        },
      };
      const newState = {...state,
        players,
        settings,
        tournaments,
        maxTournamentId,
        maxPlayerId,
        currentTournament: tournamentId,
      };
      return saveState(newState, true);
    }
    case ADD_PLAYERS: {
      const players = {...state.players};
      let maxPlayerId = state.maxPlayerId;
      _.each(action.names, (name) => {
        maxPlayerId += 1;
        const id = maxPlayerId.toString();
        const tournamentId = state.currentTournament;
        players[id] = Hutils.generatePlayer({ name, id, tournamentId });
      });
      return saveState({...state, players, maxPlayerId });
    }
    case PAIR_PLAYERS: {
      const pairs = Hutils.pairPlayers(action.players, state.players, state.settings[state.currentTournament], state.currentTournament);
      const matches = {...state.matches};
      let maxMatchId = state.maxMatchId;
      const players = {};
      _.each(state.players, (p) => {
        if (p.tournamentId === state.currentTournament && p.playing !== undefined) {
          const unfinishedMatchId = p.matchIds.pop();
          delete matches[unfinishedMatchId];
        }
      });
      _.each(pairs, ([p1, p2]) => {
        if (players[p1] !== undefined || players[p2] !== undefined) {
          return;
        }

        maxMatchId += 1;
        const matchId = maxMatchId.toString();
        const p1Copy = { ...state.players[p1] };
        const p2Copy = { ...state.players[p2] };
        p1Copy.playing = p2;
        p2Copy.playing = p1;
        players[p1] = p1Copy;
        players[p2] = p2Copy;
        p1Copy.matchIds.push(matchId);
        p2Copy.matchIds.push(matchId);
        matches[matchId] = {
          tournamentId: state.currentTournament,
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
      return saveState({ ...state, players, matches, maxMatchId });
    }
    case SAVE_SETTINGS: {
      return saveState({ ...state,
        settings: {...state.settings, [state.currentTournament]: action.settings },
        tournaments: {...state.tournaments,
          [state.currentTournament]: action.settings.tournamentName || state.tournaments[state.currentTournament]
        },
      });
    }
    case UPDATE_PLAYER: {
      const players = {};
      _.each(state.players, (p, id) => {
        if (id === action.player.id) {
          players[id] = {...p, ...action.player};
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
          hideDropped: action.hideDropped,
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

export function newTournament() {
  return { type: NEW_TOURNAMENT };
}

export function createTournament(tournament) {
  return { type: CREATE_TOURNAMENT, tournament };
}

export function switchTournament(tournament) {
  return { type: SWITCH_TOURNAMENT, tournament };
}

export function deleteTournament(tournament) {
  return { type: DELETE_TOURNAMENT, tournament };
}

export function toggleDroppedFilter(hideDropped) {
  return { type: TOGGLE_DROPPED_FILTER, hideDropped };
}
