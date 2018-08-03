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

function getScorePojo(p, settings) {
  if (settings === undefined) return undefined;
  const wins = settings.winPoints * p.wins;
  const losses = settings.lossPoints * p.losses;
  const draws = settings.drawPoints * p.draws;
  return wins - losses + draws;
}

function getScore(p, settings) {
  if (settings === undefined) return undefined;
  const wins = settings.get('winPoints') * p.get('wins');
  const losses = settings.get('lossPoints') * p.get('losses');
  const draws = settings.get('drawPoints') * p.get('draws');
  return wins - losses + draws;
}

function calculateWeight(p, op, settings) {
  const ps = getScore(p, settings);
  const ops = getScore(op, settings);
  return 10000 - Math.abs(ps - ops);
}

function generatePlayerGraph(playerIds, players, settings) {
  return playerIds.flatMap(id => {
    const player = players.get(id);
    return playerIds
      .filter(oId => id !== oId && !player.getIn(['playedIds', oId]))
      .map(otherId => {
        const otherPlayer = players.get(otherId);
        const weight = calculateWeight(player, otherPlayer, settings);
        return [+id, +otherId, weight];
      });
  });
}

function scorePairing(pairs, players, settings) {
  return pairs
    .map(([pId, oId]) => {
      const p1 = players.get(pId);
      const p2 = players.get(oId);
      return Math.abs(getScore(p1, settings), getScore(p2, settings));
    })
    .reduce((a, b) => a + b, 0);
}

function constructPairing(players, settings, shuffleFn) {
  const playerIds = Seq(shuffleFn(players.keySeq().toJS()));
  const graph = generatePlayerGraph(playerIds, players, settings);
  const minId = graph
    .map(([a, b]) => Math.min(a, b))
    .reduce((a, b) => Math.min(a, b));
  const formattedGraph = graph.map(([a, b, c]) => [a - minId, b - minId, c]);
  const pairing = blossom(formattedGraph.toJS());
  return pairing
    .map((pId, opId) => [pId + minId, opId + minId])
    .filter(([pId, opId]) => pId > opId)
    .map(([pId, opId]) => shuffleFn([pId.toString(), opId.toString()]));
}

function constructBestPairingWithBye(players, byeUser, settings, shuffleFn) {
  const lowestUnbyedScorers = players
    .filter(p => !p.getIn(['playedIds', byeUser.get('id')]))
    .groupBy(p => getScore(p, settings))
    .min();

  const possiblePairings = lowestUnbyedScorers.map(lowScorer => {
    const lowScorerId = lowScorer.get('id');
    const playersWithoutByer = players.remove(lowScorerId);
    return constructPairing(playersWithoutByer, settings, shuffleFn);
  });

  const result = possiblePairings.reduce(
    (min, pairs, player) => {
      const score = scorePairing(pairs, players, settings);
      return score < min.score ? { score, pairs, player } : min;
    },
    { score: 10000, pairs: {}, player: 0 }
  );

  result.pairs.push(shuffleFn([byeUser.get('id'), result.player]));
  return shuffleFn(result.pairs);
}

function pairPlayers(players, settings, shuffleFn) {
  const byeUser = players.find(p => p.get('bye'));
  let pairing;
  if (byeUser) {
    const playersWithoutBye = players.remove(byeUser.get('id'));
    pairing = constructBestPairingWithBye(
      playersWithoutBye,
      byeUser,
      settings,
      shuffleFn
    );
  } else {
    pairing = constructPairing(players, settings, shuffleFn);
  }
  return fromJS(pairing);
}

export default {
  shuffle,
  generatePlayer,
  pairPlayers,
  getScorePojo,
  getScore,
};
