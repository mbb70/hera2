import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import MatchCardsComponent from '../components/MatchCards';
import * as e from '../modules/events';

const mapStateToProps = (root) => {
  const state = root.tournamentReducer;
  const uiState = root.uiReducer;
  const currentTournament = state.get('currentTournament');
  return {
    players:  state.get('players').filter(p => p.get('tournamentId') === currentTournament),
    matches:  state.get('matches').filter(m => m.get('tournamentId') === currentTournament),
    rounds:   state.get('rounds').filter( r => r.get('tournamentId') === currentTournament)
                   .valueSeq().sortBy(r => -r.get('id')),
    settings: state.getIn(['settings', currentTournament]),
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
