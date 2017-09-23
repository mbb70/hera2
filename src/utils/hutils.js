import blossom from 'edmonds-blossom';
import { Map, List } from 'immutable';

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
  const graph = [];
  playerIds.forEach((id) => {
    const player = players[id];
    playerIds.forEach((otherId) => {
      if (id !== otherId && !player.playedIds[otherId]) {
        const otherPlayer = players[otherId];
        const weight = calculateWeight(player, otherPlayer, settings);
        graph.push([+id, +otherId, weight]);
      }
    });
  });
  return graph;
}

export function pairPlayers(playerIds, players, settings, currentTournament) {
  const graph = generatePlayerGraph(playerIds, players, settings);
  const pairing = blossom(graph);
  return pairing
    .map((pId, opId) => [pId, opId])
    .filter(([pId, opId]) => pId > opId)
    .map(([pId, opId]) => [pId.toString(), opId.toString()])
}

export default { shuffle, defaultSettings, generatePlayer, pairPlayers, getScore };
