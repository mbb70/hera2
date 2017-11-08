import blossom from 'edmonds-blossom';
import { Map, List, Seq, fromJS } from 'immutable';

function shuffle(arr) {
  const sarr = [];
  for (let i = 0, l = arr.length; i < l; i += 1) {
    sarr.push(arr[i]);
  }
  for (let i = 0, l = sarr.length; i < l; i += 1) {
    const dest = Math.floor(l * Math.random());
    const tmp = sarr[i];
    sarr[i] = sarr[dest];
    sarr[dest] = tmp;
  }
  return sarr;
}

function defaultSettings() {
  return {
    newTournament: true,
    tournamentName: 'My Tournament',
    winPoints: 3,
    lossPoints: 0,
    drawPoints: 1,
  };
}

function generatePlayer(details) {
  return Map({
    losses: 0,
    wins: 0,
    draws: 0,
    playedIds: Map(),
    matchIds: List(),
    dropped: false,
    ...details,
  });
}

function getScoreImm(p, settings) {
  if (settings === undefined) return undefined;
  const wins = settings.get('winPoints') * p.get('wins');
  const losses = settings.get('lossPoints') * p.get('losses');
  const draws = settings.get('drawPoints') * p.get('draws');
  return wins - losses + draws;
}

function getScore(p, settings) {
  if (settings === undefined) return undefined;
  const wins = settings.winPoints * p.wins;
  const losses = settings.lossPoints * p.losses;
  const draws = settings.drawPoints * p.draws;
  return wins - losses + draws;
}

function calculateWeight(p, op, settings) {
  const ps = getScore(p, settings);
  const ops = getScore(op, settings);
  return 10000 - Math.abs(ps - ops);
}

function generatePlayerGraph(playerIds, players, settings) {
  return playerIds.flatMap(id => {
    const player = players[id];
    return playerIds
      .filter(oId => id !== oId && !player.playedIds[oId])
      .map(otherId => {
        const otherPlayer = players[otherId];
        const weight = calculateWeight(player, otherPlayer, settings);
        return [+id, +otherId, weight];
      });
  });
}

function pairPlayers(players, settings, shuffleFn) {
  const playerIds = Seq(shuffleFn(Object.keys(players)));
  const graph = generatePlayerGraph(playerIds, players, settings);
  const pairing = blossom(graph.toJS());
  const pairs = pairing
    .map((pId, opId) => [pId, opId])
    .filter(([pId, opId]) => pId > opId)
    .map(([pId, opId]) => shuffleFn([pId.toString(), opId.toString()]));
  return fromJS(shuffleFn(pairs));
}

export default {
  shuffle,
  defaultSettings,
  generatePlayer,
  pairPlayers,
  getScore,
  getScoreImm,
};
