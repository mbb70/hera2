import React, { Component } from 'react';
import { Button, Container } from 'reactstrap';
import ButtonRow from './ButtonRow';

class MatchDetails extends Component {
  handleToggleStatus = () => {
    this.props.toggleStatus(this.props.match.id);
  }

  handleAddRemoveGame = (i) => {
    if (i === 0) {
      this.props.addGame(this.props.match.id);
    } else {
      this.props.removeGame(this.props.match.id);
    }
  }

  getButtonIndex = (outcome) => {
    switch (outcome) {
      case this.props.op.id:
        return 0;
      case null:
        return 1;
      case this.props.player.id:
        return 2;
      default:
        return -1;
    }
  }

  getWinnerId = (i) => {
    if (i === 0) return this.props.op.id;
    if (i === 1) return null
    if (i === 2) return this.props.player.id;
  }

  render() {
    const pId = this.props.player.id;
    const oId = this.props.op.id;
    const wins = this.props.match.games.filter((w) => w === pId).length;
    const losses = this.props.match.games.filter((w) => w === oId).length;
    const draws = this.props.match.games.filter((w) => w === null).length;
    const frozen = this.props.frozen;
    const active = this.props.match.active;
    const recordStr = `${wins}-${losses}-${draws}`;
    const allDefined = this.props.match.games.filter(o => o === -1).length === 0;
    const matchId = this.props.match.id;
    const p1VsP2 = this.props.player.matchIds[this.props.player.matchIds.length - 1] === matchId;
    const p2VsP1 = this.props.op.matchIds[this.props.op.matchIds.length - 1] === matchId;
    const canSave = allDefined && p1VsP2 && p2VsP1;
    let outcomeStr = 'Draw';
    if (wins > losses) outcomeStr = 'Won';
    if (losses > wins) outcomeStr = 'Lost';
    return (
      <div>
        <div>
          <p>{outcomeStr} - {this.props.op.name} ({recordStr})</p>
        </div>
        <Container>
          {this.props.match.games.map((outcome, gameId) => {
            const selected = this.getButtonIndex(outcome);
            return (
              <ButtonRow
                key={ gameId }
                selected={ selected }
                onClick={ (i) => this.props.setGameOutcome(this.props.match.id, gameId, this.getWinnerId(i)) }
              >
                <Button disabled={(frozen || !active)} type='button' color='danger'>Lost</Button>
                <Button disabled={(frozen || !active)} type='button' color='warning'>Draw</Button>
                <Button disabled={(frozen || !active)} type='button' color='primary'>Won</Button>
              </ButtonRow>
            );
          })}
          {(!frozen && active) && (
            <ButtonRow onClick={this.handleAddRemoveGame}>
              <Button style={{borderRight: 'solid 1px'}} type='button' color='neutral'>Add</Button>
              <Button disabled={this.props.match.games.length <= 1} type='button' color='neutral'>Remove</Button>
            </ButtonRow>
          )}
          {(!frozen && canSave) && (
            <ButtonRow onClick={this.handleToggleStatus}>
              <Button type='button' color='info'>{active ? 'Finish' : 'Edit'}</Button>
            </ButtonRow>
          )}
        </Container>
      </div>
    );
  }
}

export default MatchDetails;
