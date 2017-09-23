import React, { PureComponent } from 'react';

class MatchDetails extends PureComponent {
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
      case -1:
        return 1;
      case this.props.player.id:
        return 2;
      default:
        return -1;
    }
  }

  getWinnerId = (i) => {
    if (i === 0) return this.props.op.id;
    if (i === 1) return -1;
    if (i === 2) return this.props.player.id;
  }

  render() {
    const pId = this.props.player.id;
    const oId = this.props.op.id;
    let recordStr = this.props.match.score;
    const winnerId = this.props.match.winner;
    let outcomeStr = 'Draw';
    if (winnerId === pId) outcomeStr = 'Won';
    if (winnerId === oId) {
      outcomeStr = 'Lost';
      recordStr = recordStr.split("").reverse().join("");
    }
    if (winnerId === undefined) outcomeStr = 'Ongoing';
    return (
      <div>
        <p>{outcomeStr} - {this.props.op.name} ({recordStr})</p>
      </div>
    );
  }
}

export default MatchDetails;
