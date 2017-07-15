import { connect } from 'react-redux';
import TournamentComponent from '../components/Tournament';
import * as r from '../modules/Tournament';
import _ from 'lodash';

const mapStateToProps = (state) => {
  return {
    ...state,
    players: _.pickBy(state.players, p => p.tournamentId === state.currentTournament),
    matches: _.pickBy(state.matches, m => m.tournamentId === state.currentTournament),
    settings: state.settings[state.currentTournament],
  };
};

const mapDispatchToProps = (dispatch) => ({
  onAddPlayers: (names) => dispatch(r.addPlayers(names)),
  pairPlayers: (shuffledPlayers) => dispatch(r.pairPlayers(shuffledPlayers)),
  saveSettings: (settings) => dispatch(r.saveSettings(settings)),
  updatePlayer: (player) => dispatch(r.updatePlayer(player)),
  updateMatch: (match) => dispatch(r.updateMatch(match)),
  newTournament: () => dispatch(r.newTournament()),
  createTournament: (tournament) => dispatch(r.createTournament(tournament)),
  switchTournament: (tournamentId) => dispatch(r.switchTournament(tournamentId)),
  deleteTournament: (tournamentId) => dispatch(r.deleteTournament(tournamentId)),
  toggleDroppedFilter: (hideDropped) => dispatch(r.toggleDroppedFilter(hideDropped)),
});

const Tournament = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TournamentComponent);

export default Tournament;
