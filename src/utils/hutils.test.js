import Hutils from './hutils';
import _ from 'lodash';

it('pairs up', () => {
  const players = Hutils.generatePlayers();
  const settings = Hutils.defaultSettings();
  const pairIds = Hutils.pairPlayers(_.map(players, (p) => p.id), players, settings);
  expect(pairIds).toEqual([
    ['8', '1'], ['7', '2'], ['6', '3'], ['5', '4'],
    ['4', '5'], ['3', '6'], ['2', '7'], ['1', '8']
  ]);
});

it('only selects pairs once', () => {
  const players = Hutils.generatePlayers();
  const playerIds = _.map(players, p => p.id);
  const settings = Hutils.defaultSettings();
  _.times(3, (i) => {
    const pairIds = Hutils.pairPlayers(playerIds, players, settings);
    _.each(pairIds, ([p1, p2]) => players[p1].playedIds[p2] = 1)
    const newPairIds = Hutils.pairPlayers(playerIds, players, settings);
    _.each(newPairIds, (newPr) => {
      _.each(pairIds, (pr) => expect(newPr).not.toEqual(pr))
    });
  });
});

it('plays round', () => {
  const players = Hutils.generatePlayers();
  const settings = Hutils.defaultSettings();
  const pairIds = Hutils.pairPlayers(_.map(players, (p) => p.id), players, settings);
  const winners = [1, 0, 0, 1];
  const updatedPlayers = Hutils.playRound(pairs, winners);
  pairs.forEach((pair, i) => {
    const winner = pair[winners[i]];
    const loser = pair[Math.abs(winners[i] - 1)];
    const oldWinnerScore = winner.score;
    const oldLoserScore = loser.score;
    const newWinnerScore = updatedPlayers.get(winner.id).score;
    const newLoserScore = updatedPlayers.get(loser.id).score;
    expect(newWinnerScore).toEqual(oldWinnerScore + 1);
    expect(newLoserScore).toEqual(oldLoserScore - 1);
  });
});

it('plays multiple rounds', () => {
  // round 1
  let winners = [1, 0, 0, 1];
  let players = Hutils.generatePlayers();
  let pairs = Hutils.pairPlayers(players);
  players = Hutils.playRound(pairs, winners);

  // round 2
  winners = [0, 1, 0, 0];
  pairs = Hutils.pairPlayers(players);
  expectEvenPairs(pairs);
  players = Hutils.playRound(pairs, winners);

  pairs = Hutils.pairPlayers(players);
  expectEvenPairs(pairs);
});

function expectEvenPairs(pairs) {
  const scores = pairs.map(pr => pr.map(p => p.score));
  scores.forEach((pairScores) => {
    const [s1, s2] = pairScores;
    expect(s1).toEqual(s2);
  });
}
