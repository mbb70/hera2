function flipMatchesAlongPath(matchMap, path) {
  const newMatches = new Map(matchMap.entries());
  for (let i = 0, l1 = path.length - 1; i < l1; i += 1) {
    const p1 = path[i].node;
    const p2 = path[i + 1].node;
    if (matchMap.get(p1) === p2) {
      newMatches.delete(p1);
      newMatches.delete(p2);
    } else {
      newMatches.set(p1, p2);
    }
  }
  const keys = newMatches.keys();
  let key = keys.next();
  while (!key.done) {
    newMatches.set(newMatches.get(key.value), key.value);
    key = keys.next();
  }
  return newMatches;
}

function pathToRoot(v, rootDown = false) {
  let r = v;
  const path = [r];
  while (r.parentNode && !r.parentNode.marked) {
    r = r.parentNode;
    r.marked = true;
    path.push(r);
  }
  return rootDown ? path.reverse() : path;
}

function addToEdgeMap(eMap, p1, p2) {
  if (!eMap.has(p1)) {
    eMap.set(p1, new Set());
  }
  eMap.get(p1).add(p2);
}

function getGraph(edgeList, matchMap) {
  const eMap = new Map();
  for (let i = 0, l1 = edgeList.length; i < l1; i += 1) {
    const [p1, p2] = edgeList[i];
    addToEdgeMap(eMap, p1, p2);
    addToEdgeMap(eMap, p2, p1);
  }
  const graph = new Map();

  const entries = eMap.entries();
  let pair = entries.next();
  while (!pair.done) {
    const [n, edges] = pair.value;
    graph.set(n, {
      node: n,
      match: matchMap.get(n),
      visited: false,
      edges: [...edges.values()],
    });
    pair = entries.next();
  }

  const nodes = [...graph.values()];
  for (let i = 0, l1 = nodes.length; i < l1; i += 1) {
    const node = nodes[i];
    node.edges = node.edges.map(e => graph.get(e));
    if (node.match !== undefined) {
      node.match = graph.get(node.match);
    }
  }
  return nodes;
}

function addToTree(n, parentNode, evenFromRoot) {
  n.forest = parentNode.forest;
  n.parentNode = parentNode;
  n.evenFromRoot = evenFromRoot;
}

function createBlossom(v, w) {
  const vPath = pathToRoot(v, true);
  const wPath = pathToRoot(w, true);
  const len = Math.max(vPath.length, wPath.length);
  for (let i = 0; i < len; i += 1) {
    const vN = vPath[i];
    const wN = wPath[i];
    if (vN !== wN) {
      return vPath.slice(i - 1).concat(wPath.slice(i).reverse());
    }
  }
  return undefined;
}

function getNext(blossom, rev, i) {
  if (rev && i === 0) return blossom.length - 1;
  if (!rev && i === blossom.length - 1) return 0;
  return i + (rev ? -1 : 1);
}

function findPathThroughBlossom(blossom, prev, blossomN, next) {
  const findPrevEdge = e => e.node === prev.node;
  const findNextEdge = e => e.node === next.node;

  if (prev === undefined || next === undefined) {
    let rev = next === undefined;
    const findEdge = rev ? findPrevEdge : findNextEdge;
    let blossomPath = [];
    let i = 0;
    while (true) {
      const node = blossom[i];
      blossomPath.push(node);
      const willBreakPair = node.match && node.match.node !== blossom[getNext(blossom, !rev, i)].node;
      if (node.edges.find(findEdge) !== undefined && !willBreakPair) {
        if (next === undefined) blossomPath.reverse();
        return blossomPath;
      }

      i = getNext(blossom, rev, i);
      if (i === 0) {
        blossomPath = [];
        rev = !rev;
      }
    }
  }

  for (let i = 0, l1 = blossom.length; i < l1; i += 1) {
    let node = blossom[i];
    if (node.edges.find(findPrevEdge) !== undefined) {
      const blossomPath = [];
      for (let j = i, l2 = blossom.length; j < l2; j += 1) {
        node = blossom[j];
        blossomPath.push(node);
        if ((node.evenFromRoot === next.evenFromRoot) && node.edges.find(findNextEdge)) {
          return blossomPath;
        }
      }
    }
  }
  return undefined;
}

