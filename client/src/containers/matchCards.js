import { connect } from 'react-redux';
import { toJS } from '../components/toJS';
import MatchCardsComponent from '../components/MatchCards';
import {
  currentPlayers,
  currentFilteredMatches,
  currentFilteredRounds,
  currentSettings,
} from '../selectors/tournament';
import * as e from '../modules/events';

const mapStateToProps = root => ({
  players: currentPlayers(root),
  filteredMatches: currentFilteredMatches(root),
  filteredRounds: currentFilteredRounds(root),
  settings: currentSettings(root),
  uiState: root.get('ui'),
});

const mapDispatchToProps = e.dumbDispatch(e, ['updateMatch']);
export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(MatchCardsComponent)
);
