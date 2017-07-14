import { connect } from 'react-redux';
import TournamentComponent from '../components/Tournament';
import * as r from '../modules/Tournament';

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  onAddPlayers: (names) => dispatch(r.addPlayers(names)),
  pairPlayers: (shuffledPlayers) => dispatch(r.pairPlayers(shuffledPlayers)),
  saveSettings: (settings) => dispatch(r.saveSettings(settings)),
  updatePlayer: (player) => dispatch(r.updatePlayer(player)),
  updateMatch: (match) => dispatch(r.updateMatch(match)),
  clearLocalStorage: () => dispatch(r.clearLocalStorage()),
  createTournament: (tournament) => dispatch(r.createTournament(tournament)),
});

const Tournament = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TournamentComponent);

export default Tournament;
