import { connect } from 'react-redux';
import TournamentComponent from '../components/Tournament';
import { currentSettings } from '../selectors/tournament';
import { toJS } from '../components/toJS';
import * as e from '../modules/events';

const mapStateToProps = root => ({
  settings: currentSettings(root),
  tournaments: root.tournament.get('tournaments'),
  uiState: root.ui,
});

const mapDispatchToProps = e.dumbDispatch(e, [
  'createTournament',
  'switchTournament',
  'closeSidebar',
]);
export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(TournamentComponent)
);
