import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import PlayerCardsComponent from '../components/PlayerCards';
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
  onAddPlayers: (names) => dispatch(e.addPlayers(names)),
  updatePlayer: (player) => dispatch(e.updatePlayer(player)),
});

const PlayerCards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toJS(PlayerCardsComponent));

export default PlayerCards;
