import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import AppNavComponent from '../components/AppNav';
import {
  currentPlayers,
  currentMatches,
  currentActiveRound,
  currentSettings,
} from '../selectors/tournament';
import * as e from '../modules/events';

const mapStateToProps = root => ({
  players: currentPlayers(root),
  matches: currentMatches(root),
  activeRound: currentActiveRound(root),
  settings: currentSettings(root),
  uiState: root.ui,
});

const mapDispatchToProps = e.dumbDispatch(e, [
  'pairPlayers',
  'saveSettings',
  'clearTournament',
  'deleteTournament',
  'finishRound',
  'toggleDroppedFilter',
  'toggleSortType',
  'switchView',
  'closeSidebar',
]);

export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(AppNavComponent)
);
