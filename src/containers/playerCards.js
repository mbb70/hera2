import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import PlayerCardsComponent from '../components/PlayerCards';
import { currentPlayers, currentMatches, currentRounds, currentSettings } from '../selectors/tournament'
import * as e from '../modules/events';

const mapStateToProps = (root) => {
  const uiState = root.uiReducer;
  return {
    players: currentPlayers(root),
    matches: currentMatches(root),
    rounds:  currentRounds(root),
    settings: currentSettings(root),
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
