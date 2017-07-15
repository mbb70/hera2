import blossom from 'edmonds-blossom';
import _ from 'lodash';


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
  return {
    losses: 0,
    wins: 0,
    draws: 0,
    playedIds: {},
    matchIds: [],
    dropped: false,
    ...details,
  }
}

function getScore(p, settings) {
  return settings.winPoints  * p.wins   -
         settings.lossPoints * p.losses +
         settings.drawPoints * p.draws;
}

function calculateWeight(p, op, settings) {
  const ps = getScore(p, settings);
  const ops = getScore(op, settings);
  return 10000 - (Math.abs(ps - ops));
}

function generatePlayerGraph(playerIds, players, settings) {
  const graph = [];
  const ids = _.keys(players);
  _.each(playerIds, (id) => {
    const player = players[id];
    _.each(ids, (otherId) => {
      if (id !== otherId && player.playedIds[otherId] === undefined) {
        const otherPlayer = players[otherId];
        const weight = calculateWeight(player, otherPlayer, settings);
        graph.push([+id, +otherId, weight]);
      }
    });
  });
  return graph;
}

function pairPlayers(playerIds, players, settings, currentTournament) {
  const pairs = new Map();
  const filterdPlayers = _.pickBy(players, p => (p.tournamentId === currentTournament) && !(p.dropped || p.deleted));
  const graph = generatePlayerGraph(playerIds, filterdPlayers, settings);
  const pairing = blossom(graph);
  _.each(pairing, (gopId, gid) => {
    if (players[gopId] !== undefined) {
      pairs.set(gopId.toString(), gid.toString());
    }
  });
  return [...pairs.entries()];
}

export default { defaultSettings, generatePlayer, pairPlayers, getScore };