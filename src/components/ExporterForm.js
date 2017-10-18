import React, { PureComponent } from 'react';
import BasicFormModal from './BasicFormModal';
import LinkButton from './LinkButton';
import { connect } from 'react-redux';
import { Label, FormGroup } from 'reactstrap';

connect();

class ExporterForm extends PureComponent {
  generateCsv = (tstate) => {
    const rows = [];
    const header = ['Round', 'Table', 'Player 1', 'Player 2', 'Winner', 'Score'];
    rows.push('"' + header.join('","') + '"');
    const rounds = tstate.rounds;
    for (let i = rounds.length - 1; i >= 0; i--) {
      const round = rounds[i];
      round.matches.forEach((matchId) => {
        const match = tstate.matches[matchId];
        const row = [];
        row.push('"' + round.number);
        row.push(match.table);
        row.push(tstate.players[match.p1].name);
        row.push(tstate.players[match.p2].name);
        const winner = tstate.players[match.winner];
        row.push(winner ? winner.name : '');
        row.push("'" + match.score + '"');
        rows.push(row.join('","'));
      });
    };
    return rows.join("\n");
  }

  getUri = (destination, type) => {
    if (destination === 'local' && type === 'json') {
      return 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.props.tournamentState, null, 2));
    } else if (destination === 'local' && type === 'csv') {
      return 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.generateCsv(this.props.tournamentState));
    }
  }

  state = {
    downloadDestination: 'local',
    downloadType: 'csv',
    uri: this.getUri('local', 'csv'),
  };

  handleDownloadDestination = (e) => {
    const downloadDestination = e.target.value;
    this.setState({
      uri: this.getUri(downloadDestination, this.state.downloadType),
      downloadDestination,
    });
  }

  handleDownloadType = (e) => {
    const downloadType = e.target.value;
    this.setState({
      uri: this.getUri(this.state.downloadDestination, downloadType),
      downloadType,
    });
  }

  render() {
    const entryPoint = <LinkButton>Export Data</LinkButton>;
    const header = 'Export';
    const resetForm = () => {};
    const onFormSubmit = () => {};
    const onExit = this.props.onExit;
    const submitButton = (<a className="btn btn-primary" download={'output.' + this.state.downloadType} href={this.state.uri} onClick={onFormSubmit}>Download</a>);
    return (
      <BasicFormModal {...{entryPoint, header, submitButton, onFormSubmit, resetForm, onExit}}>
        <FormGroup>
          <Label>Export To</Label>
          <div>
            <select value={this.state.downloadDestination} onChange={this.handleDownloadDestination}>
              <option value='local'>Local Download</option>
              <option disabled value='dropbox'>Dropbox</option>
              <option disabled value='google'>Google Drive</option>
            </select>
          </div>
        </FormGroup>
        <FormGroup>
          <Label>Export Type</Label>
          <div>
            <select value={this.state.downloadType} onChange={this.handleDownloadType}>
              <option value='csv'>CSV</option>
              <option value='json'>JSON</option>
              <option disabled value='xlsx'>Excel</option>
            </select>
          </div>
        </FormGroup>
      </BasicFormModal>
    );
  }
}

export default ExporterForm;
