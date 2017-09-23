import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import TopNavComponent from '../components/TopNav';
import * as e from '../modules/events';

const mapStateToProps = (root) => {
  const state = root.tournamentReducer;
  const uiState = root.uiReducer;
  const currentTournament = state.get('currentTournament');
  return {
    rounds:   state.get('rounds').filter( r => r.get('tournamentId') === currentTournament)
                   .valueSeq().sort(r => -r.get('id')),
    settings: state.getIn(['settings', currentTournament]),
    uiState,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateSearch: (searchText) => dispatch(e.updateSearch(searchText)),
  switchView: (playerView) => dispatch(e.switchView(playerView)),
  toggleSidebar: (sidebarOpen) => dispatch(e.toggleSidebar(sidebarOpen)),
});

const TopNav = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toJS(TopNavComponent));

export default TopNav;
