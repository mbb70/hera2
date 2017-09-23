import React, { PureComponent } from 'react';
import { Button, Label, FormGroup } from 'reactstrap';
import BasicFormModal from './BasicFormModal';
import ValidatedFormGroup from './ValidatedFormGroup';
import ValidationUtils from '../utils/validationUtils';
import PlayerCard from './PlayerCard';
import MatchDetails from './MatchDetails';

class PlayerHistoryForm extends PureComponent {
  state = {
    player: {...this.props.player},
  };

  handleFieldUpdate = (field, value) => {
    this.setState({player: {...this.state.player, [field]: value }});
  }

  handleFormSubmit = () => {
    this.props.updatePlayer(this.state.player);
  }

  handleResetForm = () => {
    this.setState({player: {...this.props.player}});
  }

  render() {
    const entryPoint = <PlayerCard {...this.props.player} players={this.props.players}/>;
    const player = this.state.player;
    const header = player.name;
    const submitText='Update';
    const resetForm = this.handleResetForm;
    const onFormSubmit = this.handleFormSubmit;
    const invalid = !ValidationUtils.notEmpty(player.name);
    const dropped = player.dropped;
    const deleted = player.deleted;
    const leftButton = (
      <div className="d-flex mr-auto">
        <Button
          type="button"
          color={deleted ? 'success' : 'danger'}
          style={{marginRight: '0.25rem'}}
          onClick={() => this.handleFieldUpdate('deleted', !deleted)}
        >
          {deleted ? 'Undelete' : 'Delete' }
        </Button>
        <Button
          type="button"
          color={dropped ? 'success' : 'warning'}
          style={{marginRight: '0.25rem', marginLeft: '0.25rem'}}
          onClick={() => this.handleFieldUpdate('dropped', !dropped)}
        >
          {dropped ? 'Activate' : 'Drop' }
        </Button>
      </div>
    );
    const fields = [
      { field: 'name', label: 'Name'},
    ]
    const historyRows = this.props.player.matchIds.map((matchId, i) => {
      const match = this.props.matches[matchId];
      const opId = (match.p1 === this.props.player.id) ? match.p2 : match.p1;
      const op = this.props.players[opId];
      return (
        <MatchDetails
          key={matchId}
          match={match}
          op={op}
          player={this.props.player}
        />
      )
    });
    return (
      <BasicFormModal {...{entryPoint, header, invalid, submitText, resetForm, onFormSubmit, leftButton}}>
        {fields.map(({ field, label }, i) => {
          return (
            <ValidatedFormGroup
              key={i}
              field={field}
              value={player[field]}
              valid={ValidationUtils.notEmpty}
              onChange={this.handleFieldUpdate}
            >
              <Label>{label}</Label>
            </ValidatedFormGroup>
          );
        })}
        <FormGroup>
          <Label>Matches</Label>
          {historyRows}
        </FormGroup>
      </BasicFormModal>
    );
  }
}

export default PlayerHistoryForm;
