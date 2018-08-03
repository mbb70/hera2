import { fromJS, Map } from 'immutable';
import Hutils from '../utils/hutils';
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
}

export default function reducer(state, action) {
  switch (action.type) {
    case a.CLEAR_TOURNAMENT: {
      return state.set('currentTournament', undefined);
    }
    case a.SWITCH_TOURNAMENT: {
      return state.set('currentTournament', action.tournament);
    }
    case a.DELETE_TOURNAMENT: {
      const currentTournament = state.get('currentTournament');
      return state.withMutations(newState =>
        newState
          .update('tournaments', t =>
            t.filter((_, id) => id !== currentTournament)
          )
          .update('settings', settings =>
            settings.filter((_, id) => id !== currentTournament)
          )
          .update('players', players =>
            players.filter(o => o.get('tournamentId') !== currentTournament)
          )
          .update('matches', matches =>
            matches.filter(o => o.get('tournamentId') !== currentTournament)
          )
          .update('rounds', matches =>
            matches.filter(o => o.get('tournamentId') !== currentTournament)
          )
          .set('currentTournament', undefined)
      );
    }
    case a.CREATE_TOURNAMENT: {
      const t = action.tournament;
      const maxTournamentId = state.get('maxTournamentId') + 1;
      const maxPlayerId = state.get('maxPlayerId') + 1;
      const tournamentId = maxTournamentId.toString();
      const id = maxPlayerId.toString();
      return state
        .setIn(
          ['players', id],
          Hutils.generatePlayer({
            name: 'Bye',
            bye: true,
            tournamentId,
            id,
          })
        )
        .setIn(['tournaments', tournamentId], t.name)
        .setIn(
          ['settings', tournamentId],
          fromJS({
            tournamentName: t.name,
            byePlayerId: id,
            newTournament: false,
            winPoints: 3,
            drawPoints: 1,
            lossPoints: 0,
          })
        )
        .set('currentTournament', tournamentId)
        .set('maxTournamentId', maxTournamentId)
        .set('maxPlayerId', maxPlayerId);
    }
    case a.ADD_PLAYERS: {
      let maxPlayerId = state.get('maxPlayerId');
      const tournamentId = state.get('currentTournament');

      const newPlayers = Map(
        action.names.map(name => {
          maxPlayerId += 1;
          const id = maxPlayerId.toString();
          return [id, Hutils.generatePlayer({ name, id, tournamentId })];
        })
      );
      return state
        .mergeIn(['players'], newPlayers)
        .set('maxPlayerId', maxPlayerId);
    }
    case a.PAIR_PLAYERS: {
      const pairs = fromJS(action.pairs);
      const opMap = Map(
        pairs.flatMap(p => [[p.get(0), p.get(1)], [p.get(1), p.get(0)]])
      );
      const currentTournament = state.get('currentTournament');
      const settings = state.getIn(['settings', currentTournament]);
      const maxMatchId = state.get('maxMatchId');
      const matches = pairs
        .map(([p1, p2], table) => {
          const matchId = (maxMatchId + table + 1).toString();
          let score = '0 - 0';
          let active = true;
          let winner;
          const byeId = settings.get('byePlayerId');
          if (p1 === byeId || p2 === byeId) {
            active = false;
            score = '2 - 0';
            winner = p1 === byeId ? p2 : p1;
          }
          return Map({
            table: (table + 1).toString(),
            tournamentId: currentTournament,
            id: matchId,
            drop: [],
            winner,
            active,
            score,
            p1,
            p2,
          });
        })
        .toMap()
        .mapKeys((k, v) => v.get('id'));
      const matchLookup = Map(
        matches
          .valueSeq()
          .flatMap(m => [
            [m.get('p1'), m.get('id')],
            [m.get('p2'), m.get('id')],
          ])
      );
      const matchIds = matches.keySeq();
      const maxRoundId = state.get('maxRoundId') + 1;
      const roundId = maxRoundId.toString();
      const nRounds = state
        .get('rounds')
        .filter(r => r.get('tournamentId') === currentTournament)
        .count();
      return state
        .set('maxRoundId', maxRoundId)
        .set('maxMatchId', maxMatchId + matches.size)
        .setIn(
          ['rounds', roundId],
          Map({
            id: roundId,
            matches: matchIds,
            number: nRounds + 1,
            active: true,
            tournamentId: currentTournament,
          })
        )
        .mergeIn(['matches'], matches)
        .update('players', players =>
          players.map(p => {
            const id = p.get('id');
            if (opMap.has(id)) {
              const matchId = matchLookup.get(id);
              const opId = opMap.get(id);
              return p
                .update('matchIds', mIds => mIds.push(matchId))
                .set('playing', opId);
            }
            return p;
          })
        );
    }
    case a.SAVE_SETTINGS: {
      const currentTournament = state.get('currentTournament');
      return state
        .mergeIn(['settings'], fromJS({ [currentTournament]: action.settings }))
        .mergeIn(
          ['tournaments'],
          fromJS({
            [currentTournament]: action.settings.tournamentName,
          })
        );
    }
    case a.UPDATE_PLAYER: {
      return state.mergeIn(
        ['players', action.player.id],
        fromJS(action.player)
      );
    }
    case a.UPDATE_MATCH: {
      return state.mergeIn(['matches', action.match.id], fromJS(action.match));
    }
    case a.FINISH_ROUND: {
      const currentTournament = state.get('currentTournament');
      const roundId = state
        .get('rounds')
        .findKey(
          r => r.get('tournamentId') === currentTournament && r.get('active')
        );
      const matches = state
        .getIn(['rounds', roundId])
        .get('matches')
        .map(mId => state.getIn(['matches', mId]).set('active', false))
        .toMap()
        .mapKeys((k, v) => v.get('id'));

      const newPlayers = state.get('players').withMutations(players => {
        matches.forEach(match => {
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
          match
            .get('drop')
            .forEach(pId => players.setIn([pId, 'dropped'], true));
          players
            .deleteIn([p1, 'playing'])
            .deleteIn([p2, 'playing'])
            .updateIn([p1, 'playedIds'], pIds => pIds.set(p2, true))
            .updateIn([p2, 'playedIds'], pIds => pIds.set(p1, true));
        });
        return players;
      });
      return state
        .update('rounds', rounds => rounds.setIn([roundId, 'active'], false))
        .update('matches', ms => ms.merge(matches))
        .set('players', newPlayers);
    }
    default:
      return state;
  }
}
