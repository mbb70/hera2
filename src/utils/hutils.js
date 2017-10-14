import blossom from 'edmonds-blossom';
import { Map, List, Seq, fromJS } from 'immutable';

export function shuffle(arr) {
  const sarr = [];
  for (let i = 0, l = arr.length; i < l; i++) {
    sarr.push(arr[i]);
  }
  for (let i = 0, l = sarr.length; i < l; i++) {
    const dest = Math.floor(l * Math.random());
    const tmp = sarr[i];
    sarr[i] = sarr[dest];
    sarr[dest] = tmp;
  }
  return sarr;
}

export function defaultSettings() {
  return {
    newTournament: true,
    tournamentName: 'My Tournament',
    winPoints: 3,
    lossPoints: 0,
    drawPoints: 1,
  };
}

export function generatePlayer(details) {
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

export function getScoreImm(p, settings) {
  return settings.get('winPoints')  * p.get('wins')   -
         settings.get('lossPoints') * p.get('losses') +
         settings.get('drawPoints') * p.get('draws');
}

export function getScore(p, settings) {
  return settings.winPoints  * p.wins   -
         settings.lossPoints * p.losses +
         settings.drawPoints * p.draws;
}

export function calculateWeight(p, op, settings) {
  const ps = getScore(p, settings);
  const ops = getScore(op, settings);
  return 10000 - (Math.abs(ps - ops));
}

export function generatePlayerGraph(playerIds, players, settings) {
  return playerIds.flatMap((id) => {
    const player = players[id];
    return playerIds
      .filter(oId => id !== oId && !player.playedIds[oId])
      .map((otherId) => {
        const otherPlayer = players[otherId];
        const weight = calculateWeight(player, otherPlayer, settings);
        return [+id, +otherId, weight];
      });
  });
}

export function pairPlayers(players, settings, shuffleFn) {
  const playerIds = Seq(shuffleFn(Object.keys(players)));
  const graph = generatePlayerGraph(playerIds, players, settings);
  const pairing = blossom(graph.toJS());
  const pairs = pairing
    .map((pId, opId) => [pId, opId])
    .filter(([pId, opId]) => pId > opId)
    .map(([pId, opId]) => shuffleFn([pId.toString(), opId.toString()]))
  return fromJS(shuffleFn(pairs));
}

export default { shuffle, defaultSettings, generatePlayer, pairPlayers, getScore, getScoreImm };
