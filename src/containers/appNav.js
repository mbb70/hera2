import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import AppNavComponent from '../components/AppNav';
import { currentPlayers, currentMatches, currentRounds, currentSettings } from '../selectors/tournament'
import * as e from '../modules/events';

const mapStateToProps = (root) => {
  const state = root.tournamentReducer;
  const uiState = root.uiReducer;
  return {
    players: currentPlayers(state),
    matches: currentMatches(state),
    rounds:  currentRounds(state),
    settings: currentSettings(state),
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
