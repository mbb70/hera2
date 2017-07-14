import blossom from 'edmonds-blossom';
import _ from 'lodash';


function generatePlayers() {
  const players = {};
  players[0] = {
    name: 'Bye',
    wins: 0,
    losses: 0,
    draws: 5000,
    id: '0',
    bye: true,
    playedIds: {},
    matchIds: [],
    dropped: false,
  };
  _.each([
  //'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
   //'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
   //'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
   //'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
   //'y', 'z', '0', '1', '2', '3', '4', '5',
   //'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
   //'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
   //'y', 'z', '0', '1', '2', '3', '4', '5',
 'Adrienne Morales',
 'Joy Arnold',
 'Sheri Mcbride',
 'Leroy Little',
 'Mercedes Bowman',
 'Brendan Robertson',
 'Chad Gross',
 'Damon Hamilton'
  ], (p, i) => {
    players[i+1] = {
      name: p,
      wins: 0,
      losses: 0,
      draws: 0,
      id: (i+1).toString(),
      playedIds: {},
      matchIds: [],
      dropped: false,
    };
  });
  return players;
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
    if (player.dropped) return;
    _.each(ids, (otherId) => {
      if (id !== otherId && player.playedIds[otherId] === undefined) {
        const otherPlayer = players[otherId];
        if (otherPlayer.dropped) return;
        const weight = calculateWeight(player, otherPlayer, settings);
        graph.push([+id, +otherId, weight]);
      }
    });
  });
  return graph;
}

function pairPlayers(playerIds, players, settings) {
  const pairs = new Map();
  const graph = generatePlayerGraph(playerIds, players, settings);
  const pairing = blossom(graph);
  _.each(pairing, (gopId, gid) => {
    if (players[gopId] !== undefined) {
      pairs.set(gopId.toString(), gid.toString());
    }
  });
  return [...pairs.entries()];
}

export default { generatePlayers, pairPlayers, getScore };
