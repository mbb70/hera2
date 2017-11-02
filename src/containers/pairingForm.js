import { connect } from 'react-redux';
import PairingFormComponent from '../components/PairingForm';
import {
  currentSettings,
  currentActivePlayers,
  currentActiveUnlockedPlayers,
  currentLockedPlayerMap,
} from '../selectors/tournament';
import { toJS } from '../components/toJS';
import * as e from '../modules/events';

const mapStateToProps = root => {
  const pairingFormState = root.pairingFormReducer;
  return {
    activePlayers: currentActivePlayers(root),
    activeUnlockedPlayers: currentActiveUnlockedPlayers(root),
    editing: pairingFormState.get('editing'),
    lockedTables: pairingFormState.get('lockedTables'),
    lockedPlayerMap: currentLockedPlayerMap(root),
    pairs: pairingFormState.get('pairs'),
    settings: currentSettings(root),
  };
};

const mapDispatchToProps = dispatch => ({
  toggleEditing: () => dispatch(e.togglePairEditing()),
  rePairPlayers: (players, settings, shuffleFn) =>
    dispatch(e.rePairPlayers(players, settings, shuffleFn)),
  resetPairsForm: () => dispatch(e.resetPairsForm()),
  swapPairPlayers: (p1, p2) => dispatch(e.swapPairPlayers(p1, p2)),
  lockPairs: (tableId, checked) => dispatch(e.lockPairs(tableId, checked)),
});

const Tournament = connect(mapStateToProps, mapDispatchToProps)(
  toJS(PairingFormComponent)
);

export default Tournament;
