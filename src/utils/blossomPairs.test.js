import fs from 'fs';
import findOptimalMatching from './blossomPairs';
import shuffle from 'lodash/shuffle';

function loadEdgeData(fd) {
  const edges = [];
  const lines = fd.split("\n");
  for (let i = 0, l1 = lines.length; i < l1; i += 1) {
    const cols = lines[i].split("\t");
    edges.push(cols.map(e => +e));
  }
  return edges;
}

function pair(edgeList) {
  const edgeMap = new Map();
  edgeList.forEach((e) => {
    if (!edgeMap.has(e[0])) { edgeMap.set(e[0], new Set()); }
    edgeMap.get(e[0]).add(e[1]);
    if (!edgeMap.has(e[1])) { edgeMap.set(e[1], new Set()); }
    edgeMap.get(e[1]).add(e[0]);
  });
  const out = findOptimalMatching(edgeList);
  out.forEach((k, v) => {
    const pass = edgeMap.get(k).has(v);
    expect(pass).toEqual(true);
  });
}

it('pairs large', () => {
  const fd = fs.readFileSync('edges.txt', 'UTF-8');
  const edgeList = shuffle(loadEdgeData(fd));
  pair(edgeList);
});

it('pairs small', () => {
  const edgeList = [
    [1, 2],
    [2, 5],
    [0, 4],
    [1, 5],
    [0, 3],
    [3, 4],
    [1, 4],
    [4, 5],
    [0, 1],
  ];
  pair(edgeList);
});

