import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import AppNavComponent from '../components/AppNav';
import * as e from '../modules/events';

const mapStateToProps = (root) => {
  const state = root.tournamentReducer;
  const uiState = root.uiReducer;
  const currentTournament = state.get('currentTournament');
  return {
    players:  state.get('players').filter(p => p.get('tournamentId') === currentTournament),
    matches:  state.get('matches').filter(m => m.get('tournamentId') === currentTournament),
    rounds:   state.get('rounds').filter( r => r.get('tournamentId') === currentTournament)
                   .valueSeq().sort(r => -r.get('id')),
    settings: state.getIn(['settings', currentTournament]),
    uiState,
  };
};

const mapDispatchToProps = (dispatch) => ({
  pairPlayers: (pairs) => dispatch(e.pairPlayers(pairs)),
  saveSettings: (settings) => dispatch(e.saveSettings(settings)),
  switchTournament: (tournamentId) => dispatch(e.switchTournament(tournamentId)),
  deleteTournament: (tournamentId) => dispatch(e.deleteTournament(tournamentId)),
  finishRound: (roundId) => dispatch(e.finishRound(roundId)),

  toggleDroppedFilter: (hideDropped) => dispatch(e.toggleDroppedFilter(hideDropped)),
  switchView: (playerView) => dispatch(e.switchView(playerView)),
  toggleSidebar: (sidebarOpen) => dispatch(e.toggleSidebar(sidebarOpen)),
});

const AppNav = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toJS(AppNavComponent));

export default AppNav;
