import { Map } from 'immutable';
import { connect } from 'react-redux';
import ExporterFormComponent from '../components/ExporterForm';
import {
  currentPlayers,
  currentMatches,
  currentSettings,
  currentRounds,
} from '../selectors/tournament';
import { toJS } from '../components/toJS';

const mapStateToProps = root => ({
  tournamentState: Map({
    players: currentPlayers(root),
    matches: currentMatches(root),
    rounds: currentRounds(root),
    tournamentName: currentSettings(root).get('tournamentName'),
  }),
});

const mapDispatchToProps = () => ({});

const ExporterForm = connect(mapStateToProps, mapDispatchToProps)(
  toJS(ExporterFormComponent)
);

export default ExporterForm;
