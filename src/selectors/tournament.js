import { createSelector } from 'reselect'
import { Map }  from 'immutable';

const getCurrentTournament = (state) => state.tournamentReducer.get('currentTournament');
const getPlayers = (state) => state.tournamentReducer.get('players');
const getRounds = (state) => state.tournamentReducer.get('rounds');
const getMatches = (state) => state.tournamentReducer.get('matches');
const getSettings = (state) => state.tournamentReducer.get('settings');

const getLockedTables = (state) => state.pairingFormReducer.get('lockedTables');
const getPairs = (state) => state.pairingFormReducer.get('pairs');

export const currentLockedPlayerMap = createSelector(
  [ getLockedTables, getPairs ],
  (lockedTables, pairs) => {
    const players = lockedTables
      .filter(v => v).keySeq()
      .flatMap(tableId => pairs.get(tableId))
      .map(pId => [pId, true]);
    return Map(players);
  }
);

export const currentPlayers = createSelector(
  [ getCurrentTournament, getPlayers ],
  (currentTournament, players) => {
    return players.filter(p => p.get('tournamentId') === currentTournament);
  }
);

export const currentActivePlayers = createSelector(
  [ currentPlayers ],
  (currentPlayers) => {
    return currentPlayers.filter(p => !p.get('deleted') && !p.get('dropped'));
  }
);

export const currentMatches = createSelector(
  [ getCurrentTournament, getMatches ],
  (currentTournament, matches) => {
    return matches.filter(m => m.get('tournamentId') === currentTournament);
  }
);

export const currentRounds = createSelector(
  [ getCurrentTournament, getRounds ],
  (currentTournament, rounds) => {
    return rounds.filter(r => r.get('tournamentId') === currentTournament)
                 .valueSeq().sort(r => +r.get('id'));
  }
);

export const currentActiveRound = createSelector(
  [ currentRounds ],
  (currentRounds) => currentRounds.find(r => r.get('active'))
);

export const currentSettings = createSelector(
  [ getCurrentTournament, getSettings ],
  (currentTournament, settings) => {
    return settings.get(currentTournament);
  }
);

export const currentActiveUnlockedPlayers = createSelector(
  [ currentActivePlayers, currentLockedPlayerMap, currentSettings ],
  (currentPlayers, lockedPlayerMap, settings) => {
    const byePlayerId = settings.get('byePlayerId');
    const needsBye = currentPlayers.count() % 2 === 0;
    return currentPlayers.filter((p, id) => {
      return (needsBye || id !== byePlayerId) && !lockedPlayerMap.get(id);
    }).sort((a, b) => a.get('name') > b.get('name'));
  }
);

