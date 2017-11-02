import { fromJS } from 'immutable';
import Hutils from '../utils/hutils';
import * as e from './events';

const a = e.actions;

export function newInitialState() {
  return fromJS({
    editing: false,
    pairs: [],
    lockedTables: {},
  });
}

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
      const lockedPairs = state
        .get('lockedTables')
        .filter(v => v)
        .map((v, tableId) => state.getIn(['pairs', tableId.toString()]));
      let pairs = Hutils.pairPlayers(
        action.players,
        action.settings,
        action.shuffleFn
      );
      lockedPairs.forEach((lockedPair, tableId) => {
        pairs = pairs.insert(+tableId, lockedPair);
      });
      return state.set('pairs', pairs);
    }
    case a.RESET_PAIRS_FORM: {
      return newInitialState();
    }
    case a.SWAP_PAIR_PLAYERS: {
      return state.update('pairs', pairs => {
        return pairs.map(pair => {
          return pair.map(p => {
            if (p === action.p1) return action.p2;
            if (p === action.p2) return action.p1;
            return p;
          });
        });
      });
    }
    default:
      return state;
  }
}
