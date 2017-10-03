import Hutils from '../utils/hutils';
import { fromJS, Map } from 'immutable';
import * as e from './events';

const a = e.actions;

export function newInitialState() {
  return fromJS({
    players: {},
    tournaments: {},
    settings: {},
    matches: {},
    rounds: {},
    maxPlayerId: 0,
    maxMatchId: 0,
    maxTournamentId: 0,
    maxRoundId: 0,
    version: 1,
  });
};

function migrate(state) {
  if (state === null) {
  } else if (state.version === 1) {
  }
  return state;
}

function getInitialState() {
  if (window.localStorage === undefined) {
    return newInitialState();
  } else {
    if (window.localStorage.getItem('state/state') === null) {
      return newInitialState();
    } else {
      return migrate(fromJS(JSON.parse(window.localStorage.getItem('state/state'))));
    }
  }
}

function saveState(state, firstTime) {
  if (window.localStorage !== undefined) {
    setTimeout(() => window.localStorage.setItem('state/state', JSON.stringify(state)), 1);
  }
  return state;
}

const initialState = getInitialState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case a.SWITCH_TOURNAMENT: {
      return state.set('currentTournament', action.tournament);
    }
    case a.DELETE_TOURNAMENT: {
      const currentTournament = state.get('currentTournament');
      return saveState(state.withMutations((state) => {
        return state
          .update('tournaments', t => t.filter((o, id) => {
            return id !== currentTournament;
          }))
          .update('settings', settings => settings.filter((o, id) => {
            return id !== currentTournament;
          }))
          .update('players', players => players.filter((o, id) => {
            return o.get('tournamentId') !== currentTournament;
          }))
          .update('matches', matches => matches.filter((o, id) => {
            return o.get('tournamentId') !== currentTournament;
          }))
          .update('rounds', matches => matches.filter((o, id) => {
            return o.get('tournamentId') !== currentTournament;
          }))
          .set('currentTournament', undefined);
      }));
    }
    case a.CREATE_TOURNAMENT: {
      const t = action.tournament;
      const maxTournamentId = state.get('maxTournamentId') + 1;
      const maxPlayerId = state.get('maxPlayerId') + 1;
      const tournamentId = maxTournamentId.toString();
      const id = maxPlayerId.toString();
      return saveState(state
      .setIn(['players', id], Hutils.generatePlayer({
          draws: 5000,
          name: 'Bye',
          bye: true,
          tournamentId,
          id,
      }))
      .setIn(['tournaments', tournamentId], t.name)
      .setIn(['settings', tournamentId], fromJS({
          tournamentName: t.name,
          byePlayerId: id,
          newTournament: false,
          winPoints: 3,
          drawPoints: 1,
          lossPoints: 0,
      }))
      .set('currentTournament', tournamentId)
      .set('maxTournamentId', maxTournamentId)
      .set('maxPlayerId', maxPlayerId), true)
    }
    case a.ADD_PLAYERS: {
      let maxPlayerId = state.get('maxPlayerId');
      const tournamentId = state.get('currentTournament');

      const newPlayers = Map(action.names.map((name) => {
        maxPlayerId += 1;
        const id = maxPlayerId.toString();
        return [
          id,
          Hutils.generatePlayer({ name, id, tournamentId })
        ];
      }));

      return saveState(state
        .mergeIn(['players'], newPlayers)
        .set('maxPlayerId', maxPlayerId)
      );
    }
    case a.PAIR_PLAYERS: {
      const pairs = fromJS(action.pairs);
      const opMap = Map(pairs.flatMap(p => [[p.get(0), p.get(1)], [p.get(1), p.get(0)]]));
      const currentTournament = state.get('currentTournament');
      const settings = state.getIn(['settings', currentTournament]);
      const maxMatchId = state.get('maxMatchId');
      const matches = pairs.map(([p1, p2], table) => {
        const matchId = (maxMatchId + table + 1).toString();
        let score = '0 - 0';
        let active = true;
        let winner = undefined;
        const byeId = settings.get('byePlayerId');
        if (p1 === byeId || p2 === byeId) {
          active = false;
          score = '2 - 0';
          winner = p1 === byeId ? p2 : p1;
        }
        return Map({
          table: (table + 1).toString(),
          tournamentId: currentTournament,
          p1: p1,
          p2: p2,
          id: matchId,
          drop: [],
          winner,
          active,
          score,
        });
      }).toMap().mapKeys((k,v) => v.get('id'));
      const matchLookup = Map(matches.valueSeq().flatMap((m) => [
        [m.get('p1'), m.get('id')],
        [m.get('p2'), m.get('id')],
      ]));
      const matchIds = matches.keySeq();
      const maxRoundId = state.get('maxRoundId') + 1;
      const roundId = maxRoundId.toString();
      return saveState(state
        .set('maxRoundId', maxRoundId)
        .set('maxMatchId', maxMatchId + matches.size)
        .setIn(['rounds', roundId], Map({
          id: roundId,
          matches: matchIds,
          active: true,
          tournamentId: currentTournament,
        }))
        .mergeIn(['matches'], matches)
        .update('players', (players) => {
          return players.map((p) => {
            const id = p.get('id');
            if (opMap.has(id)) {
              const matchId = matchLookup.get(id);
              const opId = opMap.get(id);
              return p
                .update('matchIds', mIds => mIds.push(matchId))
                .set('playing', opId);
            } else {
              return p;
            }
          });
        })
      );
    }
    case a.SAVE_SETTINGS: {
      const currentTournament = state.get('currentTournament');
      const tName = state.getIn(['tournaments', currentTournament]);
      return saveState(state
        .mergeIn(['settings'], fromJS({ [currentTournament]: action.settings }))
        .mergeIn(['tournaments'], fromJS({ [currentTournament]: action.settings.tournamentName || tName }))
      );
    }
    case a.UPDATE_PLAYER: {
      return saveState(state.update('players', (players) => players
        .map((p, pId) => (pId === action.player.id) ? p.merge(fromJS(action.player)) : p)
      ));
    }
    case a.UPDATE_MATCH: {
      return saveState(state.update('matches', (matches) => matches
        .map((m, matchId) => (matchId === action.match.id) ? m.merge(fromJS(action.match)) : m)
      ));
    }
    case a.FINISH_ROUND: {
      const currentTournament = state.get('currentTournament');
      const roundId = state.get('rounds').findKey((r) => (
        r.get('tournamentId') === currentTournament && r.get('active')
      ));
      const matches = state
        .getIn(['rounds', roundId])
        .get('matches')
        .map(mId => state.getIn(['matches', mId]).set('active', false));

      const players = state.get('players').withMutations((players) => {
        matches.forEach((match) => {
          const p1 = match.get('p1');
          const p2 = match.get('p2');
          const winner = match.get('winner');
          const loser = winner === p1 ? p2 : p1;
          const draw = winner !== p1 && winner !== p2;
          if (draw) {
            players
              .updateIn([p1, 'draws'], d => d + 1)
              .updateIn([p2, 'draws'], d => d + 1);
          } else {
            players
              .updateIn([winner, 'wins'], w => w + 1)
              .updateIn([loser, 'losses'], l => l + 1);
          }
          match.get('drop').forEach(pId => players.setIn([pId, 'dropped'], true));
          players
            .deleteIn([p1, 'playing'])
            .deleteIn([p2, 'playing'])
            .updateIn([p1, 'playedIds'], pIds => pIds.set(p2, true))
            .updateIn([p2, 'playedIds'], pIds => pIds.set(p1, true));
        });
        return players;
      });
      const newMatches = matches.toMap().mapKeys((k,v) => v.get('id'));
      return saveState(state
        .update('rounds', (rounds) => rounds.setIn([roundId, 'active'], false))
        .update('matches', (ms) => ms.merge(newMatches))
        .set('players', players)
      );
    }
    default:
      return state;
  }
}

