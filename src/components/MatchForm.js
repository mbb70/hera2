import React, { PureComponent } from 'react';
import Button from 'reactstrap/lib/Button';
import Label from 'reactstrap/lib/Label';
import FormGroup from 'reactstrap/lib/FormGroup';
import BasicFormModal from './BasicFormModal';
import MatchCard from './MatchCard';
import ButtonRow from './ButtonRow';
import ButtonCol from './ButtonCol';

class MatchForm extends PureComponent {
  state = {
    match: { ...this.props.match },
  };

  getScoreFromIndex = i => {
    if (i === 0) return '2 - 0';
    if (i === 1) return '2 - 1';
    if (i === 2) return '1 - 0';
    return undefined;
  };

  getIndexFromScore = score => {
    if (score === '2 - 0') return 0;
    if (score === '2 - 1') return 1;
    if (score === '1 - 0') return 2;
    return undefined;
  };

  getWinnerId = i => {
    if (i === 0) return this.state.match.p1;
    if (i === 1) return '0';
    if (i === 2) return this.state.match.p2;
    return undefined;
  };

  getWinnerIndex = id => {
    if (id === this.state.match.p1) return 0;
    if (id === '0') return 1;
    if (id === this.state.match.p2) return 2;
    return undefined;
  };

  handleDropSelection = i => {
    const drop = [...(this.state.match.drop || [])];
    const pId = i === 0 ? this.state.match.p1 : this.state.match.p2;
    const idx = drop.indexOf(pId);
    if (idx === -1) {
      drop.push(pId);
    } else {
      drop.splice(idx, 1);
    }
    this.setState({ match: { ...this.state.match, drop } });
  };

  handleScoreSelection = i => {
    this.setState({
      match: { ...this.state.match, score: this.getScoreFromIndex(i) },
    });
  };

  handleWinnerSelection = i => {
    const winnerId = this.getWinnerId(i);
    const newState = { ...this.state.match };
    newState.winner = winnerId;
    if (winnerId === '0') {
      newState.score = '0 - 0';
    }
    this.setState({ match: newState });
  };

  handleFormSubmit = () => {
    this.props.updateMatch(this.state.match);
  };

  handleResetForm = () => {
    this.setState({ match: { ...this.props.match } });
  };

  render() {
    const match = this.state.match || this.props.match;
    const entryPoint = (
      <MatchCard match={this.props.match} players={this.props.players} />
    );
    const header = `Table ${this.props.match.table}`;
    const submitText = 'Submit';
    const resetForm = this.handleResetForm;
    const onFormSubmit = this.handleFormSubmit;
    const p1 = this.props.players[match.p1];
    const p2 = this.props.players[match.p2];
    const winnerSelected = this.getWinnerIndex(match.winner);
    const scoreSelected = this.getIndexFromScore(match.score);
    const invalid =
      winnerSelected === undefined ||
      (winnerSelected !== 1 && scoreSelected === undefined);
    const drop = (match.drop || []).map(pId => (pId === p1.id ? 0 : 1));
    return (
      <BasicFormModal
        {...{
          entryPoint,
          header,
          submitText,
          resetForm,
          onFormSubmit,
          invalid,
        }}
      >
        <FormGroup>
          <Label>Winner</Label>
          <ButtonCol
            selected={winnerSelected}
            onClick={this.handleWinnerSelection}
          >
            <Button type="button" color="success">
              {p1.name}
            </Button>
            <Button type="button" color="secondary">
              Draw
            </Button>
            <Button type="button" color="success">
              {p2.name}
            </Button>
          </ButtonCol>
        </FormGroup>
        {match.winner !== '0' && (
          <FormGroup>
            <Label>Score</Label>
            <ButtonRow
              selected={scoreSelected}
              onClick={this.handleScoreSelection}
            >
              <Button type="button" color="info">
                2 - 0
              </Button>
              <Button type="button" color="secondary">
                2 - 1
              </Button>
              <Button type="button" color="info">
                1 - 0
              </Button>
            </ButtonRow>
          </FormGroup>
        )}
        <FormGroup>
          <Label>Drop</Label>
          <ButtonRow multi selected={drop} onClick={this.handleDropSelection}>
            <Button type="button" color="danger">
              Drop {p1.name}
            </Button>
            <Button type="button" color="danger">
              Drop {p2.name}
            </Button>
          </ButtonRow>
        </FormGroup>
      </BasicFormModal>
    );
  }
}

export default MatchForm;
