import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import MatchCardsComponent from '../components/MatchCards';
import { currentPlayers, currentFilteredMatches, currentFilteredRounds, currentSettings } from '../selectors/tournament'
import * as e from '../modules/events';

const mapStateToProps = (root) => {
  const uiState = root.uiReducer;
  return {
    players: currentPlayers(root),
    filteredMatches: currentFilteredMatches(root),
    filteredRounds:  currentFilteredRounds(root),
    settings: currentSettings(root),
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
