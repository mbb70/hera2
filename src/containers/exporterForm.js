import { connect } from 'react-redux';
import ExporterFormComponent from '../components/ExporterForm';
import { currentPlayers, currentMatches, currentSettings, currentRounds } from '../selectors/tournament'
import { toJS } from '../components/toJS';
//import * as e from '../modules/events';
import { Map } from 'immutable';

const mapStateToProps = (root) => {
  return {
    tournamentState: Map({
      players: currentPlayers(root),
      matches: currentMatches(root),
      rounds: currentRounds(root),
      tournamentName: currentSettings(root).get('tournamentName'),
    }),
  };
};

const mapDispatchToProps = (dispatch) => ({
});

const ExporterForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(toJS(ExporterFormComponent));

export default ExporterForm;
