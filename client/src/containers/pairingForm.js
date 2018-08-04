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
  const pairingFormState = root.pairingForm;
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

const mapDispatchToProps = e.dumbDispatch(e, [
  'togglePairEditing',
  'rePairPlayers',
  'resetPairsForm',
  'swapPairPlayers',
  'lockPairs',
  'pairPlayers',
]);
export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(PairingFormComponent)
);
