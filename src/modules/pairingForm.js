import { fromJS } from 'immutable';
import * as e from './events';

const a = e.actions;

export function newInitialState() {
  return fromJS({
    editing: false,
    pairs: [],
    lockedTables: {},
  });
};

const initialState = newInitialState();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case a.TOGGLE_PAIR_EDITING: {
      return state.set('editing', !state.get('editing'));
    }
    case a.LOCK_PAIRS: {
      return state.setIn(['lockedTables', action.tableId], action.locked);
    }
    case a.REPAIR_PLAYERS: {
      const lockedPairs = state.get('pairs').filter((pair, tableId) => state.getIn(['lockedTables', tableId]));
      const lockedTables = state.get('lockedTables').keySeq().filter(k => state.getIn(['lockedTables', k]));
      const lockedPlayerMap = this.getLockedPlayerMap();
      const activePlayerIds = Object.values(action.players)
        .filter(p => !p.deleted && !p.dropped && !lockedPlayerMap[p.id])
        .map(p => p.id);
      const shuffledIds = Hutils.shuffle(activePlayerIds);
      const pairs = Hutils.shuffle(Hutils.pairPlayers(shuffledIds, this.props.players, this.props.settings));
      lockedTables.forEach((t, i) => pairs.splice(t, 0, lockedPairs[i]));
      return state.set('playerView', true);
    }
    case a.RESET_PAIRS_FORM: {
      return state.set('playerView', true);
    }
    case a.SWAP_PAIR_PLAYERS: {
      const sP1 = action.p1;
      const sP2 = action.p2;
      const pairs = state.get('pairs').map((pair) => {
        const p1 = pair.get(0);
        const p2 = pair.get(1);
        if (sP1 === p1) return pair.set(0, sP2);
        if (sP1 === p2) return pair.set(1, sP2);
        if (sP2 === p1) return pair.set(0, sP1);
        if (sP2 === p2) return pair.set(1, sP1);
        return pair;
      });
      return state.set('pairs', pairs);
    }
    default:
      return state;
  }
}

