import { connect } from 'react-redux';
import TournamentComponent from '../components/Tournament';
import { toJS } from '../components/toJS';
import * as e from '../modules/events';

const mapStateToProps = root => {
  const state = root.tournamentReducer;
  const uiState = root.uiReducer;
  const currentTournament = state.get('currentTournament');
  return {
    settings: state.getIn(['settings', currentTournament]),
    tournaments: state.get('tournaments'),
    uiState,
  };
};

const mapDispatchToProps = dispatch => ({
  createTournament: tournament => dispatch(e.createTournament(tournament)),
  switchTournament: tournamentId => dispatch(e.switchTournament(tournamentId)),
  toggleSidebar: sidebarOpen => dispatch(e.toggleSidebar(sidebarOpen)),
});

const Tournament = connect(mapStateToProps, mapDispatchToProps)(
  toJS(TournamentComponent)
);

export default Tournament;
