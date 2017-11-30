import { connect } from 'react-redux';
import Label from 'reactstrap/lib/Label';
import FormGroup from 'reactstrap/lib/FormGroup';
import React, { PureComponent } from 'react';
import BasicFormModal from './BasicFormModal';
import LinkButton from './LinkButton';

connect();

class ExporterForm extends PureComponent {
  initialState = {
    downloadDestination: 'local',
    downloadType: 'csv',
    uri: '',
  };
  state = { ...this.initialState };

  getUri = (destination, type) => {
    if (destination === 'local' && type === 'json') {
      const uri = encodeURIComponent(
        JSON.stringify(this.props.tournamentState, null, 2)
      );
      return `data:application/json;charset=utf-8,${uri}`;
    } else if (destination === 'local' && type === 'csv') {
      const uri = encodeURIComponent(
        this.generateCsv(this.props.tournamentState)
      );
      return `data:text/csv;charset=utf-8,${uri}`;
    }
    return '';
  };

  generateCsv = tstate => {
    const rows = [];
    const header = [
      'Round',
      'Table',
      'Player 1',
      'Player 2',
      'Winner',
      'Score',
      'Dropped',
    ];
    rows.push(`"${header.join('","')}"`);
    const rounds = tstate.rounds;
    for (let i = rounds.length - 1; i >= 0; i -= 1) {
      const round = rounds[i];
      round.matches.forEach(matchId => {
        const match = tstate.matches[matchId];
        const row = [];
        row.push(round.number);
        row.push(match.table);
        row.push(tstate.players[match.p1].name);
        row.push(tstate.players[match.p2].name);
        if (match.winner === undefined) {
          row.push('Ongoing');
          row.push('');
        } else {
          const winner = tstate.players[match.winner];
          row.push(winner ? winner.name : 'Draw');
          row.push(`'${match.score}`);
          row.push(match.drop.map(p => tstate.players[p].name).join(' and '));
        }
        rows.push(`"${row.join('","')}"`);
      });
    }
    return rows.join('\n');
  };

  handleFormLoad = () => {
    this.setState({
      uri: this.getUri(this.state.downloadDestination, this.state.downloadType),
    });
  };

  handleDownloadDestination = e => {
    const downloadDestination = e.target.value;
    this.setState({
      uri: this.getUri(downloadDestination, this.state.downloadType),
      downloadDestination,
    });
  };

  handleDownloadType = e => {
    const downloadType = e.target.value;
    this.setState({
      uri: this.getUri(this.state.downloadDestination, downloadType),
      downloadType,
    });
  };

  handleResetForm = () => {
    this.setState(...this.initialState);
  };

  render() {
    const entryPoint = <LinkButton>Export Data</LinkButton>;
    const header = 'Export';
    const resetForm = this.handleResetForm;
    const onLoad = this.handleFormLoad;
    const onFormSubmit = () => {};
    const onExit = this.props.onExit;
    const downloadName = `${this.props.tournamentState.tournamentName}.${this
      .state.downloadType}`;
    const submitButton = (
      <a
        className="btn btn-primary"
        download={downloadName}
        href={this.state.uri}
        onClick={onFormSubmit}
      >
        Download
      </a>
    );
    return (
      <BasicFormModal
        {...{
          entryPoint,
          header,
          submitButton,
          onFormSubmit,
          onLoad,
          resetForm,
          onExit,
        }}
      >
        <FormGroup>
          <Label>Export To</Label>
          <div>
            <select
              value={this.state.downloadDestination}
              onChange={this.handleDownloadDestination}
            >
              <option value="local">Local Download</option>
              <option disabled value="dropbox">
                Dropbox
              </option>
              <option disabled value="google">
                Google Drive
              </option>
            </select>
          </div>
        </FormGroup>
        <FormGroup>
          <Label>Export Type</Label>
          <div>
            <select
              value={this.state.downloadType}
              onChange={this.handleDownloadType}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option disabled value="xlsx">
                Excel
              </option>
            </select>
          </div>
        </FormGroup>
      </BasicFormModal>
    );
  }
}

export default ExporterForm;
