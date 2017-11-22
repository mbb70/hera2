import React, { PureComponent } from 'react';
import { Row, Col, Button, Label, FormGroup } from 'reactstrap';
import BasicFormModal from './BasicFormModal';
import ValidatedInput from './ValidatedInput';
import ValidatedFormGroup from './ValidatedFormGroup';
import vu from '../utils/validationUtils';
import PlayerCard from './PlayerCard';
import MatchDetails from './MatchDetails';

class PlayerHistoryForm extends PureComponent {
  state = {
    player: { ...this.props.player },
  };

  handleFieldUpdate = (field, value) => {
    this.setState({ player: { ...this.state.player, [field]: value } });
  };

  handleFormSubmit = () => {
    const updated = { ...this.state.player };
    ['wins', 'losses', 'draws'].forEach(s => {
      updated[s] = +updated[s];
    });
    this.props.updatePlayer(updated);
  };

  handleResetForm = () => {
    this.setState({ player: { ...this.props.player } });
  };

  render() {
    const entryPoint = (
      <PlayerCard
        {...this.props.player}
        settings={this.props.settings}
        players={this.props.players}
      />
    );
    const player = this.state.player;
    const header = player.name;
    const submitText = 'Update';
    const resetForm = this.handleResetForm;
    const onFormSubmit = this.handleFormSubmit;
    const dropped = player.dropped;
    const deleted = player.deleted;
    const leftButton = (
      <div className="d-flex mr-auto">
        <Button
          type="button"
          color={deleted ? 'success' : 'danger'}
          style={{ marginRight: '0.25rem' }}
          onClick={() => this.handleFieldUpdate('deleted', !deleted)}
        >
          {deleted ? 'Undelete' : 'Delete'}
        </Button>
        <Button
          type="button"
          color={dropped ? 'success' : 'warning'}
          style={{ marginRight: '0.25rem', marginLeft: '0.25rem' }}
          onClick={() => this.handleFieldUpdate('dropped', !dropped)}
        >
          {dropped ? 'Activate' : 'Drop'}
        </Button>
      </div>
    );
    const fields = [
      { field: 'name', label: 'Name', type: 'string', validFn: vu.notEmpty },
    ];
    const scoreFields = [
      { field: 'wins', label: 'Wins', type: 'number', validFn: vu.isInteger },
      {
        field: 'losses',
        label: 'Losses',
        type: 'number',
        validFn: vu.isInteger,
      },
      { field: 'draws', label: 'Draws', type: 'number', validFn: vu.isInteger },
    ];
    const invalid = fields
      .concat(scoreFields)
      .map(({ field, validFn }) => validFn(player[field]))
      .some(v => !v);
    const historyRows = this.props.player.matchIds.map(matchId => {
      const match = this.props.matches[matchId];
      const opId = match.p1 === this.props.player.id ? match.p2 : match.p1;
      const op = this.props.players[opId];
      return (
        <MatchDetails
          key={matchId}
          match={match}
          op={op}
          player={this.props.player}
        />
      );
    });
    return (
      <BasicFormModal
        {...{
          entryPoint,
          header,
          invalid,
          submitText,
          resetForm,
          onFormSubmit,
          leftButton,
        }}
      >
        {fields.map(({ field, label, type, validFn }) => (
          <ValidatedFormGroup
            key={field}
            field={field}
            value={player[field]}
            valid={validFn}
            type={type}
            onChange={this.handleFieldUpdate}
          >
            <Label>{label}</Label>
          </ValidatedFormGroup>
        ))}
        <FormGroup>
          <Row>
            {scoreFields.map(({ label }) => <Col key={label}>{label}</Col>)}
          </Row>
          <Row>
            {scoreFields.map(({ field, type, validFn }) => (
              <Col key={field}>
                <ValidatedInput
                  type={type}
                  field={field}
                  validFn={validFn}
                  value={player[field]}
                  onChange={this.handleFieldUpdate}
                />
              </Col>
            ))}
          </Row>
        </FormGroup>
        <FormGroup>
          <Label>Matches</Label>
          {historyRows}
        </FormGroup>
      </BasicFormModal>
    );
  }
}

export default PlayerHistoryForm;
