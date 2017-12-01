import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import TopNavComponent from '../components/TopNav';
import { currentRounds, currentSettings } from '../selectors/tournament';
import * as e from '../modules/events';

const mapStateToProps = root => ({
  rounds: currentRounds(root),
  settings: currentSettings(root),
  uiState: root.get('ui'),
});

const mapDispatchToProps = e.dumbDispatch(e, [
  'updateSearch',
  'switchView',
  'openSidebar',
]);
export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(TopNavComponent)
);
