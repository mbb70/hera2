import { createSelector } from 'reselect'

const getCurrentTournament = (state) => state.get('currentTournament');
const getPlayers = (state) => state.get('players');
const getRounds = (state) => state.get('rounds');
const getMatches = (state) => state.get('matches');
const getSettings = (state) => state.get('settings');

export const currentPlayers = createSelector(
  [ getCurrentTournament, getPlayers ],
  (currentTournament, players) => {
    return players.filter(p => p.get('tournamentId') === currentTournament);
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
                 .valueSeq().sort(r => -r.get('id'));
  }
);

export const currentSettings = createSelector(
  [ getCurrentTournament, getSettings ],
  (currentTournament, settings) => {
    return settings.get(currentTournament);
  }
);
