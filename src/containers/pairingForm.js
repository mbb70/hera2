import { connect } from 'react-redux';
import PairingFormComponent from '../components/PairingForm';
import { toJS } from '../components/toJS';
import * as e from '../modules/events';

const mapStateToProps = (root) => {
  const state = root.tournamentReducer;
  const pairingFormState = root.pairingFormReducer;
  const currentTournament = state.get('currentTournament');
  return {
    players:  state.get('players').filter(p => p.get('tournamentId') === currentTournament),
    pairingFormState,
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleEditing: (sidebarOpen) => dispatch(e.toggleSidebar(sidebarOpen)),
  rePairPlayers: (lockedTables, pairs) => dispatch(e.rePairPlayers(lockedTables, pairs)),
  resetPairsForm: () => dispatch(e.resetPairsForm()),
  swapPairPlayers: (p1, p2) => dispatch(e.swapPairPlayers(p1, p2)),
  lockPairs: (p1, p2) => dispatch(e.lockPairs(p1, p2)),
});

const Tournament = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toJS(PairingFormComponent));

export default Tournament;
