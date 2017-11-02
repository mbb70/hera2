import vu from '../utils/validationUtils';
import Hutils from '../utils/hutils';
import { createSelector } from 'reselect';
import { Map } from 'immutable';

const getCurrentTournament = state =>
  state.tournamentReducer.get('currentTournament');
const getPlayers = state => state.tournamentReducer.get('players');
const getRounds = state => state.tournamentReducer.get('rounds');
const getMatches = state => state.tournamentReducer.get('matches');
const getSettings = state => state.tournamentReducer.get('settings');

const getLockedTables = state => state.pairingFormReducer.get('lockedTables');
const getPairs = state => state.pairingFormReducer.get('pairs');

const getSearchText = state => state.uiReducer.get('searchText');
const getHideDropped = state => state.uiReducer.get('hideDropped');
const getSortByScore = state => state.uiReducer.get('sortByScore');

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
  (currentTournament, players) => {
    return players.filter(p => p.get('tournamentId') === currentTournament);
  }
);

export const currentActivePlayers = createSelector(
  [currentPlayers],
  currentPlayers => {
    return currentPlayers.filter(p => !p.get('deleted') && !p.get('dropped'));
  }
);

export const currentMatches = createSelector(
  [getCurrentTournament, getMatches],
  (currentTournament, matches) => {
    return matches.filter(m => m.get('tournamentId') === currentTournament);
  }
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
  (currentTournament, rounds) => {
    return rounds
      .filter(r => r.get('tournamentId') === currentTournament)
      .valueSeq()
      .sortBy(r => -r.get('id'));
  }
);

export const currentFilteredRounds = createSelector(
  [currentRounds, currentFilteredMatches],
  (rounds, matches) => {
    return rounds
      .map(r => {
        return r.update('matches', rMatches => {
          return rMatches.filter(m => matches.has(m)).sortBy(v => +v);
        });
      })
      .filter(r => r.get('matches').count() > 0);
  }
);

export const currentActiveRound = createSelector(
  [currentRounds],
  currentRounds => currentRounds.find(r => r.get('active'))
);

export const currentSettings = createSelector(
  [getCurrentTournament, getSettings],
  (currentTournament, settings) => {
    return settings.get(currentTournament);
  }
);

export const currentActiveUnlockedPlayers = createSelector(
  [currentActivePlayers, currentLockedPlayerMap, currentSettings],
  (currentPlayers, lockedPlayerMap, settings) => {
    const byePlayerId = settings.get('byePlayerId');
    const needsBye = currentPlayers.count() % 2 === 0;
    return currentPlayers
      .filter((p, id) => {
        return (needsBye || id !== byePlayerId) && !lockedPlayerMap.get(id);
      })
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
  (players, searchText, sortByScore, settings, hideDropped) => {
    return players
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
          return -Hutils.getScoreImm(p, settings);
        } else {
          return p.get('name').toUpperCase();
        }
      });
  }
);
