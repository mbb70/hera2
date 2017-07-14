import React, { Component } from 'react';
import { Button, Label, FormGroup } from 'reactstrap';
import _ from 'lodash';
import BasicFormModal from './BasicFormModal';
import ValidatedFormGroup from './ValidatedFormGroup';
import ValidationUtils from '../utils/validationUtils';
import PlayerCard from './PlayerCard';
import MatchDetails from './MatchDetails';

class PlayerHistoryForm extends Component {
  initialState = () => {
    const matchIds = this.props.player.matchIds;
    const match = this.props.matches[matchIds[matchIds.length - 1]];
    return {
      player: {...this.props.player},
      match: {...match},
      playerChanged: false,
      matchChanged: false,
    }
  };

  state = this.initialState();

  handleKeyPress = (value, field) => {
    this.setState({ playerChanged: true, player: {...this.state.player, [field]: value }});
  }

  handleFormSubmit = () => {
    if (this.state.playerChanged) this.props.updatePlayer(this.state.player);
    if (this.state.matchChanged) this.props.updateMatch(this.state.match);
  }

  handleResetForm = () => {
    this.setState(this.initialState());
  }

  handleToggleStatus = (matchId) => {
    const match = _.cloneDeep(this.state.match);
    match.active = !match.active;
    this.setState({ match, matchChanged: true });
  }

  handleSetOutcome = (matchId, gameIdx, outcome) => {
    const match = _.cloneDeep(this.state.match);
    match.games[gameIdx] = outcome;
    const wins = match.games.filter((w) => w === match.p1).length;
    const losses = match.games.filter((w) => w === match.p2).length;
    let winner = null;
    if (wins > losses) winner = match.p1;
    if (losses > wins) winner = match.p2;
    match.winner = winner;
    this.setState({ match, matchChanged: true });
  }

  handleAddGame = (matchId) => {
    const match = _.cloneDeep(this.state.match);
    match.games.push(-1);
    this.setState({ match, matchChanged: true });
  }

  handleRemoveGame = (matchId) => {
    const match = _.cloneDeep(this.state.match);
    match.games.pop();
    this.setState({ match, matchChanged: true });
  }

  render() {
    const entryPoint = <PlayerCard {...this.props.player} players={this.props.players}/>;
    const player = this.state.player
    const header = player.name;
    const submitText='Update';
    const resetForm = this.handleResetForm;
    const onFormSubmit = this.handleFormSubmit;
    const invalid = !ValidationUtils.notEmpty(player.name);
    const dropped = player.dropped;
    const deleted = player.deleted;
    const leftButton = (
      <div style={{display: 'flex', marginRight: 'auto'}}>
        <Button
          type="button"
          color={deleted ? 'success' : 'danger'}
          style={{marginRight: '0.25rem'}}
          onClick={() => this.setState({ player: {...this.state.player, deleted: !deleted }, playerChanged: true})}
        >
          {deleted ? 'Undelete' : 'Delete' }
        </Button>
        <Button
          type="button"
          color={dropped ? 'success' : 'warning'}
          style={{marginRight: '0.25rem', marginLeft: '0.25rem'}}
          onClick={() => this.setState({ player: {...this.state.player, dropped: !dropped }, playerChanged: true})}
        >
          {dropped ? 'Activate' : 'Drop' }
        </Button>
      </div>
    );
    const fields = [
      { field: 'name', label: 'Name'},
    ]
    const historyRows = this.props.player.matchIds.map((matchId, i) => {
      const match = (matchId === this.state.match.id) ? this.state.match : this.props.matches[matchId];
      const opId = (match.p1 === this.props.player.id) ? match.p2 : match.p1;
      const op = this.props.players[opId];
      return (
        <MatchDetails
          frozen={i !== (this.props.player.matchIds.length - 1) || this.state.player.dropped || this.state.player.deleted}
          key={matchId}
          match={match}
          op={op}
          player={this.props.player}
          setGameOutcome={this.handleSetOutcome}
          addGame={this.handleAddGame}
          removeGame={this.handleRemoveGame}
          toggleStatus={this.handleToggleStatus}
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
              onChange={this.handleKeyPress}
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
