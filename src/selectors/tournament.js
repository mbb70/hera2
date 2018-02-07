import { createSelector } from 'reselect';
import { Map } from 'immutable';
import vu from '../utils/validationUtils';
import Hutils from '../utils/hutils';

const getCurrentTournament = state =>
  state.getIn(['tournament', 'currentTournament']);

const getPlayers = state => state.getIn(['tournament', 'players']);
const getRounds = state => state.getIn(['tournament', 'rounds']);
const getMatches = state => state.getIn(['tournament', 'matches']);
const getSettings = state => {
  console.log(state.toJS());
  return state.getIn(['tournament', 'settings']);
}

const getLockedTables = state => state.getIn(['pairingForm', 'lockedTables']);
const getPairs = state => state.getIn(['pairingForm', 'pairs']);

const getSearchText = state => state.getIn(['ui', 'searchText']);
const getHideDropped = state => state.getIn(['ui', 'hideDropped']);
const getSortByScore = state => state.getIn(['ui', 'sortByScore']);

export const currentLockedPlayerMap = createSelector(
  [getLockedTables, getPairs],
  (lockedTables, pairs) => {
    const players = lockedTables
      .filter(v => v)
      .keySeq()
      .flatMap(tableId => pairs.get(tableId))
      .map(pId => [pId, true]);
    return Map(players);
  }
);

export const currentPlayers = createSelector(
  [getCurrentTournament, getPlayers],
  (tournamentId, players) =>
    players.filter(p => p.get('tournamentId') === tournamentId)
);

export const currentActivePlayers = createSelector([currentPlayers], players =>
  players.filter(p => !p.get('deleted') && !p.get('dropped'))
);

export const currentMatches = createSelector(
  [getCurrentTournament, getMatches],
  (tId, matches) => matches.filter(m => m.get('tournamentId') === tId)
);

export const currentFilteredMatches = createSelector(
  [currentMatches, getSearchText, currentPlayers],
  (matches, searchText, players) => {
    const searchEmpty = !vu.notEmpty(searchText);
    return matches.filter(m => {
      const p1Match = vu.caseInsIncludes(
        players.getIn([m.get('p1'), 'name']),
        searchText
      );
      const p2Match = vu.caseInsIncludes(
        players.getIn([m.get('p2'), 'name']),
        searchText
      );
      return searchEmpty || p1Match || p2Match;
    });
  }
);

export const currentRounds = createSelector(
  [getCurrentTournament, getRounds],
  (currentTournament, rounds) =>
    rounds
      .filter(r => r.get('tournamentId') === currentTournament)
      .valueSeq()
      .sortBy(r => -r.get('id'))
);

export const currentFilteredRounds = createSelector(
  [currentRounds, currentFilteredMatches],
  (rounds, matches) =>
    rounds
      .map(r =>
        r.update('matches', rMatches =>
          rMatches.filter(m => matches.has(m)).sortBy(v => +v)
        )
      )
      .filter(r => r.get('matches').count() > 0)
);

export const currentActiveRound = createSelector([currentRounds], rounds =>
  rounds.find(r => r.get('active'))
);

export const currentSettings = createSelector(
  [getCurrentTournament, getSettings],
  (currentTournament, settings) => settings.get(currentTournament)
);

export const currentActiveUnlockedPlayers = createSelector(
  [currentActivePlayers, currentLockedPlayerMap, currentSettings],
  (players, lockedPlayerMap, settings) => {
    const byePlayerId = settings.get('byePlayerId');
    const needsBye = players.count() % 2 === 0;
    return players
      .filter(
        (p, id) => (needsBye || id !== byePlayerId) && !lockedPlayerMap.get(id)
      )
      .sort((a, b) => a.get('name') > b.get('name'));
  }
);

export const currentFilteredPlayers = createSelector(
  [
    currentPlayers,
    getSearchText,
    getSortByScore,
    currentSettings,
    getHideDropped,
  ],
  (players, searchText, sortByScore, settings, hideDropped) =>
    players
      .filter(p => {
        const searchEmpty = !vu.notEmpty(searchText);
        const searchMatches = vu.caseInsIncludes(p.get('name'), searchText);
        const isBye = p.get('bye');
        const dropped = p.get('dropped');
        const deleted = p.get('deleted');
        return (
          (searchEmpty || searchMatches) &&
          !isBye &&
          !deleted &&
          !(dropped && hideDropped)
        );
      })
      .valueSeq()
      .sortBy(p => {
        if (sortByScore) {
          return -Hutils.getScore(p, settings);
        }
        return p.get('name').toUpperCase();
      })
);
