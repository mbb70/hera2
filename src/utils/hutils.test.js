import Hutils from './hutils';

it('pairs up', () => {
  const players = Hutils.generatePlayers();
  const pairs = Hutils.pairPlayers(players);
  const pairIds = pairs.map(pr => pr.map(p => p.ids));
  expect(pairIds).toEqual([
    [1, 0], [3, 2], [5, 4], [7, 6]
  ]);
});

it('plays round', () => {
  const players = Hutils.generatePlayers();
  const pairs = Hutils.pairPlayers(players);
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
