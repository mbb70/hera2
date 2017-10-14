import React, { PureComponent } from 'react';
import Hutils from '../utils/hutils'
import { CardImg, CardTitle, CardText, CardBlock, Card } from 'reactstrap';

class PlayerCard extends PureComponent {
  render() {
    const cardStyle = {
      opacity: this.props.dropped ? 0.5 : 1,
    }
    const score = this.props.settings ? Hutils.getScore(this.props, this.props.settings) : undefined;
    return (
      <Card style={cardStyle} tag="a" className="width-initial-xs-down" onClick={this.props.onClick}>
        <CardImg top width="100%" src="player_image.png" alt="card image cap" />
        <CardBlock>
          <CardTitle>
            {this.props.addPlayerCard && (
              <div className="add-player-icon d-inline-block"></div>
            )}
            {this.props.name}
          </CardTitle>
          <CardText>
            {this.props.playing !== undefined && (
              <span className="card-playing d-block">Playing: {this.props.players[this.props.playing].name}</span>
            )}
            {score !== undefined && (
              <span className="card-playing d-block">Score: {score}</span>
            )}
          </CardText>
        </CardBlock>
      </Card>
    );
  }
}

export default PlayerCard;
