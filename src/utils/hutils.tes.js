import Hutils from './hutils';

function generatePlayers() {
  const bye = Hutils.generatePlayer({
    draws: 5000,
    name: 'bye',
    bye: true,
    id: '0',
  });
  const main = ['a', 'b', 'c', 'd',
   'e', 'f', 'g', 'h'].map((l,i) => {
     return Hutils.generatePlayer({id: (i+1).toString(), name: l})
   });
  main.unshift(bye);
  return main;
}

it('pairs up', () => {
  const players = generatePlayers();
  const settings = Hutils.defaultSettings();
  const pairIds = Hutils.pairPlayers(players.map((p) => p.id), players, settings);
  expect(pairIds).toEqual([
    ['8', '1'], ['7', '2'], ['6', '3'], ['5', '4'],
    ['4', '5'], ['3', '6'], ['2', '7'], ['1', '8']
  ]);
});

it('only selects pairs once', () => {
  const players = generatePlayers();
  const playerIds = players.map(p => p.id);
  const settings = Hutils.defaultSettings();
  [0,1,2].forEach((i) => {
    const pairIds = Hutils.pairPlayers(playerIds, players, settings);
    pairIds.forEach(([p1, p2]) => players[p1].playedIds[p2] = 1)
    const newPairIds = Hutils.pairPlayers(playerIds, players, settings);
    newPairIds.forEach((newPr) => {
      pairIds.forEach((pr) => expect(newPr).not.toEqual(pr))
    });
  });
});
