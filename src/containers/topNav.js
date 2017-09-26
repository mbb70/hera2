import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import TopNavComponent from '../components/TopNav';
import { currentRounds, currentSettings } from '../selectors/tournament'
import * as e from '../modules/events';

const mapStateToProps = (root) => {
  const state = root.tournamentReducer;
  const uiState = root.uiReducer;
  return {
    rounds: currentRounds(state),
    settings: currentSettings(state),
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