function unfurlBlossomAlongPath(blossom, blossomNode, contractedPath) {
  const path = [];
  for (let i = 0, l1 = contractedPath.length; i < l1; i += 1) {
    const nm1 = contractedPath[i - 1];
    const n = contractedPath[i];
    const np1 = contractedPath[i + 1];
    if (n.node === blossomNode) {
      const p = findPathThroughBlossom(blossom, nm1, n, np1);
      for (let j = 0, l2 = p.length; j < l2; j += 1) {
        path.push(p[j]);
      }
    } else {
      path.push(n);
    }
  }
  return path;
}

function getHighestNode(edgeList) {
  return Math.max(...edgeList.reduce((n1, n2) => [Math.max(n1[0], n2[0]), Math.max(n1[1], n2[1])]));
}

function contractGraph(blossom, edgeList, matchMap) {
  const blossomSet = new Set();
  for (let i = 0, l1 = blossom.length; i < l1; i += 1) {
    blossomSet.add(blossom[i].node);
  }
  const blossomNode = getHighestNode(edgeList) + 1;
  const contractedEdgeList = [];
  for (let i = 0, l1 = edgeList.length; i < l1; i += 1) {
    const e = edgeList[i];
    let [n1, n2] = e;
    if (blossomSet.has(n1)) {
      n1 = blossomNode;
    }
    if (blossomSet.has(n2)) {
      n2 = blossomNode;
    }
    if (n1 !== n2) {
      contractedEdgeList.push([n1, n2]);
    }
  }
  const contractedMatchMap = new Map();
  const entries = matchMap.entries();
  let pair = entries.next();
  while (!pair.done) {
    let [e, k] = pair.value;
    if (blossomSet.has(e)) e = blossomNode;
    if (blossomSet.has(k)) k = blossomNode;
    if (e !== k) contractedMatchMap.set(e, k);
    pair = entries.next();
  }
  return { blossomNode, contractedEdgeList, contractedMatchMap };
}

function findAugmentingPath(edgeList, matchMap) {
  const graph = getGraph(edgeList, matchMap);
  const freeSet = graph.filter(n => !n.match);
  for (let i = 0, l1 = freeSet.length; i < l1; i += 1) {
    freeSet[i].forest = i;
    freeSet[i].evenFromRoot = true;
  }

  while (true) {
    const v = graph.find(n => !n.visited && n.evenFromRoot);
    if (v === undefined) {
      return [];
    }
    const edges = v.edges.filter(c => !c.visited);
    for (let i = 0, l1 = edges.length; i < l1; i += 1) {
      const w = edges[i];
      if (w.forest === undefined) {
        addToTree(w, v, false);
        addToTree(w.match, w, true);
      } else if (w.evenFromRoot) {
        if (v.forest !== w.forest) {
          return pathToRoot(w, true).concat(pathToRoot(v));
        }
        const blossom = createBlossom(v, w);
        const { blossomNode, contractedEdgeList, contractedMatchMap } = contractGraph(blossom, edgeList, matchMap);
        const contractedPath = findAugmentingPath(contractedEdgeList, contractedMatchMap);
        const path = unfurlBlossomAlongPath(blossom, blossomNode, contractedPath);
        return path;
      }
      w.visited = true;
    }
    v.visited = true;
  }
}

export default function findOptimalMatching(edgeList) {
  let matchMap = new Map();
  let path = findAugmentingPath(edgeList, matchMap);
  while (path.length > 0) {
    matchMap = flipMatchesAlongPath(matchMap, path);
    path = findAugmentingPath(edgeList, matchMap);
  }
  return matchMap;
}
