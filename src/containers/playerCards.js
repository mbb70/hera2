import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import PlayerCardsComponent from '../components/PlayerCards';
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
  onAddPlayers: (names) => dispatch(e.addPlayers(names)),
  updatePlayer: (player) => dispatch(e.updatePlayer(player)),
});

const PlayerCards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toJS(PlayerCardsComponent));

export default PlayerCards;
