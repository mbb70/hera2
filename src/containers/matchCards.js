import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import MatchCardsComponent from '../components/MatchCards';
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
  updateMatch: (match) => dispatch(e.updateMatch(match)),
});

const MatchCards = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toJS(MatchCardsComponent));

export default MatchCards;
