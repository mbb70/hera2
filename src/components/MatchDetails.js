import React, { PureComponent } from 'react';

class MatchDetails extends PureComponent {
  render() {
    const pId = this.props.player.id;
    const oId = this.props.op.id;
    let recordStr = this.props.match.score;
    const winnerId = this.props.match.winner;
    let outcomeStr = 'Draw';
    if (winnerId === pId) outcomeStr = 'Won';
    if (winnerId === oId) {
      outcomeStr = 'Lost';
      recordStr = recordStr
        .split('')
        .reverse()
        .join('');
    }
    if (winnerId === undefined) outcomeStr = 'Ongoing';
    return (
      <div>
        <p>
          {outcomeStr} - {this.props.op.name} ({recordStr})
        </p>
      </div>
    );
  }
}

export default MatchDetails;
